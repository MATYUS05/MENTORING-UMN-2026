// src/featured/home/components/EventModal.tsx
import type { TimelineEvent } from "../data/timelineEvents";
import { font } from "../../../shared/typography/font";
import ModalCloseButton from "./ModalCloseButton";
import SandCard from "../../../shared/components/SandCard";

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
      <SandCard
        className="w-full max-w-md"
        innerClassName="p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClick={onClose} />
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="mb-4 h-48 w-full rounded-xl border-2 border-neutral-stone object-cover"
          />
        ) : (
          <div className="mb-4 flex h-48 w-full items-center justify-center rounded-xl border-2 border-neutral-stone bg-[#3B2418]">
            <span className={`${font.h1} text-brown-glow`}>???</span>
          </div>
        )}
        <h3 className={`${font.h3} pr-8 text-charcoal-glow`}>
          {event.title}
        </h3>
        <p className={`${font.body} mt-3 text-neutral-stone`}>
          {event.description}
        </p>
      </SandCard>
    </div>
  );
}