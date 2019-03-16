(()=>{
  "use strict"
  const Discord = require('discord.js');
  const OpenWeatherMap = require('./lib/openWeatherMap.js');
  const Mine = require("./lib/mine.js");
  const BlackJack = require("./lib/blackjack.js");
  const Temtan = require("./lib/temtanbot.js");

  const client = new Discord.Client();

  // tokenを環境変数から取得
  const token = process.env.TEMTAN_TOKEN;

  // openWeatherMap
  const openWeatherMapToken = process.env.OPEN_WEATHER_MAP;
  let openWeatherMap = new OpenWeatherMap(openWeatherMapToken);

  // Minesweepe
  const mine = new Mine();

  // blackjack
  const blackjack = new BlackJack(true);

  // Temtan
  const temtan = new Temtan();

  // 環境変数が取得できるかの判定
  if(typeof token === 'undefined'){
    console.log("discordのtokenを指定してください");
    return;
  }
  if(typeof openWeatherMapToken === 'undefined'){
    console.log("openWeatherMapのtokenを指定してください");
    return;
  }

  // PromiseでHTTPリクエストを実施する。
  function getRequest(getURL){
    let request = require('request');
    return new Promise((resolve,reject) => {
      request(getURL, function (error, response, body) {
      if(!error && response.statusCode == 200){
          resolve(body);
        }
        else{
          reject(body);
        }
      });
    });
  }

  // 待受画面
  client.on('ready', ()=>{
    console.log("ログインしました。");
  });

  // メッセージ応対
  client.on('message', (message)=>{
    // 無限ループって怖くね？
    if(message.author.id === client.user.id){
      return;
    }
    if(message.content.match(/こんに?ちは/)){
      let res = temtan.hello(message.author.username);
      message.channel.send(res);
    }
    else if(message.content === "おはなし"){
      let res = temtan.ohanashi(message.author.id);
      message.channel.send(res);
    }
    // 相槌を返す
    else if(temtan.ohanashiFlag && temtan.targetUser === message.author.id){
      let res = temtan.ohanashi_aizuchi();
      message.channel.send(res);
    }
    else if(message.content.indexOf("テムたん") > -1 ){
      let res = temtan.temtan_call();
      message.channel.send(res);
    }
    else if(message.content.indexOf("help") > -1 ){
      let res = temtan.temtan_help();
      message.channel.send(res);
    }
    // じゃんけん開始
    else if(message.content.match(/(じゃんけん)|(ジャンケン)/)){
      let res = temtan.janken_start(message.author.id);
      message.channel.send(res);
    }
    // じゃんけんをする。
    else if(temtan.jankenFlag && temtan.targetUser === message.author.id){
      let res = temtan.janken_play(message.content);
      message.channel.send(res);
    }
    // 天気
    else if(message.content.indexOf("天気") > -1 ){
      temtan.isTenkiFlag = true;
      temtan.targetUser = message.author.id;
      message.reply("どこの天気を知りたい？");
    }
    // 天気を返す
    else if(temtan.isTenkiFlag && temtan.targetUser === message.author.id){
      openWeatherMap.getWeather(message.content)
      .then((res)=>{
        message.reply( openWeatherMap.getWeatherJapanese(res) );
      })
      .catch((e)=>{
        let meg = "";
        switch (e.cod) {
          case "401":
            meg = "tokenがおかしいよお・・・";
            break;
          case "404":
            meg = "そんな街無いみたいだよ・・・お兄ちゃん・・・";
            break;
          default:
            meg = "予期せぬエラーが発生したよ！お兄ちゃん！";
            break;
        }
        message.reply( meg );
      });
      temtan.isTenkiFlag = false;
      temtan.targetUser = null;
    }
    // マインスイーパ
    else if(message.content.indexOf("mine") > -1 ){
      let mine_cmd = message.content.split(" ");
      if(mine_cmd[1] === "show"){
        let out_str = "```" + JSON.stringify(mine) + "```";
        message.channel.send(out_str);
      }
      else if(mine_cmd[1] === "reset"){
        let set_num = Number(mine_cmd[2]);
        let msg = "強制リセットをかけます！\n";
        msg += mine.start_game(set_num);
        message.channel.send(msg);
      }
      else if(!mine.playing){
        let set_num = Number(mine_cmd[1]);
        let msg = mine.start_game(set_num);
        message.channel.send(msg);
      }
      else{
        let now_msg = mine.open_board(mine_cmd[1], mine_cmd[2]);
        let board_status = mine.show_board_discord();
        let out_str = board_status + "\n" + now_msg;
        message.channel.send(out_str);
      }
    }
    // BlackJack
    else if (message.content.match(/(bj)|(blackjack)/)){
      let bj_cmd = message.content.split(" ");
      if(bj_cmd.length > 1){
        bj_cmd = bj_cmd[1];
        let out_str = '';
        switch (bj_cmd) {
          case 'start':
            if(blackjack.end){
              blackjack.init();
              while(blackjack.end){
                out_str += blackjack.end_show();
                blackjack.init();
              }
              out_str += blackjack.show_status();
              out_str += "\nヒットしますか？ y/n";
            }
            else{
              out_str = "ゲームはすでに始まってますよー\n";
            }
            break;
          case 'status':
            out_str = blackjack.show_status();
            out_str += "\nヒットしますか？ y/n";
            break;
          case 'y':
          case 'yes':
          case 'n':
          case 'no':
            if(!blackjack.end){
              let is_hit = (bj_cmd === 'y' ||bj_cmd === 'yes');
              blackjack.hit_player(is_hit);
              if(blackjack.end){
                out_str += blackjack.end_show();
              }
              else{
                out_str += blackjack.show_status();
                out_str += "\nヒットしますか？ y/n";
              }
            }
            else{
              out_str = "ゲームは開始されてません！\n";
            }
            break;
          default:
            out_str = "BlackJackの正しいコマンドではありませんよー\n" +
              "bj start: ゲームを開始\n";
              "bj status: ゲームの状況を表示\n";
              "bj y/n: hitするかどうかを選択\n";
            break;
        }
        message.channel.send(out_str);
      }
    }
    // test
    else if(message.content.indexOf("get data") > -1 ){
      let out_str = "```";
      out_str += "user:"+message.author+"\n";
      out_str += "user id:"+message.author.id+"\n";
      out_str += "user name:"+message.author.username+"\n";
      out_str += "server id:"+message.guild.id+"\n";
      out_str += "server name:"+message.guild.name+"\n";
      out_str += "server total member:"+message.guild.memberCount+"\n";
      out_str += "channel name:"+message.channel.name+"\n";
      out_str += "channel calculatedPosition:"+message.channel.calculatedPosition+"\n";
      out_str += "```";
      message.channel.send(out_str);
      message.reply("リプテスト");
    }
  });

  // Discordへの接続
  client.login(token);
})();
