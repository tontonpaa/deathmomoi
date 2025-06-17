// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('nyan')
    .setDescription('Botが返事してくれるよ'),
  
  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    await interaction.reply('にゃ～ん');
  },
};
