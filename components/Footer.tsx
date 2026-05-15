import footerData from "../config/footer.yaml";

const { name, year, copyright, source } = footerData as {
  name: string;
  year: number;
  copyright: boolean;
  source: { label: string; href: string };
};

export default function Footer() {
  return (
    <div
      className="max-w-5xl mx-auto mt-20 pt-8 pb-24 px-6 flex items-center justify-between"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span className="section-label text-xs" style={{ color: "var(--muted)" }}>
        {copyright ? "© " : ""}{year} {name}
      </span>
      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="section-label text-xs transition-colors hover:text-white"
        style={{ color: "var(--muted)" }}
      >
        {source.label} →
      </a>
    </div>
  );
}
