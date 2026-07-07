import Link from 'next/link';

// Global footer — makes the build-in-public and product pages discoverable from
// every route.
export default function SiteFooter() {
  const links: [string, string][] = [
    ['/me', 'My StellarFund'],
    ['/creator', 'Creator'],
    ['/proof', 'Proof'],
    ['/metrics', 'Metrics'],
    ['/growth', 'Growth report'],
    ['/changelog', 'Changelog'],
    ['/testimonials', 'Reviews'],
    ['/try', 'Try free'],
  ];
  return (
    <footer className="mt-auto border-t border-white/10 px-4 py-6 text-xs opacity-70">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="hover:text-indigo-300 hover:underline">
            {label}
          </Link>
        ))}
        <span className="opacity-40">·</span>
        <a
          href="https://github.com/BerkeBakir/stellarfund-master"
          target="_blank"
          rel="noreferrer"
          className="hover:text-indigo-300 hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
