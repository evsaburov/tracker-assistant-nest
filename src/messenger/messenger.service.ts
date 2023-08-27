import { IMessengerService } from './messenger.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { ITrackService } from 'src/track/track.service.interface';
import { Track } from 'src/track/track';
import { trackKBDefault } from 'src/telegram-bot/keyboards/keyboards';
import axios from 'axios';
import { Client, QueryResult } from 'pg';
import { SessionsTable } from './types';
import { STATUS } from 'src/telegram-bot/types';
import * as PostgresSession from 'telegraf-postgres-session';

@Injectable()
export class MessengerService implements IMessengerService {
  urlMessage: string;
  botId: string;
  connectionString: string;
  tracks: ITrackService;
  queryString = 'SELECT id,session FROM public.postgress_sessions';

  constructor(
    private readonly configService: ConfigService,
    private readonly trackService: TrackService,
  ) {
    this.botId = this.configService.get<string>('BOT_TOKEN');
    this.urlMessage = `https://api.telegram.org/bot${this.botId}/sendMessage`;
    this.connectionString = this.configService.get<string>('DATABASE_URL');
  }

  async getActiveUsersSessions(): Promise<string[]> {
    const client: Client = new Client(this.connectionString);
    await client.connect();
    const result: QueryResult<SessionsTable> = await client.query(
      this.queryString,
    );
    const resultSessions = result.rows;
    client.end();

    return resultSessions.reduce(
      (sessionUser: string[], el: { session: string; id: number }) => {
        if (!el.session) return sessionUser;
        const session = JSON.parse(el.session);
        if (!session.status) return sessionUser;
        if (!session.id) return sessionUser;

        if (session.status === STATUS.ACTIVE) {
          return [...sessionUser, el.id];
        } else {
          return sessionUser;
        }
      },
      [],
    );
  }

  async sendTrack(): Promise<void> {
    const sessions = await this.getActiveUsersSessions();
    const tracks = await this.trackService.getData();

    sessions.forEach(async (sessionId): Promise<void> => {
      const pgSession: PostgresSession = new PostgresSession({
        connectionString: this.configService.get('DATABASE_URL'),
      });

      const sessionUser = await pgSession.getSessionPostgres(sessionId);

      const blockedCategoryCode = sessionUser?.blockedCategory || [];
      const IndexlastTrack = tracks.findIndex((track) => {
        return track.fk === sessionUser.lastTrackId;
      });
      const newTracks =
        IndexlastTrack === -1 ? tracks : tracks.slice(IndexlastTrack + 1);
      const trackAllowed = newTracks.find(
        (track) => !blockedCategoryCode.includes(track.categoryCode),
      );
      if (trackAllowed === undefined) throw new Error('Нет новых треков');
      const trackMessage = this.createText(trackAllowed);
      const result = await this.sendMessage(sessionUser.id, trackMessage);

      if (result) {
        sessionUser.lastTrackId = trackAllowed.fk;
        await pgSession.saveSessionPostgress(sessionId, sessionUser);
      }
    });
  }

  async sendMessage(chat: number, message: string): Promise<boolean> {
    try {
      await axios.post(this.urlMessage, {
        chat_id: chat,
        text: message,
        parse_mode: 'HTML',
        reply_markup: trackKBDefault,
        disable_web_page_preview: true,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  createText(track: Track): string {
    return (
      `${track.category}\n\n` +
      `<b>${track.title}</b>\n\n` +
      `<a href='${track.link}'>[Link]</a>[${track.author}][id:${track.fk}][cat:${track.categoryCode}]`
    );
  }
}
