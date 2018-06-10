"use strict"
const Discord = require('discord.js');
const client = new Discord.Client();

// tokenを環境変数から取得
const token = process.env.TEMTAN_TOKEN;

let count = 0;

// 環境変数が取得できるかの判定
if(typeof token === 'undefined'){
	return
}

// 待受画面
client.on('ready', ()=>{
	console.log("ログインしました。");
});

// メッセージ応対
client.on('message', (message)=>{
	let user_name = message.author.username;
	if(message.content === "こんにちは"){
		let rep_mes = "こんにちは！"+user_name+"さん！";
		message.reply(rep_mes)
		.then((rep_res)=>{
			console.log("リプを送りました："+rep_mes);
		})
		.catch((e)=>{
			console.log(e);
		});
	}
	else if(message.content === "count"){
		count++;
		let rep_mes = "Count:"+count;
		message.reply(rep_mes)
		.then((rep_res)=>{
			console.log("リプを送りました："+rep_mes);
		})
		.catch((e)=>{
			console.log(e);
		});
	}
	

});


// Discordへの接続
client.login(token);
