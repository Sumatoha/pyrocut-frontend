export function PyrocutLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="8" fill="#0B0B0E" />
        <path
          d="M9.5 21.5 C 9 16 10.5 13 13.5 11 L 20 5.5 L 18 12.5 C 20.5 13.5 21.5 16.2 21.5 18.4 C 21.5 21 19 23.2 15.5 23.2 C 13 23.2 11 22.6 9.5 21.5 Z"
          fill="#FF5A1F"
        />
        <circle cx="20" cy="5.5" r="1.6" fill="#FFB85C" />
      </svg>
    </span>
  );
}
