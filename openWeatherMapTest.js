// OpenWeatherMap class のテスト
const OpenWeatherMap = require('./openWeatherMap.js');

// tokenを環境変数から取得
const token = process.env.OPEN_WEATHER_MAP;

let openWeatherMap = new OpenWeatherMap(token);

// 環境変数が取得できるかの判定
if(typeof token === 'undefined'){
	console.log("環境変数を設定してください");
	return;
}

openWeatherMap.getWeather("東京")
.then((res)=>{
	console.log(openWeatherMap.getWeatherJapanese(res));
	return openWeatherMap.getWeather("kanazawa");
})
.then((res)=>{
	console.log(openWeatherMap.getWeatherJapanese(res));
	return openWeatherMap.getWeather("unko");
})
.then((res)=>{
	console.log(openWeatherMap.getWeatherJapanese(res));
})
.catch((e)=>{
	console.log(e);
});
