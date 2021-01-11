import { Server, User } from "store/types";

export const concatOrReplace = <T>(array: T[], item: T, discrimField: string) => {
  const existing = array.findIndex((e) => e[discrimField] === item[discrimField]);
  if (existing !== -1) {
    array[existing] = item
  } else {
    array.push(item);
  }
  return Array.from(array);
}

export const multiConcatOrReplace = <T>(array: T[], items: T[], discrimField: string) => {
  let newArray = array;

  items.forEach((e) => {
    newArray = concatOrReplace(array, e, discrimField);
  });
  return newArray;
}

export const maybeConcatId = (array: Array<number>, id: number) => {
  if (!(id in array)) {
    array.push(id);
  }
  return Array.from(array);
}

export const removeDuplicates = <T>(array: T[], discrimField?: string) => {
  return array.filter((e, i) => array.findIndex((e2) => {
    if (discrimField)
      return e2[discrimField] === e[discrimField]
    else
      return e2 === e;
  }) === i);
}

export function cleanServer(server: Server) {
  return {
    ...server,
    members: server.members.map((mem) => {
      if (mem.user) {
        mem.userId = mem.user.id;
        delete mem.user;
      }
      return mem;
    }),
    channels: server.channels.sort((a, b) => a.id - b.id)
  }
}
export function cleanConversation(server: Server, me: User) {
  return {
    ...server,
    name: server.members.filter((e) => e.user.id !== me.id).map((e) => e.user.username).join(', '),
    members: server.members.map((mem) => {
      if (mem.user) {
        mem.userId = mem.user.id;
        delete mem.user;
      }
      return mem;
    }),
    channels: server.channels.sort((a, b) => a.id - b.id)
  }
}
