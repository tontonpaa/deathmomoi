// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('db')
    .setDescription('にゃんこ大戦争の色々な情報を表示します。')
    .addStringOption(option =>
      option.setName('no_db') // オプション名
        .setDescription('YouTubeや大手攻略サイトのリンクを表示します')
        .setRequired(false) // 選択は任意
        .addChoices(
          { name: '7神', value: '7' },
          { name: 'ポンカメ', value: 'ポンカメ' },
          { name: '3にゃん', value: '3にゃん' },
          { name: 'ネコレンジャー', value: 'ネコレンジャー' },
          { name: 'GAME8', value: 'game8' },
          { name: 'ゲーム乱舞', value: 'ゲーム乱舞' },
          { name: '公式X', value: 'officialx' },
          { name: '公式YouTube', value: 'officialyoutube' }
        )
    ),

  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    const noDb = interaction.options.getString('no_db');
    const baseUrl = 'https://battlecats-db.com/';

    // オプションが選択されていない場合は、DBのトップページを返信
    if (!noDb) {
      await interaction.reply(`にゃんこ大戦争DB： ${baseUrl}`);
      return;
    }

    // 選択されたオプションに応じて、対応するURLを返信
    switch (noDb) { // toLowerCase()は不要
      case '7':
        await interaction.reply('7神： https://www.youtube.com/@7r_yi');
        break;
      case 'ポンカメ':
        await interaction.reply('ポンカメ： https://www.youtube.com/@ポンカメ');
        break;
      case '3にゃん':
        await interaction.reply('3にゃん： https://www.youtube.com/@san__nyan');
        break;
      case 'ネコレンジャー':
        await interaction.reply('ネコレンジャー： https://www.youtube.com/@NEKO_RANGER');
        break;
      case 'game8':
        await interaction.reply('GAME8： https://game8.jp/battlecats');
        break;
      case 'ゲーム乱舞':
        await interaction.reply('ゲーム乱舞： https://gameranbu.jp/battlecats/');
        break;
      case 'officialx':
        await interaction.reply('公式X： https://x.com/PONOS_GAME/');
        break;
      case 'officialyoutube':
        await interaction.reply('公式YouTube： https://www.youtube.com/@にゃんこスタジオ公式チャンネルにゃん');
        break;
      default:
        // 通常、Choicesで設定しているためここには来ない
        await interaction.reply({ content: '無効な選択肢です。', ephemeral: true });
    }
  },
};
