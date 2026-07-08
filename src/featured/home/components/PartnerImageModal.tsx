// src/featured/home/components/PartnerImageModal.tsx
import { font } from "../../../shared/typography/font";
import ModalCloseButton from "./ModalCloseButton";

interface Partner {
  name: string;
  src: string;
}

interface PartnerImageModalProps {
  partner: Partner | null;
  onClose: () => void;
}

export default function PartnerImageModal({
  partner,
  onClose,
}: PartnerImageModalProps) {
  if (!partner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/40 px-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-w-sm flex-col items-center gap-4 rounded-2xl border-2 border-neutral-stone bg-neutral-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClick={onClose} />
        <img
          src={partner.src}
          alt={partner.name}
          className="h-48 w-48 rounded-xl border-2 border-neutral-stone object-cover"
        />
        <span className={`${font.h3} text-neutral-charcoal-deep`}>
          {partner.name}
        </span>
      </div>
    </div>
  );
}