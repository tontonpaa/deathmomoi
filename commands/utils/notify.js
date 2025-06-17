// 'import' を 'require' に変更
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelType,
} = require("discord.js");

const Sequelize = require("sequelize");
// 拡張子を.jsに変更
const Notification = require("../../models/notification.js");

// 'export' を 'module.exports' にまとめる
module.exports = {
  data: new SlashCommandBuilder()
    .setName("notify")
    .setDescription(
      "ボイスチャンネルに人が入ったときに、通知するよう設定できるよ～"
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("status").setDescription("このチャンネルの通知設定を確認するよ～")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("サーバー内のすべての通知設定を確認するよ～")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("configure").setDescription("通知するボイスチャンネルを設定するよ～")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("delete").setDescription("このチャンネルの通知設定を削除するよ～")
    ),

  execute: async function (interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "status") {
      const notifications = await Notification.findAll({
        where: {
          guildId: interaction.guildId,
          textChannelId: interaction.channelId,
        },
      });

      if (notifications.length === 0) {
        await interaction.reply({ content: "このチャンネルには通知設定がありません。", ephemeral: true });
        return;
      }

      const channelsArr = notifications.map((n) => `・<#${n.voiceChannelId}>`);
      const channels = channelsArr.join("\n");

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`<#${interaction.channelId}> で監視中のボイスチャンネル`)
        .setDescription(channels);

      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === "list") {
      const notificationTextChannels = await Notification.findAll({
        where: {
          guildId: interaction.guildId,
        },
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("textChannelId")), "textChannelId"],
        ],
      });

      if (notificationTextChannels.length === 0) {
        await interaction.reply({ content: "このサーバーには通知設定がありません。", ephemeral: true });
        return;
      }

      const embeds = await Promise.all(
        notificationTextChannels.map(async (n) => {
          const notifications = await Notification.findAll({
            where: {
              guildId: interaction.guildId,
              textChannelId: n.textChannelId,
            },
          });
          const channelsArr = notifications.map(
            (noti) => `・<#${noti.voiceChannelId}>`
          );
          const channels = channelsArr.join("\n") || "設定がありません。";

          return new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`<#${n.textChannelId}> へ通知するボイスチャンネル`)
            .setDescription(channels);
        })
      );

      await interaction.reply({ embeds: embeds });

    } else if (subcommand === "configure") {
      const notifications = await Notification.findAll({
        where: {
          guildId: interaction.guildId,
          textChannelId: interaction.channelId,
        },
      });

      const voiceChannelSelect = new ChannelSelectMenuBuilder()
        .setCustomId("selectVoiceChannel")
        .setChannelTypes(ChannelType.GuildVoice) // ChannelTypeを使用
        .setPlaceholder("通知を設定したいボイスチャンネルを選択")
        .setMaxValues(20);

      if (notifications.length > 0) {
        const defaultChannels = notifications.map(n => n.voiceChannelId);
        voiceChannelSelect.setDefaultChannels(defaultChannels);
      }

      const row = new ActionRowBuilder().addComponents(voiceChannelSelect);

      const response = await interaction.reply({
        content: "監視したいボイスチャンネルを選んでね（メニューを閉じると確定します）",
        components: [row],
        ephemeral: true,
      });
      
      const collectorFilter = (i) => i.user.id === interaction.user.id;
      
      try {
        const collectedInteraction = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        await Notification.destroy({
            where: { textChannelId: interaction.channelId },
        });

        const channelsArr = await Promise.all(
            collectedInteraction.values.map(async (voiceChannelId) => {
                await Notification.create({
                    guildId: interaction.guildId,
                    voiceChannelId: voiceChannelId,
                    textChannelId: interaction.channelId,
                });
                return `<#${voiceChannelId}>`;
            })
        );
        
        const channels = channelsArr.length > 0 ? channelsArr.join("\n") : "なし";

        const embed = new EmbedBuilder()
            .setColor(0x5cb85c)
            .setTitle(`<#${interaction.channelId}> の通知設定を更新しました`)
            .setDescription(channels);
        
        await collectedInteraction.update({
            content: "設定完了～👍",
            embeds: [embed],
            components: [],
        });

      } catch (e) {
        await interaction.editReply({ content: 'タイムアウトしました。もう一度やり直してください。', components: [] });
      }

    } else if (subcommand === "delete") {
        const notifications = await Notification.findAll({
            where: { textChannelId: interaction.channelId },
        });

        if (notifications.length === 0) {
            await interaction.reply({ content: "このチャンネルには削除できる通知設定がありません。", ephemeral: true });
            return;
        }

        const options = notifications.map(n => 
            new StringSelectMenuOptionBuilder()
                .setLabel(interaction.guild.channels.cache.get(n.voiceChannelId)?.name || '不明なチャンネル')
                .setValue(n.voiceChannelId)
        );

        const select = new StringSelectMenuBuilder()
            .setCustomId('delete-notification')
            .setPlaceholder('削除する通知設定を選択してください')
            .addOptions(options)
            .setMinValues(1)
            .setMaxValues(options.length);

        const row = new ActionRowBuilder().addComponents(select);

        const response = await interaction.reply({
            content: "このチャンネルの通知設定の中から、削除するものを選択してください。",
            components: [row],
            ephemeral: true,
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
            const collectedInteraction = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            const destroyedCount = await Notification.destroy({
                where: {
                    textChannelId: interaction.channelId,
                    voiceChannelId: collectedInteraction.values,
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
  },
};
