module.exports = class Temtan{
  constructor(env){
    this.status = true;
    // openWeatherMap
    const OpenWeatherMap = require('./openWeatherMap.js');
    const openWeatherMapToken = env.OPEN_WEATHER_MAP;
    if(typeof openWeatherMapToken === 'undefined'){
      console.log("openWeatherMapのtokenを指定してください");
      this.status = false;
      return;
    }
    this.openWeatherMap = new OpenWeatherMap(openWeatherMapToken);
    // Minesweepe
    const Mine = require("./mine.js");
    this.mine = new Mine();
    // blackjack
    const BlackJack = require("./blackjack.js");
    this.blackjack = new BlackJack(true);
    // 雑多なフラグ処理
    this.jankenFlag = false;
    this.ohanashiFlag = false;
    this.isTenkiFlag = false;
    this.targetUser = null;
  }
  hello(user_name){
    let rep_mes = "こんにちは！"+user_name+"おにいちゃん！";
    return rep_mes;
  }
  /**
   * UNDO しません
   * @returns {string}
   */
  undo(){
    return 'キエリンキエリン～・・・えいっ！\n…ってあれ！効果がないよぉ…';
  }
  /**
   * clear しません
   * @returns {string}
   */
  clear(){
    return '全部消えちゃえ～っ！キエキエキエリン！・・・えいっ！\n…ってあれ！効果がないよぉ…';
  }
  // おはなし
  ohanashi(author_id){
    const WordList = [
      'ねえねえ、好きな食べ物って何？',
      'どこか外国行ったことある？',
      '尊敬する人って・・・誰かな～？',
      'どんなことが趣味なのかなあ？',
      'どんなことが好きなの？',
      'す、好きな人って誰かな///',
      'いつもどれくらい寝てる？',
      'いちばん大切にしてるものってな～に？',
      '犬派かな？猫派かな？',
      '好きなゲームってな～に？',
      '夢ってなにかな～？',
      '1番ほしいものってな～に？',
      'お前も消してやろうか？',
      'まだ起きてて大丈夫なの？'
    ];
    let rnd = Math.floor( Math.random() * WordList.length );
    this.ohanashiFlag = true;
    this.targetUser = author_id;
    return WordList[rnd];
  }
  ohanashi_aizuchi(){
    let rep_mes = "へぇ〜そうなんだ！";
    this.ohanashiFlag = false;
    this.targetUser = null;
    return rep_mes;
  }
  temtan_call(){
    let rep_mes = "なーに？わたしのこと呼んだー？";
    return rep_mes;
  }
  temtan_help(){
    let rep_mes = "わたしが反応する言葉を紹介するね！\n"
      +"```・おはなし\n"
      +"お兄ちゃんたちにわたしが色々質問するよ！```\n\n"
      +"```・じゃんけん\n"
      +"そのまんんまだけど、私とじゃんけんをして遊べるよ！```\n\n";
    return rep_mes;
  }
  janken_start(author_id){
    let rep_mes = "じゃんけんしよう！じゃじゃじゃじゃーんけーん\n";
    this.jankenFlag = true;
    this.targetUser = author_id;
    return rep_mes;
  }
  janken_play(player_msg){
    const hands = [":fist:",":v:",":hand_splayed:"];
    // フラグ初期化
    this.jankenFlag = false;
    this.targetUser = null;
    // 手を決める
    let tem_hand = Math.floor( Math.random() * 3);
    let player_hand = -1;
    if( player_msg.match(/ぐー|グー|:punch:|:fist:|rock/)){
      player_hand = 0;
    }
    else if(player_msg.match(/ちょき|チョキ|:v:|paper/)){
      player_hand = 1;
    }
    else if(player_msg.match(/ぱー|パー|scissors|:hand_splayed:/)){
      player_hand = 2;
    }
    let rep_mes;
    // まともな手を出してなかったら終了
    if(player_hand === -1){
      rep_mes  = "…ってお兄ちゃん！真面目にやってよ！もー！！\n";
    }
    else{
      let winJudge = (player_hand - tem_hand + 3) % 3;
      rep_mes = hands[tem_hand] + "\n";
      switch (winJudge) {
        case 0:
          rep_mes += "ってあいこだね！またやろうねお兄ちゃん！\n";
          break;
        case 1:
          rep_mes += "わーい勝った勝った〜！またやろうねお兄ちゃん！\n";
          break;
        case 2:
          rep_mes += "あー負けちゃった…！またやろうねお兄ちゃん！\n";
          break;
        default:
          rep_mes = "予期せぬエラーが発生したよ！お兄ちゃん！\n";
          break;
      }
    }
    return rep_mes;
  }
  tenki_start(author_id){
    this.isTenkiFlag = true;
    this.targetUser = author_id;
    let msg = "どこの天気を知りたい？";
    return msg;
  }
  tenki_get(message_content){
    this.isTenkiFlag = false;
    this.targetUser = null;
    return new Promise((resolve, reject)=>{
      this.openWeatherMap.getWeather(message_content)
      .then((res)=>{
        resolve(this.openWeatherMap.getWeatherJapanese(res));
      })
      .catch((e)=>{
        let msg = "";
        switch (e.cod) {
          case "401":
            msg = "tokenがおかしいよお・・・";
            break;
          case "404":
            msg = "そんな街無いみたいだよ・・・お兄ちゃん・・・";
            break;
          default:
            msg = "予期せぬエラーが発生したよ！お兄ちゃん！";
            console.log(e);
            break;
        }
        reject(msg);
      });
    });
  }
  play_mine(message_content){
    let mine_cmd = message_content.split(" ");
    if(mine_cmd[1] === "show"){
      return "```" + JSON.stringify(this.mine) + "```";
    }
    else if(mine_cmd[1] === "reset"){
      let set_num = Number(mine_cmd[2]);
      let msg = "強制リセットをかけます！\n";
      msg += this.mine.start_game(set_num);
      return msg;
    }
    else if(!this.mine.playing){
      let set_num = Number(mine_cmd[1]);
      return this.mine.start_game(set_num);
    }
    else{
      let now_msg = this.mine.open_board(mine_cmd[1], mine_cmd[2]);
      let board_status = this.mine.show_board_discord();
      return board_status + "\n" + now_msg;
    }
  }
  play_blackjack(message_content){
    let bj_cmd = message_content.split(" ");
    if(bj_cmd.length > 1){
      bj_cmd = bj_cmd[1];
      let out_str = '';
      switch (bj_cmd) {
        case 'start':
          if(this.blackjack.end){
            this.blackjack.init();
            while(this.blackjack.end){
              out_str += this.blackjack.end_show();
              this.blackjack.init();
            }
            out_str += this.blackjack.show_status();
            out_str += "\nヒットしますか？ y/n";
          }
          else{
            out_str = "ゲームはすでに始まってますよー\n";
          }
          break;
        case 'status':
          out_str = this.blackjack.show_status();
          out_str += "\nヒットしますか？ y/n";
          break;
        case 'y':
        case 'yes':
        case 'n':
        case 'no':
          if(!this.blackjack.end){
            let is_hit = (bj_cmd === 'y' ||bj_cmd === 'yes');
            this.blackjack.hit_player(is_hit);
            if(this.blackjack.end){
              out_str += this.blackjack.end_show();
            }
            else{
              out_str += this.blackjack.show_status();
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
      return out_str;
    }
  }
}
