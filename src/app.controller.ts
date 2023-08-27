import { Controller, Get } from '@nestjs/common';
import { MessengerService } from './messenger/messenger.service';
import { Cron } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly messageService: MessengerService) {}

  @Cron('* */1 * * *')
  @Get()
  sendTrack(): void {
    this.messageService.sendTrack();
  }
}
