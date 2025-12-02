import type { FooterColumn } from "./Footer";

export default function LinkColumn({ title, links }: FooterColumn) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[#BCBCBC] hover:text-white transition-colors duration-200 text-sm"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
