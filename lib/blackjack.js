"use strict"
class Card{
  constructor(suit, num){
    this.suit_list = {
      "club":"♧",
      "diamond":"♢",
      "heart":"♡",
      "speed":"♤"
    };
    this.slack_numbers = [':zero:',':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:'];
    this.slack_suit_list = {
      "club":":clubs:",
      "diamond":":diamonds:",
      "heart":":hearts:",
      "speed":":spades:"
    }
    this.suit = suit;
    this.num = num;
    this.isUse = false;
  }
  slack_number(num){
    if(num > 9){
      return this.slack_number(Math.floor(num/10))+this.slack_numbers[num%10];
    }
    return this.slack_numbers[num];
  }
  use(){
    this.isUse = true;
    return this;
  }
  show(){
    return this.suit_list[this.suit]+" "+this.num;
  }
  show_slack(){
    return this.slack_suit_list[this.suit]+" "+this.slack_number(this.num);
  }
}

class Trumps {
  constructor(){
    const rank = 13;
    const suit = ["club", "diamond", "heart", "speed"];
    this.trumps = [];
    this.remainTrumpNum = 0;
    for(let i=1; i<=rank; i++){
      for(let j=0; j<suit.length; j++){
        this.trumps.push(new Card(suit[j], i));
        this.remainTrumpNum++;
      }
    }
  }
  pull(){
    if(this.remainTrumpNum <= 0){
      return null;
    }
    while(true){
      let number = Math.floor(Math.random() * this.trumps.length);
      if(!this.trumps[number].isUse){
        this.remainTrumpNum--;
        return this.trumps[number].use();
      }
    }
  }
}

class Player{
  constructor(name){
    this.name = name;
    this.pull_trumps = [];
    this.points = 0;
    this.turn_end = false;
  }
  pull(trumps){
    let now_trump = trumps.pull();
    let now_point = now_trump.num > 10? 10: now_trump.num;
    if(now_point == 1 && this.points < 11){
      this.points += 10;
    }
    this.points += now_point;
    this.pull_trumps.push(now_trump);
  }
  init_pull(trumps){
    this.pull(trumps);
    this.pull(trumps);
  }
  show_trumps(isSlack){
    if(isSlack){
      return this.pull_trumps.map(x => x.show_slack());
    }
    return this.pull_trumps.map(x => x.show());
  }
  show_one_trump(isSlack){
    if(isSlack){
      return this.pull_trumps[0].show_slack()+", :question::question:";
    }
    return this.pull_trumps[0].show()+", ??";
  }
}

module.exports = class BlackJack {
  constructor(isSlack){
    this.init();
    this.slack = isSlack;
  }

  init(){
    this.end = false;
    this.winner = null;
    this.player = new Player("player");
    this.dealer = new Player("dealer");
    this.trumps = new Trumps();
    this.player.init_pull(this.trumps);
    this.dealer.init_pull(this.trumps);
    if(this.player.points == 21){
      this.end = true;
      this.winner = this.dealer.points == 21? "draw": "player";
    }
    else if(this.dealer.points == 21){
      this.end = true;
      this.winner = "dealer";
    }
  }
  end_show(){
    return "----GAME END----" +
      "\nWINNER:" + this.winner +
      "\nあなたの手札:"+this.player.show_trumps(this.slack) +
      "\nあなたの得点：" + this.player.points +
      "\nディーラの手札:"+this.dealer.show_trumps(this.slack) +
      "\nディーラの得点：" + this.dealer.points;
  }
  show_status(){
    return "あなたの手札：" + this.player.show_trumps(this.slack)
      + "\nあなたの得点：" + this.player.points
      + "\nディーラの手札：" + this.dealer.show_one_trump(this.slack);
  }
  hit_player(hit){
    if(hit){
      this.player.pull(this.trumps);
      if(this.player.points > 21){
        this.end = true;
        this.winner = "dealer";
      }
    }
    else{
      this.player.turn_end = true;
      this.dealer_turn();
    }
  }
  dealer_turn(){
    while(this.dealer.points < 18){
      this.dealer.pull(this.trumps);
    }
    this.end = true;
    if(this.dealer.points > 21 || this.dealer.points < this.player.points){
      this.winner = "player";
    }
    else if(this.player.points < this.dealer.points){
      this.winner = "dealer";
    }
    else{
      this.winner = "draw";
    }
  }
}
