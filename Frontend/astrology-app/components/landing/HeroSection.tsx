import MandalaSVG from './MandalaSVG'

const stats = [
  { value: '3,500+', label: 'Individuals' },
  { value: '10+', label: 'Countries' },
  { value: '250K+', label: 'Lives Touched' },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(15,10,26,0.92) 45%, rgba(15,10,26,0.25) 100%)',
        }}
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[3px] uppercase text-amber font-sans">
            Vedic Astrology · ज्योतिष
          </p>

          <h1 className="font-serif text-5xl leading-tight text-amber">
            Stuck in a{' '}
            <em className="text-saffron not-italic">doubt?</em>
          </h1>

          <p className="text-lg italic text-cosmic font-serif">
            दौड़ का ये फेरा, कौन सा रास्ता है मेरा?
          </p>

          <p className="text-starlight/80 max-w-md leading-relaxed">
            Ancient Vedic wisdom meets modern clarity. Generate your Kundali,
            uncover your Doshas, and find the path that was always yours.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-saffron text-white text-sm tracking-wide hover:bg-saffron/80 transition-colors"
            >
              अपनी Kundali बनाएं →
            </a>
            <a
              href="https://www.linkedin.com/in/vedantmadne"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gold/50 text-gold text-sm tracking-wide hover:border-gold hover:bg-gold/10 transition-colors"
            >
              Learn More
            </a>
          </div>

          <div className="flex gap-8 pt-4 border-t border-gold/20">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-amber text-xl font-bold">{s.value}</p>
                <p className="text-cosmic text-xs tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <MandalaSVG className="w-80 h-80 text-gold animate-spin-slow opacity-30" />
        </div>
      </div>
    </section>
  )
}
