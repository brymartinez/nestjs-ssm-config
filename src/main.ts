import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { ExpressAdapter } from '@nestjs/platform-express';

import express from 'express';

const binaryMimeTypes: string[] = [];

let server: Server;

async function bootstrapServer(): Promise<Server> {
  if (!server) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.use(eventContext());

    await nestApp.init();
    server = createServer(expressApp, undefined, binaryMimeTypes);
  }

  return server;
}

export const handler: Handler = async (event: any, context: Context) => {
  console.log('Event received', event);
  server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
