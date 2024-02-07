import { Controller, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleContacts } from 'src/decorators/roles-contact.decorator';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { ContactTypeEnum } from '@prisma/client';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @RoleContacts([ContactTypeEnum.ADMIN])
  createCompany(@Body() companyDTO: CreateCompanyDTO) {
    return this.companyService.createCompany(companyDTO);
  }
}
