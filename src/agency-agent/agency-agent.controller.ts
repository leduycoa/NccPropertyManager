import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserTypeEnum } from 'src/user/constants/user.constant';
import { CreateAgencyAgentOwnerDTO } from './dto/create-agency-agent-owner.dto';
import { AgencyAgentService } from './agency-agent.service';

@Controller('agency-agent')
export class AgencyAgentController {
  constructor(private readonly agencyAgentService: AgencyAgentService) {}
  @Post('/owner')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles([UserTypeEnum.ADMIN])
  createAgencyAgentOwner(
    @Body() agencyAgentOwnerDTO: CreateAgencyAgentOwnerDTO,
  ) {
    return this.agencyAgentService.createAgencyAgentOwner(agencyAgentOwnerDTO);
  }
}
