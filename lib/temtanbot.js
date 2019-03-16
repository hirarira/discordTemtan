module.exports = class Temtan{
  constructor(){
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
}
