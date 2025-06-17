// 'import' を 'require' に変更
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

const Sequelize = require("sequelize");
const Parser = require('rss-parser');

// 拡張子を.jsに変更
const YoutubeFeeds = require("../../models/youtubeFeeds.js");
const YoutubeNotifications = require("../../models/youtubeNotifications.js");
const parser = new Parser();

// 'export' を 'module.exports' にまとめる
module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("YouTube チャンネルの新着動画をお知らせするよ～")
    .addSubcommand((subcommand) =>
      subcommand.setName("add")
        .setDescription("実行したテキストチャンネルに通知設定を追加するよ～")
        .addStringOption(option =>
          option
            .setName('url')
            .setDescription('チャンネルの URL を指定してね')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("すべての設定を確認するよ～")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("delete").setDescription("設定を削除するよ～")
    ),

  execute: async function(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      await interaction.deferReply();
      
      const url = interaction.options.getString('url');
      
      // ESM専用パッケージを動的importで読み込む
      const YoutubeIdResolver = (await import('@gonetone/get-youtube-id-by-url')).default;
      const id = await YoutubeIdResolver.channelId(url);
      if (!id) {
        await interaction.editReply({ content: "無効なYouTubeチャンネルURL、またはチャンネルが見つかりませんでした。" });
        return;
      }

      const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + id;
      
      const youtubeNoficationCount = await YoutubeNotifications.count({
        where: {
          guildId: interaction.guildId,
          textChannelId: interaction.channelId,
          channelFeedUrl: feedUrl,
        },
      });
      if (youtubeNoficationCount > 0) {
        await interaction.editReply({ content: "そのチャンネルは既にこのテキストチャンネルに設定されています。" });
        return;
      }
      
      try {
        const feed = await parser.parseURL(feedUrl);

        // Feedから最新の投稿日時を取得
        let latestDate;
        if (feed.items.length > 0) {
            latestDate = feed.items.map(item => new Date(item.isoDate)).reduce((a, b) => a > b ? a : b);
        } else {
            latestDate = new Date(); // 投稿がない場合は現在時刻
        }

        // findOrCreateで、同じフィードURLのデータがなければ作成
        await YoutubeFeeds.findOrCreate({
            where: { channelFeedUrl: feedUrl },
            defaults: {
                channelFeedUrl: feedUrl,
                channelLatestUpdateDate: latestDate.toISOString(),
            }
        });

        await YoutubeNotifications.create({
          guildId: interaction.guildId,
          textChannelId: interaction.channelId,
          channelName: feed.title,
          channelUrl: url,
          channelFeedUrl: feedUrl,
        });

        const embed = new EmbedBuilder()
          .setColor(0x5cb85c)
          .setTitle(`<#${interaction.channelId}> に YouTube チャンネル通知を設定しました！`)
          .setDescription(`**チャンネル名:** ${feed.title}\n**URL:** ${url}`);

        await interaction.editReply({
          content: "",
          embeds: [embed],
        });

      } catch (error) {
          console.error("Feedの解析またはDBの操作に失敗しました:", error);
          await interaction.editReply({ content: "チャンネル情報の取得または設定の保存中にエラーが発生しました。" });
      }

    } else if (subcommand === "list") {
      const notificationTextChannels = await YoutubeNotifications.findAll({
        where: {
          guildId: interaction.guildId,
        },
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('textChannelId')), 'textChannelId'],
        ]
      });
      
      if (notificationTextChannels.length === 0) {
        await interaction.reply({ content: "このサーバーには通知設定がありません。", ephemeral: true });
        return;
      }

      const embeds = await Promise.all(
        notificationTextChannels.map(async (n) => {
          const youtubeNofications = await YoutubeNotifications.findAll({
            where: {
              guildId: interaction.guildId,
              textChannelId: n.textChannelId,
            },
          });
          const channelsArr = youtubeNofications.map(noti => `[${noti.channelName}](${noti.channelUrl})`);
          const channels = channelsArr.join("\n") || "設定がありません。";

          return new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`<#${n.textChannelId}> に通知を送信する YouTube チャンネル`)
            .setDescription(channels);
        })
      );

      await interaction.reply({
        content: "",
        embeds: embeds,
      });

    } else if (subcommand === "delete") {
      const notifications = await YoutubeNotifications.findAll({
        where: {
          textChannelId: interaction.channelId,
        },
      });
      
      if (notifications.length === 0) {
        await interaction.reply({ content: "このチャンネルには削除できる通知設定がありません。", ephemeral: true });
        return;
      }

      const notificationSelectMenuOptions = notifications.map(n => 
        new StringSelectMenuOptionBuilder()
          .setLabel(n.channelName.substring(0, 100)) // ラベルは100文字以内
          .setDescription(n.channelUrl.substring(0, 100)) // 説明は100文字以内
          .setValue(n.channelFeedUrl)
      );
      
      const select = new StringSelectMenuBuilder()
        .setCustomId('youtube-delete')
        .setPlaceholder('削除する通知設定を選択してください')
        .addOptions(notificationSelectMenuOptions)
        .setMinValues(1)
        .setMaxValues(notificationSelectMenuOptions.length);
      
      const row = new ActionRowBuilder().addComponents(select);
      
      const response = await interaction.reply({
        content: 'このチャンネルに設定されている通知の中から、削除するものを選択してください。',
        components: [row],
        ephemeral: true, // 他の人に見えないように
      });

      const collectorFilter = (i) => i.user.id === interaction.user.id;

      try {
        const collectedInteraction = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        const destroyedCount = await YoutubeNotifications.destroy({
            where: {
                textChannelId: collectedInteraction.channelId,
                channelFeedUrl: collectedInteraction.values, // valuesは選択されたchannelFeedUrlの配列
            }
        });

        await collectedInteraction.update({
          content: `${destroyedCount}件の通知設定を削除しました。`,
          components: [],
        });

      } catch (e) {
        await interaction.editReply({ content: 'タイムアウトしました。もう一度やり直してください。', components: [] });
      }
    }
  }
};
