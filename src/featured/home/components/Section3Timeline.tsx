// src/featured/home/components/Section3Timeline.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import { timelineEvents, type TimelineEvent } from "../data/timelineEvents";
import EventModal from "./EventModal";

export default function Section3Timeline() {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-10 px-6 sm:px-12 md:px-20">
      <h2 className={`${font.h1} text-neutral-charcoal-deep`}>TIMELINE</h2>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {timelineEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => setActiveEvent(event)}
            className="flex w-40 flex-col items-center gap-3 rounded-xl border-2 border-neutral-stone bg-neutral-cream p-4 transition hover:scale-[1.03]"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-28 w-28 rounded-lg object-cover"
            />
            <span className={`${font.h3} text-neutral-charcoal`}>
              {event.title}
            </span>
          </button>
        ))}
      </div>
      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
}