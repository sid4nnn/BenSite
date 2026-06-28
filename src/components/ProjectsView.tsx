import { type Project, siteContent } from '../data/siteContent';

type ProjectsViewProps = {
  panelRef: (node: HTMLElement | null) => void;
};

export function ProjectsView({ panelRef }: ProjectsViewProps) {
  return (
    <section ref={panelRef} className="view-panel projects-panel" data-view="projects" aria-label="Projects">
      <div className="view-stage">
        <div className="projects-inner">
          <div className="projects-header">
            <p className="section-kicker">Selected work</p>
            <h1>Projects</h1>
          </div>

          <div className="project-grid">
            {siteContent.projects.map((project) => (
              <ProjectCard project={project} key={project.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type ProjectCardProps = {
  project: Project;
};

function ProjectCard({ project }: ProjectCardProps) {
  const cardContent = (
    <>
      <div className="project-media" aria-label={`${project.title} project artwork`}>
        {project.assetPath ? (
          <img src={project.assetPath} alt="" />
        ) : (
          // Keep this placeholder until adding the project asset in assets/.
          <span aria-hidden="true" />
        )}
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <h2>{project.title}</h2>
          {project.status ? <span className="project-status">{project.status}</span> : null}
        </div>
        <p>{project.description}</p>
        {project.link ? (
          <div className="project-arrow" aria-hidden="true">
            →
          </div>
        ) : null}
      </div>
    </>
  );

  if (project.link) {
    return (
      <a className="project-card project-card-link" href={project.link} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    );
  }

  return <article className="project-card project-card-static">{cardContent}</article>;
}
