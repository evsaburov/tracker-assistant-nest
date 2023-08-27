import { Model, Optional } from 'sequelize';
import { SessionUser } from './context/context.interface';

export enum STATUS {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
}

export type BlockedCategory = {
  code: string;
  name: string;
};

export type FavoriteTrack = {
  id: string;
  link: string;
  title: string;
};
