import { Markup } from "telegraf";

export const trackKBDefault = {
  inline_keyboard: [[Markup.button.callback("📋", "actions")]],
};

export const trackKBCancel = {
  inline_keyboard: [[Markup.button.callback("🚫", "actions")]],
};
export const trackKBFavorite = {
  inline_keyboard: [[Markup.button.callback("❤", "actions")]],
};

export const delTrackKBFavoriteCard = {
  inline_keyboard: [
    [Markup.button.callback("💔 удалить из избранного", "delFavorite")],
  ],
};

export const trackActionKB = {
  inline_keyboard: [
    [
      {
        text: "🚫 категорию",
        callback_data: "banByCategory",
      },
      {
        text: "❤ избранное",
        callback_data: "favorite",
      },
    ],
  ],
};
