export default function CtaBanner() {
  return (
    <section
      className="bg-deep-red py-20 px-8 text-center"
      aria-label="Call to action"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <p className="text-xs tracking-[3px] uppercase text-starlight/40">
          अभी शुरू करें
        </p>
        <h2 className="font-serif text-4xl text-amber leading-snug">
          अपना भविष्य जानें —{' '}
          <span className="text-starlight">Know Your Destiny</span>
        </h2>
        <p className="text-starlight/70 text-sm max-w-md">
          Generate your free Kundali today. Ancient wisdom, modern clarity.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <a
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-7 py-3 bg-amber text-void text-sm font-semibold tracking-wide hover:bg-amber/80 transition-colors"
          >
            🪐 अपनी Kundali बनाएं
          </a>
          <a
            href="/auth/signup?type=session"
            className="inline-flex items-center px-7 py-3 border border-amber text-amber text-sm tracking-wide hover:bg-amber/10 transition-colors"
          >
            Book a 1:1 Session
          </a>
        </div>
      </div>
    </section>
  )
}
