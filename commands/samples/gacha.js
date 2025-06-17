// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('gacha')
    .setDescription('ガチャを引くよ～'),
  
  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    // ガチャのアイテムと、それぞれの重みを設定
    // 重みの合計値の中でランダムな数値を生成し、どの範囲に入るかで抽選する
    const items = [
        { name: "SSR 金のじゃがいも", weight: 2 },
        { name: "SR 銀のじゃがいも", weight: 4 },
        { name: "R 銅のじゃがいも", weight: 8 },
        { name: "N ただのじゃがいも", weight: 16 },
    ];

    // 重みの合計を計算
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    
    // 0から重みの合計値までのランダムな数値を生成
    let random = Math.random() * totalWeight;
    
    let result = "";

    // ランダムな数値がどのアイテムの重みの範囲に入るかを判定
    for (const item of items) {
      if (random < item.weight) {
        result = item.name;
        break;
      }
      random -= item.weight;
    }

    await interaction.reply(`ガチャの結果...\n\n**${result}** が当選しました！`);
  },
};
