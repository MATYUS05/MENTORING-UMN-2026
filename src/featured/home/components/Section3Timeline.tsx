// src/featured/home/components/Section3Timeline.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import { timelineEvents, type TimelineEvent } from "../data/timelineEvents";
import EventModal from "./EventModal";

export default function Section3Timeline() {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

  return (
    <section className="scrollbar-hide flex h-full w-max min-w-screen shrink-0 flex-col items-center justify-center gap-12 overflow-y-auto px-10 py-10 sm:px-16 md:px-24">
      <div
        className="flex flex-col items-center gap-12"
        style={{ transform: "translateY(-50px)" }}
      >
        <h2 className={`${font.h1} z-20 text-neutral-charcoal-deep`}>
          TIMELINE
        </h2>
        <div className="flex w-max flex-nowrap items-center justify-center">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex shrink-0 flex-row items-center">
              {index > 0 && (
                <div className="h-0 w-10 shrink-0 border-t-2 border-dashed border-neutral-stone sm:w-16 md:w-20" />
              )}
              <button
                onClick={() => setActiveEvent(event)}
                className="flex w-64 shrink-0 flex-col items-center gap-4 rounded-xl border-2 border-neutral-stone bg-neutral-cream p-6 transition hover:scale-[1.03] sm:w-80 md:w-96"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <span className={`${font.h3} text-neutral-charcoal`}>
                  {event.title}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
}