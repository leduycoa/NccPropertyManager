import { $Enums, Prisma, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: $Enums.Userstatus;
  type: $Enums.UserType;
  inviteSent: Date;
  onboardTracking: Prisma.JsonValue;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  password: string;
}
