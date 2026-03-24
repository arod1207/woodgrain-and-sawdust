import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-cream-dark bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-walnut transition-colors hover:text-amber"
          aria-label="Woodgrain & Sawdust Home"
        >
          <Image
            src="/logo.jpg"
            alt="Woodgrain & Sawdust"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="font-heading hidden sm:inline">
            Woodgrain & Sawdust
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8" aria-label="Main navigation">
          <Link
            href="/"
            className="relative text-sm font-medium text-charcoal-light transition-colors hover:text-amber after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-amber after:transition-all hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/plans"
            className="relative text-sm font-medium text-charcoal-light transition-colors hover:text-amber after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-amber after:transition-all hover:after:w-full"
          >
            Plans
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
