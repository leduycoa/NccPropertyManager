import { $Enums, Prisma, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  verifyCode: string;
  status: $Enums.UserStatusEnum;
  inviteSent: Date;
  onboardTracking: Prisma.JsonValue;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  password: string;
}
