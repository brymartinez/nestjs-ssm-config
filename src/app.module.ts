import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SSMConfigFactory } from './ssm-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SSMConfigFactory],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
