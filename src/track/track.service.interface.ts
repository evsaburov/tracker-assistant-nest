import { Track } from './track';

export interface ITrackService {
  getData: () => Promise<Track[]>;
  parseData(data: string): Promise<Track[]>;
}
