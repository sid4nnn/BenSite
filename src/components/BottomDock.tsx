import profilePicture from '../../assets/profilepic.jpg';
import type { ViewId } from '../data/siteContent';
import { siteContent, views } from '../data/siteContent';

type BottomDockProps = {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
};

export function BottomDock({ activeView, onNavigate }: BottomDockProps) {
  return (
    <nav className="dock" aria-label="Primary navigation">
      <a
        className="dock-logo"
        href="#about"
        aria-label={`${siteContent.ownerName} home`}
        onClick={(event) => {
          event.preventDefault();
          onNavigate('about');
        }}
      >
        <img src={profilePicture} alt="" aria-hidden="true" />
      </a>
      <div className="dock-nav">
        <span>{siteContent.ownerName}</span>
        {views.map((view) => (
          <a
            key={view}
            href={`#${view}`}
            aria-current={activeView === view ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(view);
            }}
          >
            {view[0].toUpperCase() + view.slice(1)}
          </a>
        ))}
      </div>
    </nav>
  );
}
