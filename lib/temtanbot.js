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
}
