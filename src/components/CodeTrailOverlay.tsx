import { useEffect, useRef } from 'react';

const CODE_FIELD_FRAGMENT_COUNT = 130;
const CODE_FIELD_OVERSCAN = 0.14;
const MIN_FRAGMENT_LINES = 1;
const MAX_FRAGMENT_LINES = 6;
const MIN_FRAGMENT_WIDTH = 120;
const MAX_FRAGMENT_WIDTH = 360;
const FRAGMENT_POSITION_SEED = 4217;
const CODE_FONT_SIZE = 13;
const CODE_LINE_HEIGHT = 16;
const CODE_OPACITY = 0.76;
const GRID_SIZE = 18;
const TRAIL_DURATION = 2300;
const TRAIL_DENSITY = 10;
const MAX_TRAIL_CELLS = 220;

const CODE_POOL = [
  'import { useEffect, useMemo, useReducer } from "react";',
  'const playback = usePlaybackState(streamId);',
  'await flux.loadPlaylist({ source: playlistUrl, epgUrl });',
  'type Channel = { id: string; epgId?: string; logoUrl?: string };',
  'const guide = await getEPGWindow(epgUrl, { hoursBefore: 2 });',
  'if (playback.bufferHealth < 0.35) switchRendition("low");',
  'stream.on("tick", (position, bufferHealth) => dispatch({ type: "stream:tick", position, bufferHealth }));',
  'return playlist.channels.map((channel) => ({ ...channel, programme }));',
  'const stream = createHlsStream(activeChannel.streamUrl, { lowLatencyMode: true });',
  'useEffect(() => syncEPG(activeChannel?.epgId), [activeChannel?.epgId]);',
  'const BetSlipSchema = z.object({ marketId: z.string(), stake: z.number().positive() });',
  'const session = await requireSession(request);',
  'const market = await db.market.findUniqueOrThrow({ where: { id: payload.marketId } });',
  'if (wallet.balance < payload.stake) return Response.json({ error: "insufficient_funds" });',
  'await tx.wallet.update({ where: { id: wallet.id }, data: { balance: nextBalance } });',
  'return tx.bet.create({ data: { userId, selectionId, odds, stake, status: "open" } });',
  'router.post("/api/auth/session", validateCredentials, issueSessionToken);',
  'jwt.verify(token, process.env.AUTH_SECRET);',
  'select id, odds, status from markets where event_id = $1 and locked_at is null;',
  'where user_id = $1 and expires_at > now() and revoked_at is null',
  'const normalizedTitle = title.trim().toLowerCase().replace(/\\s+/g, " ");',
  'const playlist = parseM3U(raw).filter((item) => item.url.startsWith("http"));',
  'PATCH /api/player/state',
  '{ channelId, muted, volume, lastSeenAt, rendition }',
  'export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };',
  'function resolveProgramme(channel: Channel, epg: Programme[]) {',
  '  return epg.find((slot) => slot.channelId === channel.epgId) ?? null;',
  '}',
  'const odds = await kbet.market.resolve(selection.marketId);',
  'await audit.log("wallet:withdraw", session.user.id);',
  'const nextState = reducer(playback, { type: "player:resume" });',
  'if (!selection || market.lockedAt) throw new ConflictError("market_locked");',
  'const event = await scores.findLive({ league, startsBefore: cutoff });',
  'const token = await auth.exchangeCodeForSession(code);',
  'db.$transaction(async (tx) => {',
  '  await tx.ledger.create({ data: entry });',
  '});',
  '// Flux: playlist, EPG, player state',
  '// KBet: wallet, markets, slips, auth',
  'const favoriteChannels = channels.filter((channel) => pinned.has(channel.id));',
  'const playerState = { paused: false, position, bitrate: level.bitrate };',
  'return Response.json({ ok: true, ticket, balance: nextBalance });',
  'const requestBody = await request.json() as CreateSlipInput;',
  'if (Date.now() - lastSyncAt > EPG_STALE_MS) await refreshGuide();',
];

type TrailCell = {
  x: number;
  y: number;
  size: number;
  createdAt: number;
  duration: number;
  opacity: number;
};

type CodeFragment = {
  x: number;
  y: number;
  lines: string[];
  width: number;
  fontSize: number;
  lineHeight: number;
  opacity: number;
  rotation: number;
  indent: number;
};

function isTouchOrReducedMotion() {
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function prepareCanvas(canvas: HTMLCanvasElement, width: number, height: number, dpr: number) {
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is unavailable.');
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return context;
}

function sliceLine(line: string, random: () => number) {
  if (line.length < 18 || random() > 0.4) return line;

  const maxStart = Math.max(1, Math.floor(line.length * 0.4));
  const start = Math.floor(random() * maxStart);
  const end = Math.min(line.length, start + 12 + Math.floor(random() * (line.length - start)));

  return line.slice(start, end);
}

function buildFragmentLines(random: () => number) {
  const lineCount = MIN_FRAGMENT_LINES + Math.floor(random() * (MAX_FRAGMENT_LINES - MIN_FRAGMENT_LINES + 1));
  const lines: string[] = [];
  let index = Math.floor(random() * CODE_POOL.length);

  for (let i = 0; i < lineCount; i += 1) {
    const source = random() > 0.62 ? CODE_POOL[Math.floor(random() * CODE_POOL.length)] : CODE_POOL[index % CODE_POOL.length];
    const indent = random() > 0.5 ? '  '.repeat(Math.floor(random() * 3)) : '';
    lines.push(`${indent}${sliceLine(source, random)}`);
    index += 1 + Math.floor(random() * 3);
  }

  return lines;
}

function buildCodeFragments(width: number, height: number) {
  const seed = FRAGMENT_POSITION_SEED + Math.floor(width * 13 + height * 19);
  const random = createSeededRandom(seed);
  const overscanX = width * CODE_FIELD_OVERSCAN;
  const overscanY = height * CODE_FIELD_OVERSCAN;
  const areaWidth = width + overscanX * 2;
  const areaHeight = height + overscanY * 2;
  const responsiveCount = Math.floor((width * height) / 9000);
  const count = Math.max(80, Math.min(180, Math.max(CODE_FIELD_FRAGMENT_COUNT, responsiveCount)));
  const fragments: CodeFragment[] = [];

  for (let i = 0; i < count; i += 1) {
    const fontVariation = 0.9 + random() * 0.22;
    const fragmentWidth = MIN_FRAGMENT_WIDTH + random() * (MAX_FRAGMENT_WIDTH - MIN_FRAGMENT_WIDTH);

    fragments.push({
      x: random() * areaWidth - overscanX,
      y: random() * areaHeight - overscanY,
      lines: buildFragmentLines(random),
      width: fragmentWidth,
      fontSize: CODE_FONT_SIZE * fontVariation,
      lineHeight: CODE_LINE_HEIGHT * (0.94 + random() * 0.16),
      opacity: (0.48 + random() * 0.42) * CODE_OPACITY,
      rotation: (random() * 4 - 2) * (Math.PI / 180),
      indent: random() * 22,
    });
  }

  return fragments;
}

export function CodeTrailOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const codeFieldRef = useRef(document.createElement('canvas'));
  const maskRef = useRef(document.createElement('canvas'));
  const cellsRef = useRef<TrailCell[]>([]);
  const animationRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    if (isTouchOrReducedMotion()) return undefined;

    const visibleCanvas = canvasRef.current;
    if (!visibleCanvas) return undefined;

    const initialVisibleContext = visibleCanvas.getContext('2d');
    const initialCodeFieldContext = codeFieldRef.current.getContext('2d');
    const initialMaskContext = maskRef.current.getContext('2d');

    if (!initialVisibleContext || !initialCodeFieldContext || !initialMaskContext) return undefined;

    let visibleContext: CanvasRenderingContext2D = initialVisibleContext;
    let codeFieldContext: CanvasRenderingContext2D = initialCodeFieldContext;
    let maskContext: CanvasRenderingContext2D = initialMaskContext;

    const drawCodeField = () => {
      const { width, height } = sizeRef.current;
      const fragments = buildCodeFragments(width, height);

      codeFieldContext.clearRect(0, 0, width, height);
      codeFieldContext.textBaseline = 'top';
      codeFieldContext.fillStyle = 'rgba(236, 232, 255, 1)';

      fragments.forEach((fragment) => {
        codeFieldContext.save();
        codeFieldContext.translate(fragment.x, fragment.y);
        codeFieldContext.rotate(fragment.rotation);
        codeFieldContext.beginPath();
        codeFieldContext.rect(-4, -4, fragment.width, fragment.lines.length * fragment.lineHeight + 8);
        codeFieldContext.clip();
        codeFieldContext.globalAlpha = fragment.opacity;
        codeFieldContext.font = `${fragment.fontSize}px "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace`;

        fragment.lines.forEach((line, index) => {
          const x = index % 2 === 0 ? 0 : fragment.indent;
          codeFieldContext.fillText(line, x, index * fragment.lineHeight);
        });

        codeFieldContext.restore();
      });
    };

    const resizeCanvases = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      sizeRef.current = { width, height, dpr };
      visibleContext = prepareCanvas(visibleCanvas, width, height, dpr);
      codeFieldContext = prepareCanvas(codeFieldRef.current, width, height, dpr);
      maskContext = prepareCanvas(maskRef.current, width, height, dpr);
      cellsRef.current = [];
      drawCodeField();
      visibleContext.clearRect(0, 0, width, height);
    };

    const drawMask = (now: number) => {
      const { width, height } = sizeRef.current;

      maskContext.clearRect(0, 0, width, height);
      cellsRef.current = cellsRef.current.filter((cell) => now - cell.createdAt < cell.duration);

      cellsRef.current.forEach((cell) => {
        const age = now - cell.createdAt;
        const progress = Math.min(age / cell.duration, 1);
        const opacity = Math.pow(1 - progress, 1.32) * cell.opacity;

        maskContext.globalAlpha = opacity;
        maskContext.fillStyle = '#fff';
        maskContext.fillRect(cell.x, cell.y, cell.size, cell.size);
      });

      maskContext.globalAlpha = 1;
    };

    const compositeVisibleLayer = () => {
      const { width, height } = sizeRef.current;

      visibleContext.clearRect(0, 0, width, height);
      visibleContext.globalCompositeOperation = 'source-over';
      visibleContext.drawImage(codeFieldRef.current, 0, 0, width, height);
      visibleContext.globalCompositeOperation = 'destination-in';
      visibleContext.drawImage(maskRef.current, 0, 0, width, height);
      visibleContext.globalCompositeOperation = 'source-over';
    };

    const render = (now: number) => {
      drawMask(now);
      compositeVisibleLayer();

      if (cellsRef.current.length > 0) {
        animationRef.current = window.requestAnimationFrame(render);
      } else {
        visibleContext.clearRect(0, 0, sizeRef.current.width, sizeRef.current.height);
        animationRef.current = null;
      }
    };

    const startAnimation = () => {
      if (animationRef.current === null) {
        animationRef.current = window.requestAnimationFrame(render);
      }
    };

    const stampTrail = (event: MouseEvent) => {
      const now = performance.now();
      const originX = snapToGrid(event.clientX);
      const originY = snapToGrid(event.clientY);
      const nextCells = cellsRef.current;

      for (let i = 0; i < TRAIL_DENSITY; i += 1) {
        if (Math.random() < 0.26) continue;

        const offsetX = snapToGrid((Math.random() - 0.5) * GRID_SIZE * 8);
        const offsetY = snapToGrid((Math.random() - 0.5) * GRID_SIZE * 8);
        const size = GRID_SIZE * (1 + Math.floor(Math.random() * 3));

        nextCells.push({
          x: originX + offsetX,
          y: originY + offsetY,
          size,
          createdAt: now,
          duration: TRAIL_DURATION + Math.random() * 700 - 300,
          opacity: 0.55 + Math.random() * 0.4,
        });
      }

      if (nextCells.length > MAX_TRAIL_CELLS) {
        nextCells.splice(0, nextCells.length - MAX_TRAIL_CELLS);
      }

      startAnimation();
    };

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
    window.addEventListener('mousemove', stampTrail, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvases);
      window.removeEventListener('mousemove', stampTrail);

      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas className="code-trail-overlay" ref={canvasRef} aria-hidden="true" />;
}
