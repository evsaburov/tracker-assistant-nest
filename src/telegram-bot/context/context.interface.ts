import { Context } from 'telegraf';

export interface SessionUser {
  id: number;
  name: string;
  first_name: string;
  chat: string;
  status: string;
  role: string;
  blockedCategory: BlockedCategory[];
  favoriteTrack: favoriteTrack[];
  counter: number;
  lastTrackId: number[];
  favoriteLimit: number;
  banCategoryLimit: number;
}

export interface IBotContext extends Context {
  session: SessionUser;
}

export type BlockedCategory = {
  code: string;
  name: string;
};

export type favoriteTrack = {
  id: string;
  link: string;
  title: string;
};
