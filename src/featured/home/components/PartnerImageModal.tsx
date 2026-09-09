// src/featured/home/components/PartnerImageModal.tsx
import { font } from "../../../shared/typography/font";
import ModalCloseButton from "./ModalCloseButton";
import SandCard from "../../../shared/components/SandCard";

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
      <SandCard
        className="max-w-sm"
        innerClassName="flex flex-col items-center gap-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClick={onClose} />
        <img
          src={partner.src}
          alt={partner.name}
          className="h-48 w-48 rounded-xl object-cover"
        />
        <span className={`${font.h3} text-charcoal-glow`}>
          {partner.name}
        </span>
      </SandCard>
    </div>
  );
}