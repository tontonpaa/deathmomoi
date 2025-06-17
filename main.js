// モジュールのインポートをrequireに変更
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, Events, GatewayIntentBits, ActivityType, EmbedBuilder } = require("discord.js");
const CommandsRegister = require("./regist-commands.js"); // 拡張子を.jsに
const Notification = require("./models/notification.js"); // 拡張子を.jsに
const YoutubeFeeds = require("./models/youtubeFeeds.js"); // 拡張子を.jsに
const YoutubeNotifications = require("./models/youtubeNotifications.js"); // 拡張子を.jsに

const Sequelize = require("sequelize");
const Parser = require('rss-parser');
const parser = new Parser();

// youtubeiはESM専用パッケージのため、インポート方法を工夫
// "youtubei": "6.0.0-rc.3" のようなバージョンで動作確認
const { Client: Youtubei, MusicClient } = require("youtubei");
const youtubei = new Youtubei();

let postCount = 0;
const app = express();
app.listen(3000);
app.post('/', function(req, res) {
  console.log(`Received POST request.`);
  postCount++;
  if (postCount == 10) {
    trigger();
    postCount = 0;
  }
  res.send('POST response by glitch');
});
app.get('/', function(req, res) {
  res.send('<a href="https://note.com/exteoi/n/n0ea64e258797</a> に解説があります。');
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

// --- コマンドの同期的な読み込み ---
const categoryFoldersPath = path.join(process.cwd(), "commands");
const commandFolders = fs.readdirSync(categoryFoldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(categoryFoldersPath, folder);
  // 読み込むファイルの拡張子を.jsに変更
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // requireで同期的に読み込む
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[警告] ${filePath} のコマンドに、必要な "data" または "execute" プロパティがありません。`);
    }
  }
}

// --- ハンドラの同期的な読み込み ---
const handlers = new Map();
const handlersPath = path.join(process.cwd(), "handlers");
const handlerFiles = fs.readdirSync(handlersPath).filter((file) => file.endsWith(".js"));

for (const file of handlerFiles) {
  const filePath = path.join(handlersPath, file);
  // requireで同期的に読み込む
  const handlerModule = require(filePath);
  // ファイル名をキーにしてMapにセット
  handlers.set(path.basename(file, '.js'), handlerModule);
}

// --- イベントリスナーの設定 ---
// ハンドラが確実に読み込まれた後に設定する
client.on(Events.InteractionCreate, async (interaction) => {
  // Mapからハンドラを取得し、その中のdefault関数を実行
  const handler = handlers.get("interactionCreate");
  if (handler && typeof handler.default === 'function') {
      await handler.default(interaction);
  }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const handler = handlers.get("voiceStateUpdate");
    if (handler && typeof handler.default === 'function') {
        await handler.default(oldState, newState);
    }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.id === client.user.id || message.author.bot) return;
  const handler = handlers.get("messageCreate");
  if (handler && typeof handler.default === 'function') {
      await handler.default(message);
  }
});

client.on(Events.ClientReady, async () => {
  // setActivityの第一引数はstateプロパティを持つオブジェクトである必要がなくなりました
  await client.user.setActivity("毒ユウカから毒抽出中...", { type: ActivityType.Custom });
  console.log(`${client.user.tag} がログインしました！`);
});

// データベースの同期
Notification.sync({ alter: true });
YoutubeFeeds.sync({ alter: true });
YoutubeNotifications.sync({ alter: true });

// コマンドの登録とクライアントのログイン
CommandsRegister();
// loginの引数は1つ
client.login(process.env.TOKEN);


// --- 以下、Youtubeフィード関連の関数 ---
async function trigger() {
  const youtubeNofications = await YoutubeNotifications.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('channelFeedUrl')), 'channelFeedUrl'],
    ]
  });
  await Promise.all(
    youtubeNofications.map(async n => {
      checkFeed(n.channelFeedUrl);
    })
  );
}

async function checkFeed(channelFeedUrl) {
  const youtubeFeed = await YoutubeFeeds.findOne({
    where: {
      channelFeedUrl: channelFeedUrl,
    },
  });
  
  if (!youtubeFeed) {
      console.log(`[警告] Feed URLが見つかりません: ${channelFeedUrl}`);
      return;
  }
  
  const checkedDate = new Date(youtubeFeed.channelLatestUpdateDate);
  let latestDate = new Date(youtubeFeed.channelLatestUpdateDate);
  
  const feed = await parser.parseURL(channelFeedUrl);
  const videos = feed.items.filter(i => {
    const pubDate = new Date(i.isoDate);
    return pubDate > checkedDate;
  });
  
  // 新しい動画がなければ処理を終了
  if (videos.length === 0) return;

  // 最新の日付を更新
  videos.forEach(v => {
      const pubDate = new Date(v.isoDate);
      if (pubDate > latestDate) {
          latestDate = pubDate;
      }
  });

  const notifications = await YoutubeNotifications.findAll({
    where: {
      channelFeedUrl: channelFeedUrl,
    },
  });
  
  const youtubeChannelId = channelFeedUrl.split('=').pop();

  for (const v of videos) {
    if (!v) continue;
    
    const youtubeVideoId = v.link.split('=').pop();
    const youtubeVideo = await youtubei.getVideo(youtubeVideoId);
    
    if (!youtubeVideo) continue;

    const embed = new EmbedBuilder()
      .setColor(0xcd201f)
      .setAuthor({ name: v.author, url: `https://www.youtube.com/channel/${youtubeChannelId}` })
      .setTitle(v.title)
      .setURL(v.link)
      .setDescription(youtubeVideo.description.substring(0, 200)) // 説明が長すぎる場合があるので切り詰める
      .setImage(youtubeVideo.thumbnails.at(-1)?.url) // 最も大きい解像度のサムネイル
      .setTimestamp(new Date(v.isoDate));

    for (const n of notifications) {
      try {
          const channel = await client.channels.fetch(n.textChannelId);
          if (channel) {
              await channel.send({ embeds: [embed] });
          }
      } catch (error) {
          console.error(`[エラー] チャンネルへの送信に失敗しました: ${n.textChannelId}`, error);
      }
    }
  }
  
  await YoutubeFeeds.update(
    { channelLatestUpdateDate: latestDate.toISOString() },
    {
      where: {
        channelFeedUrl: channelFeedUrl,
      },
    },
  );
}
