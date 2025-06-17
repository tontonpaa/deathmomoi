import { ndnDice } from "../commands/utils/dice.mjs";

export default async (message) => {
  if (message.content.match(/ぽてと|ポテト|じゃがいも|ジャガイモ|🥔|🍟/)) {
    await message.react("🥔");
  }

  if (message.content.match(/にゃん|にゃーん|にゃ～ん/)) {
    await message.reply("にゃ～んなんていうと思ったか、カス");
  }

  if (message.content.match(/^\d+d\d+$/)) {
    await message.reply(ndnDice(message.content));
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/おはよ|おはよー/)) {
    const replies = ["おはよー", "貴様は今日を生き延びることができるか？", "お前が朝食"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/こんにちは|こんちは|こんちくわ/)) {
    const replies = ["こんちくしょう", "やぁ！くたばれ！", "こんにちは！生きてて楽しい？"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/おやすみ|おやー|おすやみ/)) {
    const replies = ["すみー", "もうおやすみ...（死）", "GoodBye(REDダメージ300)"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/Fatality|fatality|フェイタリティ|ふぇいたりてぃ/)) {
    const replies = ["Fatality...", "Execute♡", "Go to hell"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (
    message.content &&
    message.attachments.size === 0 &&
    message.content.match(/(?:^|[\s\W])(?:あ゛あ゛あ゛|やりますねぇ|ﾔﾘﾏｽﾈｪ|すここい|YAJU|yaju|いいっすね|ｱｰｲｷｿ|ｱｰｲｸ|あくしろよ|頭にきますよ|当たり前だよなぁ|アツゥイ|あっ、これかぁ|察し|そっかぁ|あのさぁ|あほくさ|ナス|🍆|いいゾ|ありますあります|いいよこいよ|良い世来いよ|いいよ、来いよ|いいよ来いよ|胸にかけて|イキスギ|いきすぎ|行き過ぎ|行きすぎ|粋すぎ|いくいく|イクイク|ｲｸｲｸ|デカすぎ|でかすぎ|ｳｰﾝ|見てたゾ|ダルルォ|うん、おいしい|うんちして♡|困惑|王道を征く|おかのした|やめちくり|てんじゃ～ん|オッスオッス|おっすおっす|おっ、|そうだな|適当|オナシャス|お前の彼|お前のことが好きだったんだよ|ノンケかよ|アイスティー|おまんこぉ|気さくな挨拶|実家のような安心感|親の顔より|金！暴力！SEX！|金！暴力！セックス！|汚ねえ|キメてるんだろ|くっせえな|こいついつも|この辺にぃ|うまいラーメン屋の屋台|来てるらしいっすよ|恥ずかしくないのかよ|普通だな！|戒め|してはいけない|じゃあまず|じゃけん|邪剣夜|すいません許してください|何でもしますから|なんでもしますから|なんでもするとは|何でもするとは|世界一や|そうだよ|便乗|怒られちゃうだろ|そんなことしたら|ダイナモ感覚|多少はね|たまげた|お前初めてか|力抜けよ|デデドン|ででどん|絶望|で、出ますよ|ないです|しゃぶれ|日本一|よなぁ|ガバガバ|ホモ|ですかね…|何で見る必要|正論|24|２４|学生です|楽聖です|ぬわあ|もおおん|もおおおん|もおおおおん|もおおおおおん|喉渇いた|喉渇かない|クソデカため息|はぁ～|バァン|大破|追突|は？|威圧|入って、どうぞ|入ってどうぞ|ぶっとい|ないのかよ|はっきりわかんだね|流行らせコラ|冷えてるか|二人は幸せな|ブッチッ|ぶっちっ|まずいですよ|焼いてかない|見たけりゃ見せてやるよ|震え声|見ろよ|見とけよ|みろよ|みとけよ|もう許せるぞ|やめろぉ|ナイスゥ|建前|ンアッ|んあっ|んあー|ンアー|893|810|８９３|８１０|１９１９|1919|１１４|114|５１４|514|364|３６４|８８９|889|931|９３１|4章|ばっちぇ|バッチェ|!!|！！|‼️|‼|❗|TDN|HTN|TNOK|SBR|兄貴|2号|GO|yaju|野獣|ヤジュ|ﾔｼﾞｭ|ﾝｱ|ﾔﾘﾏｽﾈ|ジュッセン|田所|浩二|浩治|淫夢|いんむ|インム|ｲﾝﾑ|いんゆめ|インユメ|せんぱい|先輩|ｾﾝﾊﾟｲ|TON|遠野|拓也|たくや|ﾀｸﾔ|タクヤ|一般通過|KMR|KBS|KBT|TBS)(?:[\s\W]|$)/)
  ) {
    const replies = ["アリス、淫夢はもうやめなって！","キヴォトスでは淫夢ごっこは恥ずかしいんだよ！","やめなって言ってるでしょ!!","アリス、貴様を処刑する。理由はもちろんお分かりですね？","Unlimited…","君を止めるためなら、、、","ぬっ殺す！！","はい、ストップ","aoharu protecter acted…","私を倒してから言いなさい"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  
  










  
  if (
    message.content &&
    message.attachments.size === 0 &&
    message.content.match(/(?:^|[\s\W])(?:ここに入力|ここに入力)(?:[\s\W]|$)/)
  ) {
    const replies = ["","",""];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }








  
  if (message.content && message.attachments.size === 0) {
    const timeMatch = message.content.match(/(\d+)(秒後|分後|時間後)/);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2];
      let delayMs;

      switch (unit) {
        case '秒後':
          delayMs = value * 1000;
          break;
        case '分後':
          delayMs = value * 60 * 1000;
          break;
        case '時間後':
          delayMs = value * 60 * 60 * 1000;
          break;
      }

      const replies = [`${value}${unit}ね！`, `${value}${unit}ステンバーイ…`, `${value}${unit}の重みを知れ！`];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      await message.reply(reply);

      const messageId = message.id;
      const channelId = message.channel.id;

      setTimeout(async () => {
        const channel = await message.client.channels.fetch(channelId);
        const originalMessage = await channel.messages.fetch(messageId);

        let mention = `<@${message.author.id}>`; // デフォルトは送信者

        // メッセージの内容にメンションが含まれているかチェック
        const mentionedUsers = message.mentions.users;
        const mentionedRoles = message.mentions.roles;

        if (message.content.includes('@everyone') || mentionedUsers.size > 0 || mentionedRoles.size > 0) {
          const mentionsArray = [];
          if (message.content.includes('@everyone')) {
            mentionsArray.push('@everyone');
          }
          mentionedUsers.forEach(user => mentionsArray.push(`<@${user.id}>`));
          mentionedRoles.forEach(role => mentionsArray.push(`<@&${role.id}>`));
          mention = mentionsArray.join(' ');
        }

        await originalMessage.reply(`${value}${unit}だぞ！ ${mention}`);
      }, delayMs);
    }
  }



};


/* 

import { ndnDice } from "../commands/utils/dice.mjs";

export default async (message) => {
  if (message.content.match(/ぽてと|ポテト|じゃがいも|ジャガイモ|🥔|🍟/)) {
    await message.react("🥔");
  }

  if (message.content.match(/にゃん|にゃーん|にゃ～ん/)) {
    await message.reply("にゃ～んなんていうと思ったか、カス");
  }

  if (message.content.match(/^\d+d\d+$/)) {
    await message.reply(ndnDice(message.content));
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/おはよ|おはよー/)) {
    const replies = ["おはよー", "貴様は今日を生き延びることができるか？", "お前が朝食"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/こんにちは|こんちは|こんちくわ/)) {
    const replies = ["こんちくしょう", "やぁ！くたばれ！", "こんにちは！生きてて楽しい？"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/おやすみ|おやー|おすやみ/)) {
    const replies = ["すみー", "もうおやすみ...（死）", "GoodBye(REDダメージ300)"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }

  if (message.content && message.attachments.size === 0 && message.content.match(/Fatality|fatality|フェイタリティ|ふぇいたりてぃ/)) {
    const replies = ["Fatality…", "Execute♡", "Go to hell"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await message.reply(reply);
  }
  
  if (
  message.content &&
  message.attachments.size === 0 &&
  message.content.match(/(?:^|[\s\W])(?:あ゛あ゛あ゛|やりますねぇ|ﾔﾘﾏｽﾈｪ|すここい|YAJU|yaju|いいっすね|ｱｰｲｷｿ|ｱｰｲｸ|あくしろよ|頭にきますよ|当たり前だよなぁ|アツゥイ|あっ、これかぁ|察し|そっかぁ|あのさぁ|あほくさ|ナス|🍆|いいゾ|ありますあります|いいよこいよ|良い世来いよ|いいよ、来いよ|いいよ来いよ|胸にかけて|イキスギ|いきすぎ|行き過ぎ|行きすぎ|粋すぎ|いくいく|イクイク|ｲｸｲｸ|デカすぎ|でかすぎ|ｳｰﾝ|見てたゾ|ダルルォ|うん、おいしい|うんちして♡|困惑|王道を征く|おかのした|やめちくり|てんじゃ～ん|オッスオッス|おっすおっす|おっ、|そうだな|適当|オナシャス|お前の彼|お前のことが好きだったんだよ|ノンケかよ|アイスティー|おまんこぉ|気さくな挨拶|実家のような安心感|親の顔より|金！暴力！SEX！|金！暴力！セックス！|汚ねえ|キメてるんだろ|くっせえな|こいついつも|この辺にぃ|うまいラーメン屋の屋台|来てるらしいっすよ|恥ずかしくないのかよ|普通だな！|戒め|してはいけない|じゃあまず|じゃけん|邪剣夜|すいません許してください|何でもしますから|なんでもしますから|なんでもするとは|何でもするとは|世界一や|そうだよ|便乗|怒られちゃうだろ|そんなことしたら|ダイナモ感覚|多少はね|たまげた|お前初めてか|力抜けよ|デデドン|ででどん|絶望|で、出ますよ|ないです|しゃぶれ|日本一|よなぁ|ガバガバ|ホモ|ですかね…|何で見る必要|正論|24|２４|学生です|楽聖です|ぬわあ|もおおん|もおおおん|もおおおおん|もおおおおおん|喉渇いた|喉渇かない|クソデカため息|はぁ～|バァン|大破|追突|は？|威圧|入って、どうぞ|入ってどうぞ|ぶっとい|ないのかよ|はっきりわかんだね|流行らせコラ|冷えてるか|二人は幸せな|ブッチッ|ぶっちっ|まずいですよ|焼いてかない|見たけりゃ見せてやるよ|震え声|見ろよ|見とけよ|みろよ|みとけよ|もう許せるぞ|やめろぉ|ナイスゥ|建前|ンアッ|んあっ|んあー|ンアー|893|810|８９３|８１０|１９１９|1919|１１４|114|５１４|514|364|３６４|８８９|889|931|９３１|4章|ばっちぇ|バッチェ|!!|！！|‼️|‼|❗|TDN|HTN|TNOK|SBR|兄貴|2号|GO|yaju|野獣|ヤジュ|ﾔｼﾞｭ|ﾝｱ|ﾔﾘﾏｽﾈ|ジュッセン|田所|浩二|浩治|淫夢|いんむ|インム|ｲﾝﾑ|いんゆめ|インユメ|せんぱい|先輩|ｾﾝﾊﾟｲ|TON|遠野|拓也|たくや|ﾀｸﾔ|タクヤ|一般通過|KMR|KBS|KBT|TBS)(?:[\s\W]|$)/)
) {
  const replies = ["アリス、淫夢はもうやめなって！","キヴォトスでは淫夢ごっこは恥ずかしいんだよ！","やめなって言ってるでしょ!!","アリス、貴様を処刑する。理由はもちろんお分かりですね？","Unlimited…","君を止めるためなら、、、","ぬっ殺す！！","はい、ストップ","aoharu protecter acted…","私を倒してから言いなさい"];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  await message.reply(reply);
}

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  if (message.content && message.attachments.size === 0) {
    const timeMatch = message.content.match(/(\d+)(秒後|分後|時間後)/);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2];
      let delayMs;

      switch (unit) {
        case '秒後':
          delayMs = value * 1000;
          break;
        case '分後':
          delayMs = value * 60 * 1000;
          break;
        case '時間後':
          delayMs = value * 60 * 60 * 1000;
          break;
      }

      const replies = [`${value}${unit}ね！`, `${value}${unit}ステンバーイ…`, `${value}${unit}の重みを知れ！`];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      await message.reply(reply);

      const messageId = message.id;
      const channelId = message.channel.id;

      setTimeout(async () => {
        const channel = await message.client.channels.fetch(channelId);
        const originalMessage = await channel.messages.fetch(messageId);

        let mention = `<@${message.author.id}>`; // デフォルトは送信者

        // メッセージの内容にメンションが含まれているかチェック
        const mentionedUsers = message.mentions.users;
        const mentionedRoles = message.mentions.roles;

        if (message.content.includes('@everyone') || mentionedUsers.size > 0 || mentionedRoles.size > 0) {
          const mentionsArray = [];
          if (message.content.includes('@everyone')) {
            mentionsArray.push('@everyone');
          }
          mentionedUsers.forEach(user => mentionsArray.push(`<@${user.id}>`));
          mentionedRoles.forEach(role => mentionsArray.push(`<@&${role.id}>`));
          mention = mentionsArray.join(' ');
        }

        await originalMessage.reply(`${value}${unit}だぞ！ ${mention}`);
      }, delayMs);
    }
  }


  
};



*/