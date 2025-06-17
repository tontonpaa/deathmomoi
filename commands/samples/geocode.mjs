import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('geocode')
  .setDescription('住所から緯度経度を検索します')
  .addStringOption(option =>
    option.setName('address')
    .setDescription('例：埼玉県北葛飾郡杉戸町才羽(番地の数字や建物名は無理)')
    .setRequired(true));

export async function execute(interaction) {
  const address = interaction.options.getString('address');

  try {
    // Nominatim APIを利用してジオコーディング
    const encodedAddress = encodeURIComponent(address);
    // より詳細な検索を行うために、クエリ文字列を調整
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=jsonv2&countrycodes=jp&addressdetails=1&limit=5`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'DiscordBot' // User-Agentは必須ではありませんが、推奨されています
      }
    });

    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status}`);
      await interaction.reply({ content: 'ジオコーディングAPIでエラーが発生しました。', ephemeral: true });
      return;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      // 複数の検索結果がある場合は、最初の結果を表示
      const firstResult = data[0];
      const latitude = firstResult.lat;
      const longitude = firstResult.lon;
      await interaction.reply({ content: `「${address}」の座標は 緯度: ${latitude}, 経度: ${longitude} です。`, ephemeral: true });
    } else {
      await interaction.reply({ content: `「${address}」の座標が見つかりませんでした。住所の形式を確認してください。`, ephemeral: true });
    }

  } catch (error) {
    console.error('ジオコーディング中にエラーが発生しました:', error);
    await interaction.reply({ content: `ジオコーディング中にエラーが発生しました。\n**エラー内容:**\n\`\`\`\n${error.message}\n\`\`\``, ephemeral: true });
  }
}