import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Userstatus, UserType } from '../constants/userConstant';
import { CanBeUndefined } from '../../utils/canBeUndefined';
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
  @IsEnum(UserType)
  @CanBeUndefined()
  status?: Userstatus;

  @IsString()
  @IsEnum(UserType)
  @CanBeUndefined()
  type?: UserType;
}

export default UpdateUserDto;
