export interface RegistrationTracking {
  userMember: UserMember;
  role: Role;
  address: Address;
  applicationStatus: ApplicationStatus;
}

interface ApplicationStatus {
  statusId: number;
  statusName: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}

export interface Address {
  idAddr: number;
  aptNo: string;
  city: string;
  state: string;
  street: string;
  zip: string;
  addrExptn: null; // Can be changed to string | null if needed
}

export interface UserMember {
  memberId: string;
  emailId: string;
  firstName: string;
  gender: string;
  lastName: string;
  maritalStatus: string;
  phoneNumber: null | string; // If it can be null or a string
  dttmCreate: null | string; // Date stored as string
  memberDob: string;
  status: string;
  applicationSts?:string
  middleName: string;
  phone: string;
}

export interface ApplHistory {
  id: number;
  applicationStatus: string;
  applicationType: string;
  comment: string;
  idUserCreate: string;
  idUserLstUpdt: string;
  dttmCreate: string;
  dttmLstUpdt: string;
}    