import { useEffect, useRef, useState } from 'react';

// Loader copy: edit these lines to change the opening sequence.
const LOADER_LINES = [
  '> initializing portfolio...',
  '> loading profile: ben damti',
  '> role: software engineer',
  '> cooking up',
  '> building thoughtful digital products',
  '> system ready',
];

// Loader timing: all values are in milliseconds.
const MIN_LOADER_DURATION = 850;
const MAX_LOADER_DURATION = 3500;
const READY_HOLD_DURATION = 400;
const LOADER_FADE_DURATION = 800;
const CHARACTER_DELAY = 11;
const LINE_DELAY = 90;

type PortfolioLoaderProps = {
  backgroundReady: boolean;
};

export function PortfolioLoader({ backgroundReady }: PortfolioLoaderProps) {
  const reduceMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const startedAt = useRef(performance.now());
  const exitStarted = useRef(false);
  const typingFinished = useRef(reduceMotion.current);
  const [displayedLines, setDisplayedLines] = useState(() =>
    reduceMotion.current ? LOADER_LINES : LOADER_LINES.map(() => ''),
  );
  const [typingComplete, setTypingComplete] = useState(reduceMotion.current);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isMounted) {
      document.documentElement.classList.remove('portfolio-is-loading');
      return;
    }

    document.documentElement.classList.add('portfolio-is-loading');
    const preventBackgroundTabbing = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', preventBackgroundTabbing);

    return () => {
      document.documentElement.classList.remove('portfolio-is-loading');
      window.removeEventListener('keydown', preventBackgroundTabbing);
    };
  }, [isMounted]);

  useEffect(() => {
    if (reduceMotion.current) {
      return;
    }

    let lineIndex = 0;
    let characterIndex = 0;
    let timer = 0;

    const typeNextCharacter = () => {
      if (typingFinished.current) {
        return;
      }

      const line = LOADER_LINES[lineIndex];

      if (!line) {
        typingFinished.current = true;
        setDisplayedLines([...LOADER_LINES]);
        setTypingComplete(true);
        return;
      }

      const currentLineIndex = lineIndex;
      const nextCharacterIndex = characterIndex + 1;

      setDisplayedLines((currentLines) => {
        const nextLines = [...currentLines];
        nextLines[currentLineIndex] = line.slice(0, nextCharacterIndex);
        return nextLines;
      });

      const lineFinished = nextCharacterIndex >= line.length;

      if (lineFinished) {
        lineIndex += 1;
        characterIndex = 0;
      } else {
        characterIndex = nextCharacterIndex;
      }

      timer = window.setTimeout(typeNextCharacter, lineFinished ? LINE_DELAY : CHARACTER_DELAY);
    };

    timer = window.setTimeout(typeNextCharacter, 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    let removalTimer = 0;

    const beginExit = () => {
      if (exitStarted.current) {
        return;
      }

      exitStarted.current = true;
      setIsExiting(true);
      removalTimer = window.setTimeout(() => setIsMounted(false), LOADER_FADE_DURATION);
    };

    const elapsed = performance.now() - startedAt.current;
    const fallbackTimer = window.setTimeout(beginExit, Math.max(0, MAX_LOADER_DURATION - elapsed));
    let completionTimer = 0;
    let readyTimer = 0;

    if (!typingComplete) {
      const completionDelay = Math.max(0, MAX_LOADER_DURATION - READY_HOLD_DURATION - elapsed);
      completionTimer = window.setTimeout(() => {
        typingFinished.current = true;
        setDisplayedLines([...LOADER_LINES]);
        setTypingComplete(true);
      }, completionDelay);
    }

    if (backgroundReady && typingComplete) {
      const delay = Math.max(READY_HOLD_DURATION, MIN_LOADER_DURATION - elapsed);
      readyTimer = window.setTimeout(beginExit, delay);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(completionTimer);
      window.clearTimeout(readyTimer);
      window.clearTimeout(removalTimer);
    };
  }, [backgroundReady, isMounted, typingComplete]);

  if (!isMounted) {
    return null;
  }

  const activeLine = typingComplete
    ? LOADER_LINES.length - 1
    : displayedLines.findIndex((line, index) => line.length < LOADER_LINES[index].length);

  return (
    <div
      className={`portfolio-loader${isExiting ? ' is-exiting' : ''}`}
      role="status"
      aria-label="Loading Ben Damti's portfolio"
      aria-live="polite"
    >
      <div className="portfolio-loader-terminal" aria-hidden="true">
        <p className="portfolio-loader-label">BEN.DAMTI / SYSTEM</p>
        <div className="portfolio-loader-code">
          {displayedLines.map((line, index) => (
            <p
              className={index === LOADER_LINES.length - 1 && line === LOADER_LINES[index] ? 'is-ready' : undefined}
              key={LOADER_LINES[index]}
            >
              {line}
              {index === activeLine ? <span className="portfolio-loader-cursor" /> : null}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
