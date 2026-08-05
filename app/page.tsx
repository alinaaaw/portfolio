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

          <a className="version-card version-card-active version-card-v2" href="/version2">
            <span className="version-number">02</span>
            <div>
              <p>AVAILABLE NOW</p>
              <h2>The Focus Field</h2>
              <span>An animated spatial interface with five signals and no controls to memorize.</span>
            </div>
            <strong>OPEN VERSION 2 →</strong>
          </a>
        </section>

        <footer className="version-index-footer">
          <span>VERSIONED LOCALLY</span>
          <a href="/version2">CURRENT: VERSION 2</a>
        </footer>
      </main>
    </>
  );
}
