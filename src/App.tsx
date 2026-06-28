import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AboutView } from './components/AboutView';
import { BackgroundScene } from './components/BackgroundScene';
import { BottomDock } from './components/BottomDock';
import { CodeTrailOverlay } from './components/CodeTrailOverlay';
import { ContactView } from './components/ContactView';
import { ProjectsView } from './components/ProjectsView';
import { siteContent, type ViewId, views } from './data/siteContent';

function getViewFromHash(): ViewId {
  const hashView = window.location.hash.replace('#', '').toLowerCase();
  return views.includes(hashView as ViewId) ? (hashView as ViewId) : 'about';
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>(() => getViewFromHash());
  const panelRefs = useRef<Record<ViewId, HTMLElement | null>>({
    about: null,
    projects: null,
    contact: null,
  });

  const activeIndex = useMemo(() => views.indexOf(activeView), [activeView]);

  const showView = useCallback((nextView: ViewId, shouldResetScroll = true) => {
    setActiveView(nextView);

    if (shouldResetScroll) {
      panelRefs.current[nextView]?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  const navigateTo = useCallback(
    (nextView: ViewId) => {
      if (window.location.hash === `#${nextView}`) {
        showView(nextView, true);
        return;
      }

      window.location.hash = nextView;
    },
    [showView],
  );

  useEffect(() => {
    const onHashChange = () => {
      showView(getViewFromHash(), true);
    };

    if (!window.location.hash || !views.includes(getViewFromHash())) {
      history.replaceState(null, '', '#about');
    }

    showView(getViewFromHash(), false);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [showView]);

  return (
    <>
      <BackgroundScene />
      <CodeTrailOverlay />
      <div className={`contact-background-softener${activeView === 'contact' ? ' is-visible' : ''}`} aria-hidden="true" />
      <div className="top-mini">{siteContent.topLabel}</div>

      <main className="view-shell">
        <div className="view-track" style={{ transform: `translate3d(${-activeIndex * 100}%, 0, 0)` }}>
          <AboutView panelRef={(node) => { panelRefs.current.about = node; }} />
          <ProjectsView panelRef={(node) => { panelRefs.current.projects = node; }} />
          <ContactView panelRef={(node) => { panelRefs.current.contact = node; }} />
        </div>
      </main>

      <BottomDock activeView={activeView} onNavigate={navigateTo} />
    </>
  );
}
