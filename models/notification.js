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
const Notification = sequelize.define("Notification", {
  guildId: {
    type: DataTypes.STRING,
  },
  voiceChannelId: {
    type: DataTypes.STRING,
  },
  textChannelId: {
    type: DataTypes.STRING,
  },
});

// 'export default' を 'module.exports' に変更
module.exports = Notification;
