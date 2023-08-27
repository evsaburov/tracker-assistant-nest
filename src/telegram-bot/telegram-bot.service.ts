import { Injectable } from '@nestjs/common';
import { ITelegramBotService } from './telegram-bot.interface';
import { IBotContext } from './context/context.interface';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { userController } from './middleware/user';
import { StartCommand } from './command/start.command';
import { HelpCommand } from './command/help.command';
import { TrackCommands } from './command/track.commands';
import * as PostgresSession from 'telegraf-postgres-session';

@Injectable()
export class TelegramBotService implements ITelegramBotService {
  bot: Telegraf<IBotContext>;

  constructor(private readonly configService: ConfigService) {
    this.bot = new Telegraf<IBotContext>(
      this.configService.get<string>('BOT_TOKEN'),
    );
    this.InitSessionMiddleware();
    this.InitUserMiddleware();
    this.InitCommands();
  }

  InitCommands() {
    new StartCommand(this.bot).handle();
    new HelpCommand(this.bot).handle();
    new TrackCommands(this.bot).handle();
  }

  InitUserMiddleware() {
    this.bot.use((ctx, next) => {
      userController(ctx);
      next();
    });
  }

  async InitSessionMiddleware(): Promise<void> {
    this.bot.use(
      new PostgresSession({
        connectionString: this.configService.get('DATABASE_URL'),
      }).middleware(),
    );
  }

  init(): void {
    this.bot.launch();
    console.log('TelegramBotService start');
  }
}
