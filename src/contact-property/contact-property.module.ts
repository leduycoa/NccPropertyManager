import { Module } from '@nestjs/common';
import { ContactPropertyService } from './contact-property.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContactPropertyService],
  exports: [ContactPropertyService],
})
export class ContactPropertyModule {}
