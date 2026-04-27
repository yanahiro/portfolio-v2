type Props = {
  className?: string;
  title?: string;
};

export default function BrandLogo({ className, title = "Hiroki Yanagisawa" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 495.74 591.62"
      fill="currentColor"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <path
        d="M484.61 4.16A4.34 4.34 0 0 0 478.44.48L305 81.09a4.34 4.34 0 0 0-.3 7.72l38.48 21.61L238.91 272.67a5.87 5.87 0 0 1-9.93-.06L127.88 112.74a4.33 4.33 0 0 0-3.67-2H2.08A2.47 2.47 0 0 0 0 114.45L169.36 396.84a5.85 5.85 0 0 1 .84 3v186a5.87 5.87 0 0 0 5.87 5.87H291.71a5.87 5.87 0 0 0 5.87-5.87V400a5.85 5.85 0 0 1 1-3.24L449.28 170l39.61 22.25a4.35 4.35 0 0 0 6.47-4Z"
        transform="translate(0.38 -0.07)"
      />
    </svg>
  );
}
