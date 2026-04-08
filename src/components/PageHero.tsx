import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function PageHero({
  title,
  highlight,
  subtitle,
  breadcrumbs,
}: {
  title: string;
  highlight: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <>
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-white pb-16 pt-32">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-white to-brand-cream-dark" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(28,67,50,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(28,67,50,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Decorative accent line */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

        <div className="container-xl relative z-10">
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-brand-dark md:text-6xl lg:text-7xl">
            {title} <span className="accent">{highlight}</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-grey">{subtitle}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="border-b border-brand-sand bg-brand-cream">
        <div className="container-xl flex items-center gap-2 py-3 text-xs text-brand-grey">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-brand-sand-dark">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-brand-dark"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-brand-dark">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </nav>
    </>
  );
}
