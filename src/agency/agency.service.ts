import {
  Body,
  Injectable,
  Post,
  Logger,
  HttpStatus,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgencyDTO } from './dto/create-agency.dto';
import { Agency, Prisma } from '@prisma/client';

@Injectable()
export class AgencyService {
  private readonly logger = new Logger(AgencyService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createAgency(agencyDTO: CreateAgencyDTO): Promise<Agency> {
    await this.checkPhoneEmailExist(
      agencyDTO.companyEmail,
      agencyDTO.phoneNumber,
    );

    const data: Prisma.AgencyCreateInput = {
      ...agencyDTO,
      isDeleted: false,
    };
    return this.prisma.agency.create({
      data,
    });
  }

  async getAgencyById(agencyId: string) {
    const agency = await this.prisma.agency.findUnique({
      where: {
        id: agencyId,
      },
    });

    if (!agency) {
      throw new BadRequestException(`Agency with id ${agencyId} not found`);
    }

    return agency;
  }

  async checkPhoneEmailExist(
    companyEmail: string,
    phoneNumber: string,
  ): Promise<void> {
    const agency = await this.prisma.agency.findFirst({
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

    if (agency) {
      throw new BadRequestException(
        'Company email or phone number already exists',
      );
    }
  }
}
