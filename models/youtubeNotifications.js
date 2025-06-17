// 'import' を 'require' に変更
const { Sequelize, DataTypes } = require("sequelize");

// Sequelizeインスタンスの作成
// この部分は、他のファイルで定義したSequelizeインスタンスを
// requireで読み込む形にすると、より管理しやすくなります。
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ".data/db.sqlite3",
});

// モデルの定義
const youtubeNotifications = sequelize.define("youtubeNotifications", {
  guildId: {
    type: DataTypes.STRING,
  },
  textChannelId: {
    type: DataTypes.STRING,
  },
  channelName: {
    type: DataTypes.STRING,
  },
  channelUrl: {
    type: DataTypes.STRING,
  },
  channelFeedUrl: {
    type: DataTypes.STRING,
  },
});

// 'export default' を 'module.exports' に変更
module.exports = youtubeNotifications;
