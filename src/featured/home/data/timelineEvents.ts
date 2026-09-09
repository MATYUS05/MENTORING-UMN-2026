// src/featured/home/data/timelineEvents.ts
export interface TimelineEvent {
  id: number;
  title: string;
  image: string | null;
  description: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Coming Soon",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Coming Soon",
    image: null,
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 3,
    title: "Coming Soon",
    image: null,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 4,
    title: "Coming Soon",
    image: null,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];