export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#111" />
      <path
        fill="#fff"
        d="M11.2 8.4c0-.7.6-1.2 1.3-1.2h2.15c.4 0 .75.35.75.75V24c0 .4-.35.75-.75.75H12.5c-.7 0-1.3-.55-1.3-1.25V8.4Z"
      />
      <path
        fill="#fff"
        d="M17.4 7.95c0-.4.35-.75.75-.75H20.3c.7 0 1.3.55 1.3 1.2V23.5c0 .7-.6 1.25-1.3 1.25h-2.15c-.4 0-.75-.35-.75-.75V7.95Z"
      />
    </svg>
  );
}
