"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavigationLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return <Link className={className} href={href} aria-current={active ? "page" : undefined} onClick={onClick}>{children}</Link>;
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="shell header-inner">
        <Link className="wordmark" href="/" prefetch={false}>
          <span className="wordmark-box">RB</span>
          <span>Rank Builder<br />SEO</span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={`${menuOpen ? "Close" : "Open"} primary navigation`}
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true">{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <nav
          id="primary-navigation"
          className={`primary-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <NavigationLink href="/articles" onClick={closeMenu}>Articles</NavigationLink>
          <NavigationLink href="/glossary" onClick={closeMenu}>Glossary</NavigationLink>
          <NavigationLink href="/lab" onClick={closeMenu}>Lab</NavigationLink>
          <NavigationLink href="/method" onClick={closeMenu}>Method</NavigationLink>
          <NavigationLink className="mobile-nav-link" href="/about" onClick={closeMenu}>About</NavigationLink>
        </nav>
        <Link className="header-link" href="/about" prefetch={false}>About the desk</Link>
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
          <div><span>Read</span><Link href="/articles" prefetch={false}>Articles</Link><Link href="/glossary" prefetch={false}>Glossary</Link><Link href="/lab" prefetch={false}>Experiment lab</Link></div>
          <div><span>Trust</span><Link href="/method" prefetch={false}>Research method</Link><Link href="/about" prefetch={false}>About</Link><Link href="/about#corrections" prefetch={false}>Corrections</Link><Link href="/privacy" prefetch={false}>Privacy</Link></div>
        </div>
      </div>
      <div className="shell footer-bottom"><span>Independent SEO research desk operated by Republic of Bohemia LLC.</span><span>Facts / inference / opinion — kept separate.</span></div>
    </footer>
  );
}
