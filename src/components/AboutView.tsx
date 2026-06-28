import { siteContent } from '../data/siteContent';

type AboutViewProps = {
  panelRef: (node: HTMLElement | null) => void;
};

export function AboutView({ panelRef }: AboutViewProps) {
  const { about, hero } = siteContent;

  return (
    <section ref={panelRef} className="view-panel about-panel" data-view="about" aria-label="About">
      <div className="about-hero">
        <div className="content">
          <div className="intro">
            <p className="intro-line">
              {hero.prefix} <strong>{hero.name}</strong>{hero.suffix}
            </p>
            <p className="intro-line intro-line-subtitle">{hero.subtitle}</p>
          </div>
        </div>
      </div>

      <section className="about-details" aria-label="Personal information and skills">
        <div className="about-inner">
          <p className="section-kicker">{about.kicker}</p>
          <p className="about-lead">{about.headline}</p>
          <div className="about-grid">
            <p className="about-copy">{about.intro}</p>
            <div className="info-groups">
              <InfoGroup title="Skills" items={about.skills} />
              <InfoGroup title="Programming Languages" items={about.languages} />
              <InfoGroup title="Technologies / Tools" items={about.technologies} />
              <InfoGroup title="Areas" items={about.areas} />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

type InfoGroupProps = {
  title: string;
  items: string[];
};

function InfoGroup({ title, items }: InfoGroupProps) {
  return (
    <div className="info-group">
      <h2>{title}</h2>
      <ul className="tag-list" aria-label={title}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
