import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { MeetingModule } from './meeting/meeting.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, TranslationModule, MeetingModule, UserModule, ContactModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
