- nest new tracker-assistant

- nest g module telegram-bot
- nest g module user
- nest g module messenger
- nest g module track
- nest g module database
- nest g module logger

- nest g class user.model
- nest g class track.model

- nest g service user
- nest g service track
- nest g service database
- nest g service logger
- nest g service telegram-bot

npm install prisma --save-dev
npx prisma init

# Create database tables withPrisma Migrate#

- npx prisma migrate dev --name init
- npm install @prisma/client

<!--
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
-->

CREATE TABLE Sessions (sessionID varchar, data varchar);
