import { Address, Role, UserMember } from "./registration-tracking.model";

export interface UserDetails {
  userMember: UserMember;
  role: Role;
  address: Address;
}
