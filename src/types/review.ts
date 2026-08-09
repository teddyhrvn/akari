import type { Media } from "@/types/anime";
import type { User } from "@/types/user";

export interface Review {
  id: string;

  user: User;
  media: Media;

  rating: number;
  content: string | null;

  createdAt: string;
  updatedAt: string;
}