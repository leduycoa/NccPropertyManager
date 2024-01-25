import { Controller, UseGuards } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDTO } from './dto/create-agency.dto';
import { Body, Post } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { UserTypeEnum } from 'src/user/constants/user.constant';

@Controller('agencies')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}
  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles([UserTypeEnum.ADMIN])
  createAgency(@Body() agencyDTO: CreateAgencyDTO) {
    return this.agencyService.createAgency(agencyDTO);
  }
}
