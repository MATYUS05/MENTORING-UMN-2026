// src/featured/division/types.ts
export interface Member {
  id: string;
  name: string;
  position: string;
  image: string;
  nim?: string;
}

export interface Division {
  id: string;
  name: string;
  logo: string;
  description: string;
  members: Member[];
}
