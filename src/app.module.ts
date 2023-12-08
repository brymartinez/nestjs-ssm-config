import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  GetParameterCommand,
  GetParameterCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        async () => {
          const loadValueFromSSM = async (name: string) => {
            const ssm = new SSMClient({});
            const input: GetParameterCommandInput = {
              Name: name,
              // WithDecryption: true,
            };
            const command: GetParameterCommand = new GetParameterCommand(input);
            const result = await ssm.send(command);
            return result.Parameter.Value;
          };

          for (const [k, v] of Object.entries(process.env)) {
            if (typeof v === 'string' && v.substring(0, 4) === 'ssm:') {
              Logger.debug(`Converting ${v}`);
              const ssmParameterName: string = v.substring(4, v.length);
              const ssmResult: string = await loadValueFromSSM(
                ssmParameterName,
              );
              Logger.debug(`Converted ${v}`);
              process.env[k] = ssmResult;
            }
          }

          return process.env;
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
