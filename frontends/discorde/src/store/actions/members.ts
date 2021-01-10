import { subscribe } from "api/websocket";
import { Member } from "store/types";
import { ReduxState } from "..";
import { concatOrReplace } from "./utils";

/* Actions */
export const ADD_MEMBER = 'ADD_MEMBER';
export const DEL_MEMBER = 'DEL_MEMBER';

/* Types */
export interface AddMemberAction {
  type: typeof DEL_MEMBER;
  payload: {
    member: Member,
    serverId: number,
  };
}
export interface DelMemberAction {
  type: typeof DEL_MEMBER;
  payload: {
    serverId: number,
    memberId: number,
  };
}
export type Actions = AddMemberAction | DelMemberAction;

/* Functions */
export function addServerMember(state: ReduxState, action: AddMemberAction) {
  const server = state.servers.find((e) => e.id === action.payload.serverId);
  const conversation = state.conversations.find((e) => e.id === action.payload.serverId);

  if (!server && !conversation) {
    return {
      ...state,
    };
  }
  const s = server ? server : conversation;
  const member = action.payload.member;
  subscribe(state.ws, "userbc", member.id);
  member.userId = member.user.id;
  delete member.user;
  s.members = concatOrReplace(s.members, action.payload.member, "id");
  if (server) {
    return {
      ...state,
      servers: concatOrReplace(state.servers, s, "id"),
    };  
  } else {
    return {
      ...state,
      conversations: concatOrReplace(state.conversations, s, "id"),
    };  
  }

}
export function delServerMember(state: ReduxState, action: DelMemberAction) {
  const server = state.servers.find((e) => e.id === action.payload.serverId);
  const conversation = state.conversations.find((e) => e.id === action.payload.serverId);

  if (!server && !conversation) {
    return {
      ...state,
    };
  }

  const s = server ? server : conversation;

  s.members.find((e) => e.id === action.payload.memberId).quit = true;
  // TODO : Check if can remove subscription for user (Only if doesnt exist in any other server/conversation or friend)
  if (server) {
    return {
      ...state,
      servers: concatOrReplace(state.servers, s, "id"),
    };  
  } else {
    return {
      ...state,
      conversations: concatOrReplace(state.conversations, s, "id"),
    };  
  }
}

/* Dispatches */
export const dispatches = [
  {
    action: ADD_MEMBER,
    function: addServerMember,
  },
  {
    action: DEL_MEMBER,
    function: delServerMember,
  }
];
