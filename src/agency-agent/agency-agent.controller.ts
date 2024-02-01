import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserTypeEnum } from 'src/user/constants/user.constant';
import {
  CreateAgencyAgentDTO,
  CreateAgencyAgentListDTO,
} from './dto/create-agency-agent.dto';
import { AgencyAgentService } from './agency-agent.service';
import { RoleAgents } from 'src/decorators/role-agents.decorator';
import { AgencyAgentRoleEnum } from './constant/agency-agent.constant';

@Controller('agency-agent')
export class AgencyAgentController {
  constructor(private readonly agencyAgentService: AgencyAgentService) {}
  @Post('/owner')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles([UserTypeEnum.ADMIN])
  createAgencyAgentOwner(
    @Body() agencyAgentOwnerDTOs: CreateAgencyAgentListDTO,
  ) {
    return this.agencyAgentService.createAgencyAgent(
      agencyAgentOwnerDTOs.agents,
    );
  }

  @Post('/invite-agent')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @RoleAgents([AgencyAgentRoleEnum.OWNER])
  inviteAgent(@Body() agencyAgentDTOs: CreateAgencyAgentListDTO) {
    return this.agencyAgentService.inviteAgent(agencyAgentDTOs.agents);
  }
}
