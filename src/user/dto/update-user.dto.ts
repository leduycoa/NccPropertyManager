import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatusEnum } from '../constants/user.constant';
import { CanBeUndefined } from '../../utils/can-be-undefined.util';
export class UpdateUserDto {
  @IsString()
  @CanBeUndefined()
  firstName?: string;

  @IsString()
  @CanBeUndefined()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  @CanBeUndefined()
  email?: string;

  @IsString()
  @CanBeUndefined()
  phoneNumber?: string;

  @IsString()
  @IsEnum(UserStatusEnum)
  @CanBeUndefined()
  status?: UserStatusEnum;
}

export default UpdateUserDto;
