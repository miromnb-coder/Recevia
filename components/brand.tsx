export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15" fill="#111" />
      <circle cx="11" cy="16" r="2.1" fill="#fff" />
      <circle cx="16" cy="16" r="2.1" fill="#fff" />
      <circle cx="21" cy="16" r="2.1" fill="#fff" />
    </svg>
  );
}
