import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
