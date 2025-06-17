// 'import' を 'require' に変更
const { EmbedBuilder } = require("discord.js");
const Notification = require("../models/notification.js"); // 拡張子を.jsに変更

// 'export default' を 'module.exports' に変更
// メインファイル側で .default を参照しているため、オブジェクトでエクスポート
module.exports = {
  default: async (oldState, newState) => {
    // 誰かがボイスチャンネルに入室し、そのチャンネルの人数が1人になった（最初に入った）場合に実行
    if (oldState.channelId === null && newState.channel?.members.size === 1) {
      const notifications = await Notification.findAll({
        where: {
          guildId: newState.guild.id,
          voiceChannelId: newState.channel.id,
        },
      });

      // 通知設定がなければ何もしない
      if (notifications.length === 0) return;

      const embed = new EmbedBuilder()
        .setColor(0x5cb85c)
        .setAuthor({ name: newState.member.displayName, iconURL: newState.member.displayAvatarURL() })
        .setTitle(`<#${newState.channel.id}> で通話を開始しました！`)
        .setTimestamp();

      // Promise.allで並行して通知を送信
      await Promise.all(
        notifications.map(async (n) => {
          try {
            // client.channels.cache.get() よりも fetch() の方が確実
            const channel = await newState.guild.channels.fetch(n.textChannelId);
            if (channel) {
              await channel.send({ embeds: [embed] });
            }
          } catch (error) {
            console.error(`[エラー] 通知の送信に失敗しました (Channel ID: ${n.textChannelId}):`, error);
          }
        })
      );
    }
  },
};
