import { Address, Role, UserMember } from "./registration-tracking.model";

export interface UserDetails {
  member: UserMember;
  role: Role;
  address: Address;
}
