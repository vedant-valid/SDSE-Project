const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'समाधान', href: '/solutions' },
  { label: 'PRODUCTS', href: '/products' },
  { label: '9 GRAHAS', href: '/grahas' },
  { label: 'भरोसा', href: '#testimonials' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'CONTACT', href: '/contact' },
]

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-surface border-b border-gold/20"
      aria-label="Main navigation"
    >
      <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
        <span className="text-amber">★</span>
        <span className="text-amber font-serif">Deepa&apos;s Vision</span>
      </a>

      <ul className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/auth/signup"
        className="hidden md:inline-flex items-center px-5 py-2 text-sm tracking-wider border border-saffron text-saffron hover:bg-saffron hover:text-white transition-colors duration-200"
      >
        Let&apos;s Sit
      </a>
    </nav>
  )
}
