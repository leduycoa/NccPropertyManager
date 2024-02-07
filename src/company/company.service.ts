import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(companyDTO: CreateCompanyDTO): Promise<Company> {
    await this.checkPhoneEmailExist(
      companyDTO.companyEmail,
      companyDTO.phoneNumber,
    );

    const data: Prisma.CompanyCreateInput = {
      ...companyDTO,
      isDeleted: false,
    };
    return this.prisma.company.create({
      data,
    });
  }

  async getCompanyById(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw new BadRequestException(`company with id ${companyId} not found`);
    }

    return company;
  }

  async checkPhoneEmailExist(
    companyEmail: string,
    phoneNumber: string,
  ): Promise<void> {
    const company = await this.prisma.company.findFirst({
      where: {
        OR: [
          {
            companyEmail,
          },
          {
            phoneNumber,
          },
        ],
      },
    });

    if (company) {
      throw new BadRequestException(
        'Company email or phone number already exists',
      );
    }
  }
}
