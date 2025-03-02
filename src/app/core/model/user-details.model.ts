import { Address, Role, User, UserMember } from "./registration-tracking.model";

export interface UserDetails {
  user: User;
  member: UserMember;
  role: Role;
  address: Address;
}
