export default function VersionIndex() {
  return (
    <>
      <link rel="stylesheet" href="/styles/version-index.css" />
      <main className="version-index-shell">
        <header className="version-index-header">
          <span>ALINA.WU / PORTFOLIO ARCHIVE</span>
          <span>SELECT A VERSION</span>
        </header>

        <section className="version-index-intro">
          <p>AN EVOLVING PERSONAL SPACE</p>
          <h1>Portfolio<br />versions.</h1>
          <p className="version-index-description">
            Each version preserves a distinct idea instead of quietly replacing
            the one before it. Open any checkpoint and compare how the space
            changes over time.
          </p>
        </section>

        <section className="version-grid" aria-label="Available portfolio versions">
          <a className="version-card version-card-active" href="/version1">
            <span className="version-number">01</span>
            <div>
              <p>AVAILABLE NOW</p>
              <h2>The Personal Workbench</h2>
              <span>Editorial structure, floating thoughts, projects, notes, and travel.</span>
            </div>
            <strong>OPEN VERSION 1 →</strong>
          </a>

          <article className="version-card version-card-planned" aria-label="Version 2 is not built yet">
            <span className="version-number">02</span>
            <div>
              <p>NEXT STUDY</p>
              <h2>Not defined yet</h2>
              <span>A separate space will be created here without changing Version 1.</span>
            </div>
            <strong>PLANNED</strong>
          </article>
        </section>

        <footer className="version-index-footer">
          <span>VERSIONED LOCALLY</span>
          <a href="/version1">CURRENT: VERSION 1</a>
        </footer>
      </main>
    </>
  );
}

