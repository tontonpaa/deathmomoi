// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('BotのローカルIPアドレスを教えてくれるよ'),
  
  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    try {
      // Botが動作しているサーバーのネットワークインターフェース情報を取得
      const networkInterfaces = os.networkInterfaces();
      
      // IPv4で内部ループバックアドレスでないものをフィルタリング
      const ipAddresses = Object.values(networkInterfaces)
        .flat() // 配列をフラット化
        .filter(iface => iface?.family === 'IPv4' && !iface.internal)
        .map(iface => iface?.address);

      if (ipAddresses.length > 0) {
        // IPアドレスが見つかった場合
        await interaction.reply({ content: `このBotサーバーのローカルIPアドレスは: \`${ipAddresses.join(', ')}\``, ephemeral: false });
      } else {
        // IPアドレスが見つからなかった場合
        await interaction.reply({ content: 'ローカルIPアドレスを取得できませんでした。', ephemeral: true });
      }
    } catch (error) {
      console.error('IPアドレス取得中にエラーが発生しました:', error);
      await interaction.reply({ content: `IPアドレスの取得中にエラーが発生しました。`, ephemeral: true });
    }
  },
};
