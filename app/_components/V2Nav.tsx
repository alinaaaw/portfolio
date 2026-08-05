type V2NavProps = {
  active?: "about" | "projects" | "notes" | "away";
  label: string;
};

const links = [
  { href: "/about", id: "about", label: "ABOUT" },
  { href: "/projects", id: "projects", label: "PROJECTS" },
  { href: "/notes", id: "notes", label: "NOTES" },
  { href: "/away", id: "away", label: "AWAY" },
] as const;

export default function V2Nav({ active, label }: V2NavProps) {
  return (
    <header className="inner-header">
      <a className="inner-brand" href="/" aria-label="Return to the Focus Field">
        ALINA.WU <span>/ {label}</span>
      </a>
      <nav className="inner-nav" aria-label="Portfolio sections">
        {links.map((link) => (
          <a key={link.id} className={active === link.id ? "is-active" : ""} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="field-return" href="/">FIELD ↗</a>
    </header>
  );
}
