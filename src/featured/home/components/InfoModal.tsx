// src/featured/home/components/InfoModal.tsx
import { font } from "../../../shared/typography/font";
import ModalCloseButton from "./ModalCloseButton";

export interface InfoContent {
  title: string;
  paragraphs: string[];
}

interface InfoModalProps {
  content: InfoContent | null;
  onClose: () => void;
}

export default function InfoModal({ content, onClose }: InfoModalProps) {
  if (!content) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/40 px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border-2 border-neutral-stone bg-neutral-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClick={onClose} />
        <h3 className={`${font.h3} pr-8 text-neutral-charcoal-deep`}>
          {content.title}
        </h3>
        <div className="mt-4 flex flex-col gap-3 text-left">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} className={`${font.body} text-neutral-stone`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}