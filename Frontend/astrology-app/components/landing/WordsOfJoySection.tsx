'use client'

import { useState } from 'react'

type Card =
  | { type: 'video'; quote: string; author: string; role: string; videoSrc: string }
  | { type: 'quote'; quote: string; author: string; role: string }

const cards: Card[] = [
  {
    type: 'video',
    quote: 'Pehle sab confusing tha. Ab sab clear hai.',
    author: 'Priya S.',
    role: 'Delhi · Student',
    videoSrc: '',
  },
  {
    type: 'quote',
    quote:
      'The session helped me understand why I kept hitting the same walls in my career. Game changer.',
    author: 'Rahul M.',
    role: 'Mumbai · Business Owner',
  },
  {
    type: 'video',
    quote: 'I finally feel like I know my purpose. Jo confusion thi, wo gayi.',
    author: 'Ananya K.',
    role: 'Bangalore · Corporate',
    videoSrc: '',
  },
  {
    type: 'quote',
    quote:
      "Deepa told me things about my personality that I'd never shared with anyone. Incredible accuracy.",
    author: 'Vikram P.',
    role: 'Pune · Entrepreneur',
  },
]

export default function WordsOfJoySection() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(cards.length / 4)

  return (
    <section className="bg-surface py-20 px-8" aria-label="Client stories">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-3">
          Client Stories
        </p>
        <h2 className="font-serif text-3xl text-amber mb-2">
          Words of <span className="text-saffron">Joy</span>
        </h2>
        <p className="text-cosmic text-sm mb-12">
          Real moments, genuine smiles...
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) =>
            card.type === 'video' ? (
              <article
                key={i}
                className="flex flex-col gap-4 p-5 bg-raised border border-gold/20"
              >
                <div className="aspect-video bg-abyss flex items-center justify-center border border-gold/20">
                  <span className="text-saffron text-3xl">▶</span>
                </div>
                <p className="text-starlight/80 italic text-sm leading-relaxed">
                  &ldquo;{card.quote}&rdquo;
                </p>
                <div>
                  <p className="text-starlight text-xs font-semibold">{card.author}</p>
                  <p className="text-cosmic text-xs">{card.role}</p>
                </div>
              </article>
            ) : (
              <article
                key={i}
                className="flex flex-col gap-4 p-5 bg-raised border border-gold/20"
              >
                <span className="text-amber text-5xl font-serif leading-none">&ldquo;</span>
                <p className="text-starlight/80 italic text-sm leading-relaxed flex-1">
                  {card.quote}
                </p>
                <div>
                  <p className="text-starlight text-xs font-semibold">{card.author}</p>
                  <p className="text-cosmic text-xs">{card.role}</p>
                </div>
              </article>
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 border border-gold/40 text-gold hover:border-gold disabled:opacity-30 transition-colors"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 border border-gold/40 text-gold hover:border-gold disabled:opacity-30 transition-colors"
              aria-label="Next"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
