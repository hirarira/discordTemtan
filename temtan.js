(()=>{
	"use strict"
	const Discord = require('discord.js');
	const OpenWeatherMap = require('./openWeatherMap.js');
	const Mine = require("./mine.js");

	const client = new Discord.Client();

	// tokenを環境変数から取得
	const token = process.env.TEMTAN_TOKEN;

	// openWeatherMap
	const openWeatherMapToken = process.env.OPEN_WEATHER_MAP;
	let openWeatherMap = new OpenWeatherMap(openWeatherMapToken);

	// Minesweepe
	const mine = new Mine();

	// 環境変数が取得できるかの判定
	if(typeof token === 'undefined'){
		console.log("discordのtokenを指定してください");
		return;
	}
	if(typeof openWeatherMapToken === 'undefined'){
		console.log("openWeatherMapのtokenを指定してください");
		return;
	}

	// 雑多なフラグ処理
	let jankenFlag = false;
	let ohanashiFlag = false;
	let isTenkiFlag = false;
	let targetUser = null;

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

	// メッセージ送信関数
	function send_message(message, rep_mes){
		message.reply(rep_mes)
		.then((rep_res)=>{
			console.log("リプを送りました："+rep_mes);
		})
		.catch((e)=>{
			console.log(e);
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
		let user_name = message.author.username;
		if(message.content.match(/こんに?ちは/)){
			let rep_mes = "こんにちは！"+user_name+"おにいちゃん！";
			message.channel.send(rep_mes);
		}
		else if(message.content === "おはなし"){
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
			ohanashiFlag = true;
			targetUser = message.author.id;
			message.channel.send(WordList[rnd]);
		}
		// 相槌を返す
		else if(ohanashiFlag && targetUser === message.author.id){
			let rep_mes = "へぇ〜そうなんだ！";
			ohanashiFlag = false;
			targetUser = null;
			message.channel.send(rep_mes);
		}
		else if(message.content.indexOf("テムたん") > -1 ){
			let rep_mes = "なーに？わたしのこと呼んだー？";
			message.channel.send(rep_mes);
		}
		else if(message.content.indexOf("help") > -1 ){
			let rep_mes = "わたしが反応する言葉を紹介するね！\n"
			+"```・おはなし\n"
			+"お兄ちゃんたちにわたしが色々質問するよ！```\n\n"
			+"```・じゃんけん\n"
			+"そのまんんまだけど、私とじゃんけんをして遊べるよ！```\n\n"
			message.channel.send(rep_mes);
		}
		// じゃんけん開始
		else if(message.content.match(/(じゃんけん)|(ジャンケン)/)){
			let rep_mes = "じゃんけんしよう！じゃじゃじゃじゃーんけーん\n";
			jankenFlag = true;
			targetUser = message.author.id;
			message.channel.send(rep_mes);
		}
		// じゃんけんをする。
		else if(jankenFlag && targetUser === message.author.id){
			const hands = [":fist:",":v:",":hand_splayed:"];
			// フラグ初期化
			jankenFlag = false;
			targetUser = null;
			// 手を決める
			let tem_hand = Math.floor( Math.random() * 3);
			let player_hand = -1;
			if( message.content.match(/ぐー|グー|:punch:|:fist:|rock/)){
				player_hand = 0;
			}
			else if(message.content.match(/ちょき|チョキ|:v:|paper/)){
				player_hand = 1;
			}
			else if(message.content.match(/ぱー|パー|scissors|:hand_splayed:/)){
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
			message.channel.send(rep_mes);
		}
		// 天気
		else if(message.content.indexOf("天気") > -1 ){
			isTenkiFlag = true;
			targetUser = message.author.id;
			message.reply("どこの天気を知りたい？");
		}
		// 天気を返す
		else if(isTenkiFlag && targetUser === message.author.id){
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
			isTenkiFlag = false;
			targetUser = null;
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
