// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('uranai')
    .setDescription('ラッキーカラーを占うよ～'),
  
  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    const arr = ["赤色", "青色", "緑色", "黄色", "水色", "紫色", "オレンジ色", "ピンク色", "黒色", "白色", "金色", "銀色"];
    const random = Math.floor(Math.random() * arr.length);
    const color = arr[random];

    await interaction.reply(`今日のあなたのラッキーカラーは **${color}** だよ～`);
  },
};
