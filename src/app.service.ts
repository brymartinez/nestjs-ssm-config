import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getHello(): string {
    return `My SSM Value: ${this.config.get<string>(
      'DB_CONNSTRING',
    )}. A normal parameter: ${this.config.get<string>('NO_COLOR')}`;
  }
}
