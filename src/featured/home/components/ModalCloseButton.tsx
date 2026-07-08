// src/featured/home/components/ModalCloseButton.tsx
interface ModalCloseButtonProps {
  onClick: () => void;
}

export default function ModalCloseButton({ onClick }: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-stone transition hover:text-neutral-charcoal-deep"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="19" y1="5" x2="5" y2="19" />
      </svg>
    </button>
  );
}