module.exports = class Temtan{
  constructor(){
    // 雑多なフラグ処理
    this.jankenFlag = false;
    this.ohanashiFlag = false;
    this.isTenkiFlag = false;
    this.targetUser = null;
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
}
