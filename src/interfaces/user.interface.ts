import { Userstatus, UserType } from '../users/constants/userConstant';
interface BuildUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumbe: string,
  status: Userstatus,
  type: UserType,
  inviteSent: Date,
  onboardTracking: JSON,
}

export default BuildUser;
