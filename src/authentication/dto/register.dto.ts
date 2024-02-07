import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsOptional,
  IsDate,
} from 'class-validator';
import { UserStatusEnum } from '../../user/constants/user.constant';
import { ContactTypeEnum } from 'src/contact/constants/contact.constant';
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  status: UserStatusEnum;

  @IsString()
  @IsOptional()
  type: ContactTypeEnum;

  @IsDate()
  @IsOptional()
  inviteSent: Date;
}

export default RegisterDto;
