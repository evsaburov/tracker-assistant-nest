import { Injectable } from '@nestjs/common';
import { Track } from './track';
import axios from 'axios';
import { parseString } from 'xml2js';
import { ITrackService } from './track.service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrackService implements ITrackService {
  config: ConfigService;
  constructor(private readonly configService: ConfigService) {
    this.config = configService;
  }

  createMessage(track: Track): string {
    return (
      `<b>Категория: </b>${track.category}\n\n` +
      `<b>${track.title}</b>\n\n` +
      `<a href='${track.link}'>[Link]</a>[${track.author}][id:${track.fk}]`
    );
  }

  async getData(): Promise<Track[]> {
    const address = this.config.get('TRACKER_URL').toString();
    const { data } = await axios.get(address);
    return await this.parseData(data);
  }

  async parseData(data: string): Promise<Track[]> {
    const tracks = new Array<Track>();
    parseString(data, async (error, result): Promise<void> => {
      if (error !== null) throw new Error('шибка парсинга');
      for (const track of result.feed['entry']) {
        tracks.push(
          new Track(
            track['id'],
            track['link'],
            track['updated'],
            track['title'],
            track['author'],
            track['category'],
          ),
        );
      }
    });
    return tracks;
  }
}
