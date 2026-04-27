import GoldDivider from './GoldDivider'

export default function HowItWorksSection() {
  return (
    <section className="bg-surface py-20 px-8" aria-label="How it works">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[3px] uppercase text-amber">
            The Process
          </p>
          <h2 className="font-serif text-3xl text-amber">
            How Deepa&apos;s Shiksha works?
          </h2>
          <p className="text-starlight/70 leading-relaxed">
            Har sawaal ka jawab hai — bas sahi jagah dekhna hota hai. Deepa
            combines centuries of Vedic knowledge with modern psychological
            clarity to help you find your रास्ता.
          </p>
          <blockquote className="border-l-2 border-gold pl-4 italic text-cosmic">
            &ldquo;Kundali isn&apos;t fate. It&apos;s a map. You still choose how to walk.&rdquo;
          </blockquote>
          <a
            href="/auth/signup"
            className="self-start inline-flex items-center px-6 py-3 bg-saffron text-white text-sm tracking-wide hover:bg-saffron/80 transition-colors"
          >
            Discover Now
          </a>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-crimson border border-gold/40 p-8 flex flex-col items-center text-center gap-4">
            <div className="text-4xl text-amber">🪐</div>
            <h3 className="font-serif text-xl text-starlight">
              1:1 Strategic Session
            </h3>
            <p className="text-starlight/70 text-sm leading-relaxed">
              Birth chart analysis + current Dasha + remedies —
              tailored entirely to your life situation.
            </p>
            <a
              href="/auth/signup"
              className="mt-2 px-5 py-2 border border-amber text-amber text-sm tracking-wide hover:bg-amber hover:text-void transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16">
        <GoldDivider />
      </div>
    </section>
  )
}
