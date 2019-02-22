import { User } from "./user";
import { DiningTiming } from "./dining-timing";

export class Comment {
  byUser: User;
  ofDiningTiming: DiningTiming;
  rating: string;
  text: string;
  objectId: string;
}
