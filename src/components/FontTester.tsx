import { useState } from 'react';

export const SHOW_FONT_TESTER = false; // Set to false before deploying.

const FONT_OPTIONS = [
  { name: 'Fenwick', stack: '"fenwick", "Manrope", sans-serif' },
  { name: 'Manrope', stack: '"Manrope", sans-serif' },
  { name: 'Space Grotesk', stack: '"Space Grotesk", sans-serif' },
  { name: 'Outfit', stack: '"Outfit", sans-serif' },
  { name: 'Syne', stack: '"Syne", sans-serif' },
  { name: 'DM Sans', stack: '"DM Sans", sans-serif' },
];

export function FontTester() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeFont, setActiveFont] = useState(FONT_OPTIONS[0].name);

  if (!isVisible) {
    return null;
  }

  const selectFont = (name: string, stack: string) => {
    document.documentElement.style.setProperty('--font-display', stack);
    setActiveFont(name);
  };

  return (
    <aside className="font-tester" aria-label="Display font tester">
      <div className="font-tester-header">
        <span>Display font</span>
        <button type="button" onClick={() => setIsVisible(false)} aria-label="Hide font tester" title="Hide">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="font-tester-options">
        {FONT_OPTIONS.map((font) => (
          <button
            type="button"
            className={`font-tester-option${activeFont === font.name ? ' is-active' : ''}`}
            style={{ fontFamily: font.stack }}
            onClick={() => selectFont(font.name, font.stack)}
            aria-pressed={activeFont === font.name}
            key={font.name}
          >
            {font.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
