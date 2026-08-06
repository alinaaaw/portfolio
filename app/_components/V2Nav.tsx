import Link from "next/link";

type V2NavProps = {
  active?: "about" | "projects" | "notes" | "away";
  label: string;
};

const links = [
  { href: "/about", id: "about", label: "LOCKER" },
  { href: "/projects", id: "projects", label: "WORKSHOP" },
  { href: "/notes", id: "notes", label: "ARCHIVE" },
  { href: "/away", id: "away", label: "ROUTES" },
] as const;

export default function V2Nav({ active, label }: V2NavProps) {
  return (
    <header className="inner-header">
      <Link className="inner-brand" href="/" aria-label="Return to the outdoor range">
        ALINA.WU <span>/ {label}</span>
      </Link>
      <nav className="inner-nav" aria-label="Portfolio sections">
        {links.map((link) => (
          <Link key={link.id} className={active === link.id ? "is-active" : ""} href={link.href}>
            <i className={`place-icon place-${link.id}`} aria-hidden="true"><b /><b /><b /></i>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <Link className="field-return" href="/">RANGE ↗</Link>
    </header>
  );
}
