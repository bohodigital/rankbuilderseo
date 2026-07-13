import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label="Rank Builder SEO home">
          <span className="wordmark-box">RB</span>
          <span>Rank Builder<br />SEO</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/articles">Articles</Link>
          <Link href="/glossary">Glossary</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/method">Method</Link>
        </nav>
        <Link className="header-link" href="/about">About the desk ↗</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <p className="footer-kicker">Rank Builder SEO</p>
          <h2>Useful SEO answers, on repeat.</h2>
        </div>
        <div className="footer-nav">
          <div><span>Read</span><Link href="/articles">Articles</Link><Link href="/glossary">Glossary</Link><Link href="/lab">Experiment lab</Link></div>
          <div><span>Trust</span><Link href="/method">Research method</Link><Link href="/about">About</Link><Link href="/about#corrections">Corrections</Link><Link href="/privacy">Privacy</Link></div>
        </div>
      </div>
      <div className="shell footer-bottom"><span>Independent SEO research desk</span><span>Facts / inference / opinion — kept separate.</span></div>
    </footer>
  );
}
