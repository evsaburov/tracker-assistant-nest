import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './commands';
import { GREETINGS } from '../templates/greetings';
import { STATUS } from '../types';

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.start(async (ctx) => {
      await ctx.reply(
        GREETINGS,
        Markup.inlineKeyboard([
          Markup.button.callback('👍 Подписаться', 'start'),
          Markup.button.callback('👎 В другой раз', 'stop'),
        ]),
      );
    });
    this.bot.action('start', async (ctx) => {
      ctx.session.status = STATUS.ACTIVE;
      ctx.editMessageText('😊');
    });
    this.bot.action('stop', (ctx) => {
      ctx.session.status = STATUS.PAUSE;
      ctx.editMessageText('😞');
    });
  }
}
