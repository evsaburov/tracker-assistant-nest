import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './commands';
import { BlockedCategory, FavoriteTrack, STATUS } from '../types';
import { delTrackKBFavoriteCard } from '../keyboards/keyboards';

export class HelpCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.help(async (ctx) => {
      console.log(ctx.session);
      await ctx.reply(
        'Вам доступно:',
        Markup.inlineKeyboard([
          [Markup.button.callback('Подписаться', 'subscribe')],
          [Markup.button.callback('Отписаться', 'unsubscribe')],
          [Markup.button.callback('Избранное', 'likes')],
          [Markup.button.callback('Заблокировано', 'blocks')],
        ]),
      );
    });

    this.bot.action('likes', async (ctx) => {
      if (ctx.from?.id === undefined) return;
      if (ctx.callbackQuery.message === undefined) return;
      if (!('text' in ctx.callbackQuery.message)) return;

      const favorites = ctx.session.favoriteTrack;

      if (favorites.length === 0) {
        await ctx.answerCbQuery('Нет постов в избранном');
        return;
      }

      favorites.forEach(async (el) => {
        const mess = await this.createMessageFavorites(el);

        if (mess === null) {
          return;
        }

        await ctx.sendMessage(mess, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: delTrackKBFavoriteCard,
        });
      });
      await ctx.answerCbQuery('вот сохраненный список');
    });

    this.bot.action('subscribe', async (ctx) => {
      ctx.session.status = STATUS.ACTIVE;
      await ctx.answerCbQuery('Подписка активирована');
    });

    this.bot.action('unsubscribe', async (ctx) => {
      ctx.session.status = STATUS.STOP;
      await ctx.answerCbQuery('Подписка отключена');
    });

    this.bot.action('blocks', async (ctx) => {
      if (ctx.from?.id === undefined) return;
      if (ctx.callbackQuery.message === undefined) return;
      if (!('text' in ctx.callbackQuery.message)) return;

      const blocked = ctx.session.blockedCategory;

      if (blocked.length === 0) {
        await ctx.answerCbQuery('Нет блокировок');
        return;
      }

      blocked.forEach(async (block) => {
        const mess = await this.createBlockedCategoryMessage(block);

        if (mess === null) return;

        await ctx.sendMessage(mess, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: delTrackKBFavoriteCard,
        });
      });
      await ctx.answerCbQuery('Cохраненный список');

      await ctx.answerCbQuery('Список заблокированных категорий');
    });
  }

  async createMessageFavorites(track: FavoriteTrack): Promise<string | null> {
    return `❤ Избранное\n\n${track.title} - <a href='${track.link}'>[Link]</a>[id:${track.id}]`;
  }
  async createBlockedCategoryMessage(
    block: BlockedCategory,
  ): Promise<string | null> {
    return `\n\n${block.code} - ${block.name}`;
  }
}
