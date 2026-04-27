import GoldDivider from './GoldDivider'

const testimonials = [
  {
    name: 'Manoj Bajpayee',
    role: 'Actor',
    quote: "Deepa's insights changed the way I see my path. Pure clarity.",
  },
  {
    name: 'Sourav Joshi',
    role: 'Content Creator',
    quote: 'I came with confusion, I left with direction. Incredible session.',
  },
  {
    name: 'Ranveer Allahbadia',
    role: 'Podcaster',
    quote: 'Ancient wisdom delivered with modern precision. Highly recommend.',
  },
  {
    name: 'Sanjiv Goenka',
    role: 'Entrepreneur',
    quote: 'The Kundali reading was spot-on. I wish I had done this earlier.',
  },
]

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-surface py-20 px-8"
      aria-label="Testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-3">
          भरोसा — Testimonials
        </p>
        <h2 className="font-serif text-3xl text-amber mb-12">
          What people say—
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col gap-4 p-5 bg-raised border border-gold/30 hover:border-gold/60 hover:shadow-[0_0_20px_rgba(200,146,10,0.15)] transition-all duration-300"
            >
              <div className="aspect-video bg-abyss flex items-center justify-center border border-gold/20">
                <span className="text-amber text-3xl">▶</span>
              </div>
              <div>
                <p className="text-starlight font-semibold text-sm">{t.name}</p>
                <p className="text-cosmic text-xs">{t.role}</p>
              </div>
              <p className="text-starlight/70 text-sm italic leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <a
                href="#"
                className="text-amber text-xs tracking-wide hover:text-amber/80 transition-colors"
              >
                ▶ Watch
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16">
        <GoldDivider />
      </div>
    </section>
  )
}
