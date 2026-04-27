export default function MandalaSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="160" cy="160" r="154" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="160" cy="160" r="136" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <circle cx="160" cy="160" r="110" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <polygon points="160,18 294,238 26,238" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      <polygon points="160,302 294,82 26,82" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      <polygon points="160,58 264,218 56,218" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <polygon points="160,262 264,102 56,102" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <polygon points="160,95 232,195 88,195" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.25" />
      <polygon points="160,225 232,125 88,125" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.25" />
      <ellipse cx="160" cy="42" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(0 160 42)" />
      <ellipse cx="243.3" cy="76.7" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(45 243.3 76.7)" />
      <ellipse cx="278" cy="160" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(90 278 160)" />
      <ellipse cx="243.3" cy="243.3" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(135 243.3 243.3)" />
      <ellipse cx="160" cy="278" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(180 160 278)" />
      <ellipse cx="76.7" cy="243.3" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(225 76.7 243.3)" />
      <ellipse cx="42" cy="160" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(270 42 160)" />
      <ellipse cx="76.7" cy="76.7" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(315 76.7 76.7)" />
      <circle cx="160" cy="160" r="24" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      <circle cx="160" cy="160" r="5" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
