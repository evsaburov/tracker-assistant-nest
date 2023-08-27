import { Telegraf } from 'telegraf';
import { Command } from './commands';
import { IBotContext } from '../context/context.interface';
import { trackActionKB, trackKBFavorite } from '../keyboards/keyboards';
import { FavoriteTrack } from '../types';

export class TrackCommands extends Command {
  trackUrl = 'https://rutracker.org/forum/viewtopic.php?t=';

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  getNameCategoryFromMessage(text: string): string | null {
    const matchCategory = text.match(/^(.*)\n\n/gi);
    const name = matchCategory?.[0];
    if (name === undefined) return null;
    return name.slice(0, -2);
  }

  getIDFromMessage(text: string): string | null {
    const matchCategory = text.match(/\[id:(\d*)\]/gm);
    const name = matchCategory?.[0];
    if (name === undefined) return null;
    return name.slice(5).slice(0, -1);
  }
  getTitleFromMessage(text: string): string | null {
    const matchCategory = text.match(/\n\n(.*)\n\n/gm);
    const name = matchCategory?.[0];
    if (name === undefined) return null;
    return name.slice(2).slice(0, -2);
  }

  getCodeCategoryFromMessage(text: string): string | null {
    const metadataRow = text.match(/\[cat:(.*)\]/gm);
    if (metadataRow === null) return null;
    return metadataRow[0].slice(5).slice(0, -1);
  }

  handle(): void {
    this.bot.action('banByCategory', async (ctx) => {
      if (ctx.session.banCategoryLimit === 0)
        await ctx.answerCbQuery('Достигнут лимит');

      if (ctx.callbackQuery.message === undefined) return;
      if (!('text' in ctx.callbackQuery.message)) return;
      const ctxMessageText = ctx.callbackQuery.message.text;

      const code = this.getCodeCategoryFromMessage(ctxMessageText);
      const name = this.getNameCategoryFromMessage(ctxMessageText);

      if (code === null || name === null) {
        await ctx.answerCbQuery('Не удалось определить код или категорию');
        return;
      }

      const codeExistIs = ctx.session.blockedCategory.some((el) => {
        return el.code === code;
      });

      if (codeExistIs) {
        await ctx.answerCbQuery('Категория уже добавлена');
      } else {
        ctx.session.blockedCategory.push({ code, name });
        await ctx.answerCbQuery('Добавлено с блокируемые');
        ctx.session.banCategoryLimit -= 1;
      }
    });

    this.bot.action('favorite', async (ctx) => {
      if (ctx.session.banCategoryLimit === 0)
        await ctx.answerCbQuery('Достигнут лимит');
      if (ctx.callbackQuery.message === undefined) return;
      if (!('text' in ctx.callbackQuery.message)) return;
      const ctxMessageText = ctx.callbackQuery.message.text;

      const id = this.getIDFromMessage(ctxMessageText);
      const title = this.getTitleFromMessage(ctxMessageText);
      const link = this.trackUrl + id;

      if (id === null || title === null || link === null) {
        await ctx.answerCbQuery('Не удалось определить код или категорию');
        return;
      }

      const trackExistIs = ctx.session.favoriteTrack.some((el) => {
        return el.id === id;
      });

      const favorite: FavoriteTrack = { id, link, title };

      if (trackExistIs) {
        await ctx.answerCbQuery('Трек уже есть в избранном');
      } else {
        ctx.session.favoriteTrack.push(favorite);
        await ctx.answerCbQuery('Трек добавлен в избранное');
        await ctx.editMessageReplyMarkup(trackKBFavorite);
        ctx.session.favoriteLimit -= 1;
      }
      return;
    });

    this.bot.action('actions', async (ctx) => {
      await ctx.editMessageReplyMarkup(trackActionKB);
    });

    this.bot.action('delFavorite', async (ctx) => {
      if (ctx.callbackQuery.message === undefined) return;
      if (!('text' in ctx.callbackQuery.message)) return;
      const ctxMessageText = ctx.callbackQuery.message.text;
      console.log(ctxMessageText);
      // заглушка
      await ctx.answerCbQuery('delFavorite');
    });

    this.bot.action('actions', async (ctx) => {
      await ctx.editMessageReplyMarkup(trackActionKB);
    });
  }
}
