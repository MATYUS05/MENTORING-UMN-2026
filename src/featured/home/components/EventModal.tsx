// src/featured/home/components/EventModal.tsx
import type { TimelineEvent } from "../data/timelineEvents";
import { font } from "../../../shared/typography/font";
import ModalCloseButton from "./ModalCloseButton";

interface EventModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/40 px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-neutral-stone bg-neutral-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClick={onClose} />
        <img
          src={event.image}
          alt={event.title}
          className="mb-4 h-48 w-full rounded-xl border-2 border-neutral-stone object-cover"
        />
        <h3 className={`${font.h3} pr-8 text-neutral-charcoal-deep`}>
          {event.title}
        </h3>
        <p className={`${font.body} mt-3 text-neutral-stone`}>
          {event.description}
        </p>
      </div>
    </div>
  );
}