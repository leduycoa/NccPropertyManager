import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { AgencyAgentTypeEnum } from '../constant/agency-agent.constant';

export class CreateAgencyAgentOwnerDTO {
  @IsUUID()
  agencyId: string;

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
  @IsNotEmpty()
  phoneNumber: string;

  portfolioCount: number;
}
