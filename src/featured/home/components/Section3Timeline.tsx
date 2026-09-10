// src/featured/home/components/Section3Timeline.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import { timelineEvents, type TimelineEvent } from "../data/timelineEvents";
import EventModal from "./EventModal";
import SandCard from "../../../shared/components/SandCard";
import FramedBorder from "../../../shared/components/FramedBorder";

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
              <FramedBorder radius="1.75rem" className="w-72 shrink-0 transition hover:scale-[1.03] sm:w-80 md:w-96">
                <SandCard
                  as="button"
                  onClick={() => setActiveEvent(event)}
                  radius="1.75rem"
                  borderWidth="0"
                  className="block w-full"
                  style={{ background: "transparent", boxShadow: "none" }}
                  innerClassName="sand-card__inner--flat p-7"
                >
                  <div className="flex w-full flex-col items-center gap-7">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="aspect-video w-full rounded-xl border-2 border-neutral-stone object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center gap-3 rounded-xl border-2 border-neutral-stone bg-[#3B2418]">
                        {"???".split("").map((mark, i) => (
                          <span key={i} className={`${font.h1} text-brown-glow`}>
                            {mark}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="font-heading text-base font-extrabold uppercase tracking-[0.2em] text-charcoal-glow-soft sm:text-lg md:text-xl">
                      {event.title}
                    </span>
                  </div>
                </SandCard>
              </FramedBorder>
            </div>
          ))}
        </div>
      </div>
      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
}