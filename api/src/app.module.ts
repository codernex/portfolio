import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig } from './db/config';
import { BlogModule } from './modules/blog/blog.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { ProjectModule } from './modules/project/project.module';
import { SettingsModule } from './modules/setting/setting.module';
import { TagsModule } from './modules/tags/tags.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContactModule } from './modules/contact/contact.module';
import { UploadModule } from './modules/upload/media.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 2,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ExperienceModule,
    BlogModule,
    TagsModule,
    ProjectModule,
    TagsModule,
    SettingsModule,
    ContactModule,
    UploadModule,
    ApiKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
