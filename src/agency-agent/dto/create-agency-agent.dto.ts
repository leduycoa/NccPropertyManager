import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { AgencyAgentTypeEnum } from '../constant/agency-agent.constant';

export class CreateAgencyAgentDTO {
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
  @MinLength(7)
  password?: string;

  @IsEnum(AgencyAgentTypeEnum)
  type: AgencyAgentTypeEnum;
}
