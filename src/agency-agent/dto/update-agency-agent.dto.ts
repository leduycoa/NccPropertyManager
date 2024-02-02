import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { AgencyAgentRoleEnum } from '../constant/agency-agent.constant';

export class UpdateAgencyAgentDTO {
  @IsUUID()
  agencyId: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  userName?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(7)
  password?: string;

  @IsEnum(AgencyAgentRoleEnum)
  role: AgencyAgentRoleEnum;
}
