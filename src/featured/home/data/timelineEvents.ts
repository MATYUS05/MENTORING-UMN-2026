// src/featured/home/data/timelineEvents.ts
const placeholder = "/placeholder.webp";

export interface TimelineEvent {
  id: number;
  title: string;
  image: string;
  description: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Event 1",
    image: placeholder,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Event 2",
    image: placeholder,
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 3,
    title: "Event 3",
    image: placeholder,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];