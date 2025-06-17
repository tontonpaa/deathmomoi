import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('db')
  .setDescription('にゃんこ大戦争の色々な情報を表示します。')
  .addStringOption(option =>
    option.setName('no_db') // オプション名を修正
      .setDescription('YouTubeや大手攻略サイト')
      .setRequired(false)
      .addChoices(
        { name: '7神', value: '7' },
        { name: 'ポンカメ', value: 'ポンカメ' },
        { name: '3にゃん', value: '3にゃん' },
        { name: 'ネコレンジャー', value: 'ネコレンジャー' },
        { name: 'GAME8', value: 'game8' },
        { name: 'ゲーム乱舞', value: 'ゲーム乱舞' },
        { name: '公式X', value: 'officialx' },
        { name: '公式YouTube', value: 'officialyoutube' },
        // 必要に応じて他のキーワードを追加
      )
  );

export async function execute(interaction) {
  const noDb = interaction.options.getString('no_db'); // 変数名を修正
  const baseUrl = 'https://battlecats-db.com/';

  if (!noDb) {
    await interaction.reply(`にゃんこ大戦争DB：${baseUrl}`);
    return;
  }

  const lowerNoDb = noDb.toLowerCase();

  switch (lowerNoDb) {
    case '7':
      await interaction.reply(`7神：https://www.youtube.com/@7r_yi`);
      break;
    case 'ポンカメ':
      await interaction.reply(`ポンカメ：https://www.youtube.com/@ポンカメ`);
      break;
    case '3にゃん':
      await interaction.reply(`3にゃん：https://www.youtube.com/@san__nyan`);
      break;
    case 'ネコレンジャー':
      await interaction.reply(`ネコレンジャー：https://www.youtube.com/@NEKO_RANGER`);
      break;
    case 'game8':
      await interaction.reply(`GAME8：https://game8.jp/battlecats`);
      break;
    case 'ゲーム乱舞':
      await interaction.reply(`ゲーム乱舞：https://gameranbu.jp/battlecats/`);
      break;
    case 'officialx':
      await interaction.reply(`公式X：https://x.com/PONOS_GAME/`);
      break;
    case 'officialyoutube':
      await interaction.reply(`公式YouTube：https://www.youtube.com/@にゃんこスタジオ公式チャンネルにゃん`);
      break;
    // 必要に応じて他のキーワードの処理を追加
    default:
      // ここに来ることは基本的にはないはずですが、念のため
      await interaction.reply(`指定されたキーワードが見つかりませんでした。`);
  }
}