import { Injectable } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import { MessengerService } from './messenger/messenger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly telegramBotService: TelegramBotService,
    private readonly messageService: MessengerService,
  ) {
    this.telegramBotService.init();
  }
  getHello(): string {
    return 'Hello World!';
  }
}
