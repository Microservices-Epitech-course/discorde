import { ReduxState } from "store";
import { User } from "./types";

export function getUsersFromIds(state: ReduxState, ids: Array<number>): Array<User> {
  return state.users.filter((e) => ids.includes(e.id));
}
export function getUserFromId(state: ReduxState, id: number): User {
  return state.users.find((e) => e.id === id);
}
export function getNotMe(users: User[], me: User): User {
  return users.find((e) => e.id !== me.id);
}