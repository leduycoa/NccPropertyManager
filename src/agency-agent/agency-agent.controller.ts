import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserTypeEnum } from 'src/user/constants/user.constant';
import { CreateAgencyAgentDTO } from './dto/create-agency-agent.dto';
import { AgencyAgentService } from './agency-agent.service';
import { RoleAgents } from 'src/decorators/role-agents.decorator';
import { AgencyAgentTypeEnum } from './constant/agency-agent.constant';

@Controller('agency-agent')
export class AgencyAgentController {
  constructor(private readonly agencyAgentService: AgencyAgentService) {}
  @Post('/owner')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles([UserTypeEnum.ADMIN])
  createAgencyAgentOwner(@Body() agencyAgentOwnerDTO: CreateAgencyAgentDTO[]) {
    return this.agencyAgentService.createAgencyAgent(agencyAgentOwnerDTO);
  }

  @Post('/invite-agent')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @RoleAgents([AgencyAgentTypeEnum.OWNER])
  inviteAgent(@Body() agencyAgentDTO: CreateAgencyAgentDTO[], @Request() req) {
    return this.agencyAgentService.inviteAgent(agencyAgentDTO, req.user);
  }
}
