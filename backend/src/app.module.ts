import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { MeetingModule } from './meeting/meeting.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [PrismaModule, TranslationModule, MeetingModule, UserModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
