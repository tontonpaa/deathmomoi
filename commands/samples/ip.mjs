import { SlashCommandBuilder } from 'discord.js';
import os from 'os';

export const data = new SlashCommandBuilder()
  .setName('ip')
  .setDescription('BotのローカルIPアドレスを教えてくれるよ');

export async function execute(interaction) {
  try {
    // コマンドを実行したユーザーのローカルIPアドレスを取得することはDiscord APIの仕様上できません。
    // このコードでは、Botが動作しているサーバーのローカルIPアドレスを取得します。
    const ipAddresses = Object.values(os.networkInterfaces())
      .flat()
      .filter(iface => iface?.family === 'IPv4' && !iface.internal)
      .map(iface => iface?.address);

    if (ipAddresses.length > 0) {
      await interaction.reply({ content: `このサーバーのローカルIPアドレスは ${ipAddresses.join(', ')} です。`, ephemeral: false });
    } else {
      await interaction.reply({ content: 'ローカルIPアドレスを取得できませんでした。', ephemeral: true });
    }
  } catch (error) {
    console.error('IPアドレス取得中にエラーが発生しました:', error);
    await interaction.reply({ content: `IPアドレスの取得中にエラーが発生しました。\n**エラー内容:**\n\`\`\`\n${error.message}\n\`\`\``, ephemeral: true });
  }
}