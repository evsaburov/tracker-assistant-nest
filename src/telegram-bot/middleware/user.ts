import { IBotContext } from '../context/context.interface';
import { STATUS } from '../types';

export function userController(ctx: IBotContext): void {
  if (!ctx.session.id) ctx.session.id = ctx.from.id;
  if (!ctx.session.first_name) ctx.session.name = ctx.from.first_name;
  if (!ctx.session.status) ctx.session.status = STATUS.ACTIVE;
  if (!ctx.session.blockedCategory) ctx.session.blockedCategory = [];
  if (!ctx.session.favoriteTrack) ctx.session.favoriteTrack = [];
  if (!ctx.session.lastTrackId) ctx.session.lastTrackId = null;
  if (!ctx.session.banCategoryLimit) ctx.session.banCategoryLimit = 20;
  if (!ctx.session.favoriteLimit) ctx.session.favoriteLimit = 20;

  if (ctx.session.status === STATUS.BLOCKED)
    ctx.sendMessage('Пользователь заблокирован');
  return;
}
