import {
  Body,
  Controller,
  Post,
  UseGuards,
  Query,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { RoleContacts } from 'src/decorators/roles-contact.decorator';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleAgents } from 'src/decorators/role-agents.decorator';
import { CreateAgentDTO, CreateAgentListDTO } from './dto/create-agent.dto';
import { AgentRoleEnum } from './constant/agent.constant';
import { AgentService } from './agent.service';
import { ContactTypeEnum } from '@prisma/client';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}
  @Post('/owner')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @RoleContacts([ContactTypeEnum.ADMIN])
  createAgentOwner(@Body() agentOwnerDTO: CreateAgentDTO) {
    return this.agentService.createAgent(agentOwnerDTO);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createAgent(@Body() agentDTO: CreateAgentDTO) {
    return this.agentService.createAgent(agentDTO);
  }

  @Post('/invite-agent')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @RoleAgents([AgentRoleEnum.OWNER])
  inviteAgent(@Body() agentDTOs: CreateAgentListDTO) {
    return this.agentService.inviteAgent(agentDTOs.agents);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @RoleContacts([ContactTypeEnum.AGENT])
  getAgentByCompany(
    @Query('companyId') companyId: number,
    @Query('page') page: number = 0,
    @Query('pageSize') pageSize: number = 100,
  ) {
    return this.agentService.getAgentsByCompanyId(companyId, page, pageSize);
  }
}
