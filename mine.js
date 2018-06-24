module.exports = class Minesweepe{
  constructor(){
    this.mojiNum = {
      0: ":zero:",
      1: ":one:",
      2: ":two:",
      3: ":three:",
      4: ":four:",
      5: ":five:",
      6: ":six:",
      7: ":seven:",
      8: ":eight:",
      9: ":nine:",
      "*": ":boom:",
      "b": ":bomb:",
      "?": ":question:"
    };
    this.boardSize = 10;
    this.board = [];
    this.openBoard = [];
    this.roundBombNum = [];
    this.playing = false;
    for(let i=0; i<this.boardSize; i++){
      this.board[i] = [];
      this.openBoard[i] = [];
      this.roundBombNum[i] = [];
      for(let j=0; j<this.boardSize; j++){
        this.board[i][j] = false;
        this.openBoard[i][j] = false;
        this.roundBombNum[i][j] = 0;
      }
    }
  }
  // 初期化
  start_game(bomb_num){
    this.bomb_num = bomb_num;
    // 盤面を開けた数
    this.open_num = 0;
    if(bomb_num >= Math.pow(this.boardSize, 2) ){
      return "盤面の数より爆弾の数が多いです。";
    }
    if(typeof this.bomb_num === "undefined" || this.bomb_num < 5 || this.bomb_num > 70){
      return "爆弾の数は5-70の間で入力してください";
    }
    // 全部不可視状態にする
    for(let i=0; i<this.boardSize; i++){
      for(let j=0; j<this.boardSize; j++){
        this.openBoard[i][j] = false;
        this.board[i][j] = false;
      }
    }

    // 爆弾セット
    for(let i=0; i<this.bomb_num; i++){
      let x,y;
      do{
        x = Math.floor( Math.random() * this.boardSize );
        y = Math.floor( Math.random() * this.boardSize );
      }while(this.board[x][y]);
      this.board[x][y] = true;
    }

    // 周辺状態設定
    // 周辺状況作成
    for(let i=0; i<this.boardSize; i++){
      for(let j=0; j<this.boardSize; j++){
        if(this.board[i][j]){
          this.roundBombNum[i][j] = "*";
        }
        else{
          let NNum = 0;
          for(let lx = -1;lx<=1;lx++){
            for(let ly = -1;ly<=1;ly++){
              let nx = i + lx;
              let ny = j + ly;
              if(nx >= 0 && nx < this.boardSize &&
                ny >= 0 && ny < this.boardSize){
                if(this.board[nx][ny]){
                  NNum++;
                }
              }
            }
          }
          this.roundBombNum[i][j] = NNum;
        }
      }
    }
    this.playing = true;

    return "ゲームをセットしました！";
  }
  // 盤面を開けていく
  open_board(y, x){
    x = Number(x);
    y = Number(y);

    if(!this.playing){
      return "ゲームのプレイ中ではありません！start_game()で初期化をしてください！";
    }
    if(x >= 0 && (x < this.boardSize) &&
        y >= 0 && (y < this.boardSize) ){
          if(this.board[x][y]){
            this.playing　= false;
            this.openBoard[x][y] = true;
            return "あっ！爆弾ふんじゃいました！ゲームオーバーです！";
          }
          else if(this.openBoard[x][y]){
            return "すでにそのマスは開いています。";
          }
          else{
            this.open_num++;
            this.round_open(x, y);
            let nokori = Math.pow(this.boardSize, 2) - (this.open_num + this.bomb_num);
            if(nokori <= 0){
              this.playing　= false;
              return "おめでとうございます！爆弾の除去に成功しました！\nゲームクリアです！";
            }
            else{
              let out_str = "爆弾:" + this.bomb_num + "個\n" +
                "残り" + nokori + "マスです！";
              return out_str;
            }
          }
    }
    else{
      return "正常な値を入れてください";
    }
  }

  // 爆弾一覧デバッグ出力
  debug_show_board(num){
    let show_board;
    switch (num) {
      case 0:
        show_board = this.board;
        break;
      case 1:
        show_board = this.openBoard;
        break;
      case 2:
        show_board = this.roundBombNum;
        break;
      default:
        return null;
    }
    let out_str = "";
    for(let i = 0;i < this.board.length;i++){
      for(let j = 0;j < this.board[i].length;j++){
        let out_one;
        switch (num) {
          case 0:
            out_one = this.board[i][j]?"1":"0";
            out_str += "|" + out_one;
            break;
          case 1:
            out_one = this.openBoard[i][j]?"1":"0";
            out_str += "|" + out_one;
            break;
          case 2:
            out_str += "|" + this.roundBombNum[i][j];
            break;
          default:

        }
      }
      out_str += "\n";
    }
    return out_str;
  }
  // 周辺のマスをオープンさせる
  round_open(x, y){
    this.openBoard[x][y] = true;
    this.open_num++;
    if(this.roundBombNum[x][y] === 0){
      // 周囲1マスをオープンさせる。
      for(let i=-1; i<2; i++){
        for(let j=-1; j<2; j++){
          if(i === 0 && j === 0){
            continue;
          }
          if( typeof this.openBoard[x+i] !== "undefined" &&
            typeof this.openBoard[x+i][y+j] !== "undefined" &&
            !this.openBoard[x+i][y+j]){
            this.round_open(x+i,y+j);
          }
        }
      }
    }
  }
  // 開閉状態を加味した盤面の表示
  show_board(){
    let out_str = "";
    out_str += "|M";
    for(let i = 0;i < this.board.length;i++){
      out_str += "|" + i;
    }
    out_str += "\n";
    for(let i = 0;i < this.board.length;i++){
      out_str += "|" + i;
      for(let j = 0;j < this.board[i].length;j++){
        if(this.openBoard[i][j]){
          out_str += "|" + this.roundBombNum[i][j];
        }
        else{
          out_str += "|?";
        }
      }
      out_str += "\n";
    }
    return out_str;
  }
  // 開閉状態を加味した盤面の表示(discord)
  show_board_discord(){
    let out_str = this.mojiNum["b"];
    for(let i = 0;i < this.board.length;i++){
      out_str += this.mojiNum[i];
    }
    out_str += "\n";
    for(let i = 0;i < this.board.length;i++){
      out_str += this.mojiNum[i];
      for(let j = 0;j < this.board[i].length;j++){
        if(this.openBoard[i][j]){
          out_str += this.mojiNum[ this.roundBombNum[i][j] ];
        }
        else{
          out_str += this.mojiNum["?"];
        }
      }
      out_str += "\n";
    }
    return out_str;
  }
}
