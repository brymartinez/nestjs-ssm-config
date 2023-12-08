import {
  SSMClient,
  GetParameterCommandInput,
  GetParameterCommand,
} from '@aws-sdk/client-ssm';
import { Logger } from '@nestjs/common';

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

export const SSMConfigFactory = async () => {
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v === 'string' && v.substring(0, 4) === 'ssm:') {
      Logger.debug(`Converting ${v}`);
      const ssmParameterName: string = v.substring(4, v.length);
      const ssmResult: string = await loadValueFromSSM(ssmParameterName);
      Logger.debug(`Converted ${v}`);
      process.env[k] = ssmResult;
    }
  }

  return process.env;
};
