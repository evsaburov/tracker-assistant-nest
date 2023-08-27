import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { ConfigModule } from '@nestjs/config';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [ConfigModule, TrackModule],
  providers: [MessengerService],
  exports: [MessengerService],
})
export class MessengerModule {}
