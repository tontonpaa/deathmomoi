// 'import' を 'require' に変更
const { SlashCommandBuilder } = require('discord.js');

/**
 * nDn形式のダイスを振る関数
 * @param {string} ndn - "1d6" や "2d10" のような形式の文字列
 * @returns {string} - ダイスロールの結果と合計値を含む文字列
 */
function ndnDice(ndn) {
  // "d" で分割して、ダイスの数と面数を取得
  const ndnArr = ndn.toLowerCase().split('d');
  const number = parseInt(ndnArr[0], 10);
  const sides = parseInt(ndnArr[1], 10);

  // ダイスの数や面数が大きすぎる場合のエラーハンドリング
  if (number > 100 || sides > 1000) {
      return "ダイスの数または面数が多すぎます。（100d1000まで）";
  }
  
  const result = [];
  let sum = 0;

  for (let i = 0; i < number; i++) {
    const dice = Math.floor(Math.random() * sides) + 1;
    sum += dice;
    result.push(dice);
  }

  const resultString = `${number}d${sides} >> [${result.join(', ')}]\n合計: ${sum}`;
  
  // Discordの文字数制限を考慮
  if (resultString.length > 2000) {
      return `${number}d${sides} >> 合計: ${sum}\n(個別の結果が多すぎるため表示を省略しました)`;
  }

  return resultString;
}

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('さいころを振るよ～')
    .addStringOption(option =>
      option
        .setName('ndn')
        .setDescription('「1d6」や「2d10」などの形式で指定してね')
        .setRequired(true)
    ),
  
  // スラッシュコマンドが実行されたときの処理
  execute: async function(interaction) {
    const input = interaction.options.getString('ndn');
    // 正規表現を修正し、大文字の"D"にも対応
    if (!input.match(/^\d+d\d+$/i)) {
      await interaction.reply({ content: '入力形式が正しくありません。「1d6」のように入力してください。', ephemeral: true });
      return;
    }

    // 上で定義したndnDice関数を呼び出す
    const result = ndnDice(input);
    await interaction.reply(result);
  },

  // この関数を他のファイルから require できるようにエクスポートする
  ndnDice: ndnDice,
};
