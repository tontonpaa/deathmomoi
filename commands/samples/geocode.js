// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('geocode')
    .setDescription('住所から緯度経度を検索します')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('例：埼玉県北葛飾郡杉戸町才羽 (番地や建物名は精度が落ちます)')
        .setRequired(true)),

  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    const address = interaction.options.getString('address');

    try {
      // node-fetch v3+ は ESM専用のため、CommonJSでは動的import()で読み込む
      const fetch = (await import('node-fetch')).default;

      // Nominatim APIを利用してジオコーディング
      const encodedAddress = encodeURIComponent(address);
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=jsonv2&countrycodes=jp&addressdetails=1&limit=1`;

      const response = await fetch(apiUrl, {
        headers: {
          // User-Agentの指定が推奨されています
          'User-Agent': 'DiscordBot/1.0 (YourBot; https://example.com/)'
        }
      });

      if (!response.ok) {
        console.error(`Nominatim API error: ${response.status}`);
        await interaction.reply({ content: 'ジオコーディングAPIでエラーが発生しました。', ephemeral: true });
        return;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // 最初の検索結果を利用
        const firstResult = data[0];
        const latitude = firstResult.lat;
        const longitude = firstResult.lon;
        const displayName = firstResult.display_name;

        await interaction.reply({ content: `**検索結果:** \`${displayName}\`\n**座標:** \`緯度: ${latitude}, 経度: ${longitude}\``, ephemeral: false });
      } else {
        await interaction.reply({ content: `「${address}」の座標が見つかりませんでした。住所の形式を確認してください。`, ephemeral: true });
      }

    } catch (error) {
      console.error('ジオコーディング中にエラーが発生しました:', error);
      await interaction.reply({ content: 'ジオコーディング中にエラーが発生しました。', ephemeral: true });
    }
  },
};
