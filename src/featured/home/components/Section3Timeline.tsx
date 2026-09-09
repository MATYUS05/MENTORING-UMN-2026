// src/featured/home/components/Section3Timeline.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import { timelineEvents, type TimelineEvent } from "../data/timelineEvents";
import EventModal from "./EventModal";
import SandCard from "../../../shared/components/SandCard";

export default function Section3Timeline() {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

  return (
    <section className="scrollbar-hide flex h-full w-max min-w-screen shrink-0 flex-col items-center justify-center gap-12 overflow-y-auto px-10 py-10 sm:px-16 md:px-24">
      <div
        className="flex flex-col items-center gap-12"
        style={{ transform: "translateY(-50px)" }}
      >
        <h2 className={`${font.h1} z-20 text-charcoal-glow`}>
          TIMELINE
        </h2>
        <div className="flex w-max flex-nowrap items-center justify-center">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex shrink-0 flex-row items-center">
              {index > 0 && (
                <div className="h-0 w-10 shrink-0 border-t-2 border-dashed border-neutral-stone sm:w-16 md:w-20" />
              )}
              <SandCard
                as="button"
                onClick={() => setActiveEvent(event)}
                radius="0.75rem"
                className="w-64 shrink-0 transition hover:scale-[1.03] sm:w-80 md:w-96"
                innerClassName="flex flex-col items-center gap-4 p-6"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-[#3B2418]">
                    <span className={`${font.h1} text-brown-glow`}>???</span>
                  </div>
                )}
                <span className={`${font.h3} text-charcoal-glow-soft`}>
                  {event.title}
                </span>
              </SandCard>
            </div>
          ))}
        </div>
      </div>
      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
}