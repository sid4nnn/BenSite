import { siteContent } from '../data/siteContent';

type ContactViewProps = {
  panelRef: (node: HTMLElement | null) => void;
};

export function ContactView({ panelRef }: ContactViewProps) {
  const { contact } = siteContent;

  return (
    <section ref={panelRef} className="view-panel contact-panel" data-view="contact" aria-label="Contact">
      <div className="view-stage">
        <div className="contact-inner">
          <div className="contact-header">
            <p className="section-kicker">Contact</p>
            <h1>{contact.heading}</h1>
            <p>{contact.intro}</p>
          </div>

          <div className="contact-links" aria-label="Social links">
            {contact.socialLinks.map((link) =>
              link.href ? (
                <a
                  className="contact-link"
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  key={link.label}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              ) : (
                <span className="contact-link contact-link-disabled" aria-disabled="true" key={link.label}>
                  <span>{link.label}</span>
                  <span aria-hidden="true">→</span>
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
