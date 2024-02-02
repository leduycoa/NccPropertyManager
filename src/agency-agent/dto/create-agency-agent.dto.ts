import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AgencyAgentRoleEnum } from '../constant/agency-agent.constant';
import { Type } from 'class-transformer';

export class CreateAgencyAgentDTO {
  @IsUUID()
  agencyId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
    message: 'Invalid email address',
  })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password: string;

  @IsEnum(AgencyAgentRoleEnum)
  role: AgencyAgentRoleEnum;
}

export class CreateAgencyAgentListDTO {
  @ValidateNested({ each: true })
  @Type(() => CreateAgencyAgentDTO)
  agents: CreateAgencyAgentDTO[];
}
