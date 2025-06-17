// 'import' を 'require' に変更
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

/**
 * じゃんけんの1回の勝負を行うヘルパー関数
 * @param {import('discord.js').ButtonInteraction} confirmation - ユーザーのボタン操作インタラクション
 * @returns {Promise<number>} - 0: あいこ, 1: ユーザーの勝ち, 2: Botの勝ち
 */
async function janken(confirmation) {
  const hands = { rock: "0", scissors: "1", paper: "2" };
  const handsEmoji = ["✊", "✌️", "🖐️"];

  const botHand = Math.floor(Math.random() * 3);
  const playersHand = hands[confirmation.customId];

  // 勝敗判定ロジック (0:あいこ, 1:Botの勝ち, 2:Playerの勝ち)
  const solve = (playersHand - botHand + 3) % 3;

  // ユーザーが出した手を無効化されたボタンとして表示する準備
  const playersHandButton = new ButtonBuilder()
    .setCustomId("playersHand")
    .setEmoji(confirmation.component.emoji)
    .setLabel(`${confirmation.component.label}を出したよ`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const confirmedRow = new ActionRowBuilder().addComponents(playersHandButton);
  
  // 初回かあいこ後かでメッセージを変更
  const text =
    confirmation.message.content === "じゃんけん..."
      ? "じゃんけん...\nぽん！"
      : "あいこで...\nしょ！";
  
  // ボタンが押されたメッセージを更新して、Botの手とユーザーの手を表示
  await confirmation.update({
    content: `${text}${handsEmoji[botHand]}`,
    components: [confirmedRow],
  });

  return solve;
}

// 'export' を 'module.exports' にまとめる
module.exports = {
  // スラッシュコマンドの定義
  data: new SlashCommandBuilder()
    .setName("janken")
    .setDescription("じゃんけんで対決！"),

  // スラッシュコマンドが実行されたときの処理
  execute: async function (interaction) {
    const rock = new ButtonBuilder()
      .setCustomId("rock")
      .setEmoji("✊")
      .setLabel("グー")
      .setStyle(ButtonStyle.Primary);

    const scissors = new ButtonBuilder()
      .setCustomId("scissors")
      .setEmoji("✌️") // 絵文字を修正
      .setLabel("チョキ")
      .setStyle(ButtonStyle.Primary);

    const paper = new ButtonBuilder()
      .setCustomId("paper")
      .setEmoji("🖐️")
      .setLabel("パー")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(rock, scissors, paper);

    const response = await interaction.reply({
      content: `じゃんけん...`,
      components: [row],
    });

    try {
      // 勝ち負けが決まるまでループ
      while (true) {
        const collectorFilter = (i) => i.user.id === interaction.user.id;

        const confirmation = await response.awaitMessageComponent({
          filter: collectorFilter,
          time: 30_000, // 30秒
        });

        const solve = await janken(confirmation);
        
        // あいこでなければループを抜ける
        if (solve !== 0) {
          const resultText = solve === 2 ? "あなたの勝ち～" : "Botの勝ち～";
          await confirmation.followUp(resultText);
          break; // ループ終了
        }
        
        // あいこの場合、新しいメッセージでボタンを再表示
        await confirmation.followUp({
          content: `あいこで...`,
          components: [row],
        });
      }
    } catch (e) {
      await interaction.editReply({
        content: "時間切れ、またはエラーが発生しました。",
        components: [],
      });
    }
  },
};
