// importをrequireに変更
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const foldersPath = path.join(process.cwd(), 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// export defaultをmodule.exportsに変更
module.exports = () => { // asyncは内側でawaitを使っているので不要
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    // 読み込むファイルの拡張子を.jsに変更
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // await import()をrequire()に変更
      const command = require(filePath);
      // module.dataではなくcommand.dataを参照 (requireの結果を変数に入れたため)
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(`[警告] ${filePath} のコマンドに、必要な "data" または "execute" プロパティがありません。`);
      }
    }
  }

  // setTokenの引数が1つになっていることを確認
  const rest = new REST().setToken(process.env.TOKEN);

  // 即時実行関数で非同期処理を実行
  (async () => {
    try {
      console.log(`[INIT] ${commands.length}つのスラッシュコマンドを更新します。`);

      // applicationCommandsの引数が1つになっていることを確認
      const data = await rest.put(
        Routes.applicationCommands(process.env.APPLICATION_ID),
        { body: commands },
      );
      
      console.log(`[INIT] ${commands.length}つのスラッシュコマンドをグローバルに更新しました。`);

      // 元のコードでは同じ処理が2回あったため、こちらはコメントアウト
      // もし特定のサーバー（ギルド）にも登録したい場合は、以下のように記述します
      /*
      const guildId = 'あなたのサーバーID'; // 特定のサーバーIDを指定
      const dataGuild = await rest.put(
        Routes.applicationGuildCommands(process.env.APPLICATION_ID, guildId),
        { body: commands },
      );
      console.log(`[INIT] ${commands.length}つのスラッシュコマンドを特定のサーバーに更新しました。`);
      */

    } catch (error) {
      console.error(error);
    }
  })();
};