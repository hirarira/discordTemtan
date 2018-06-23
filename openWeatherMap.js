module.exports = class openWeatherMap{
	constructor(token){
		this.token = token;
		// 天気情報の日本語
		// TODO 翻訳をマシにする
		// https://openweathermap.org/weather-conditions
		this.weatherDisc = {
			200: "雨が降る軽い雷雨",
			201: "雨が降る雷雨",
			202: "豪雨による雷雨",
			210: "雷雨",
			211: "雷雨",
			212: "重い雷雨",
			221: "荒れた雷雨",
			230: "軽い霧雨で雷雨",
			231: "雷雨と霧雨",
			232: "重い霧雨で雷雨",
			300: "霧雨と雷",
			301: "霧雨",
			302: "重度の霧雨",
			310: "強烈な霧雨と雷",
			311: "霧雨",
			312: "強い霧雨",
			313: "シャワーの雨と霧雨",
			314: "重いシャワーの雨と霧雨",
			321: "シャワーの霧雨",
			500: "小雨",
			501: "中程度の雨",
			502: "強い雨",
			503: "非常に豪雨",
			504: "極端な雨",
			511: "凍る雨",
			520: "雷とシャワーの雨",
			521: "シャワーの雨",
			522: "激しいシャワーの雨",
			531: "荒れたシャワーの飴",
			600: "小雪",
			601: "雪",
			602: "大雪",
			611: "みぞれ",
			612: "シャワーのみぞれ",
			615: "明るい雨と雪",
			616: "雨と雪",
			620: "稲妻とシャワーの雪",
			621: "雪のシャワー",
			622: "大雪のシャワー",
			701: "霧",
			711: "スモッグ",
			721: "もや",
			731: "塵旋風",
			741: "霧",
			751: "サンド",
			761: "ダスト",
			762: "火山灰",
			771: "スコール",
			781: "竜巻",
			800: "晴天",
			801: "雲が少ない",
			802: "散った雲",
			803: "壊れた雲",
			804: "曇った雲"
		}
		this.sunrise = null;
		this.sunset = null;
	}
	// PromiseでHTTPリクエストを実施する。
	getRequest(getURL){
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

	// Open Weather API より天気情報を取得
	getWeather(city_name, city_jpn_name){
		this.city_jpn_name = city_jpn_name;
		return new Promise((resolve, reject)=>{
			const host = "http://api.openweathermap.org/data/2.5/weather";
			let url = host + "?q=" + city_name + "&units=metric" + "&APPID=" + this.token;
			this.getRequest(url)
			.then((res)=>{
				this.weatherData = JSON.parse(res);
				this.sunrise = new Date( this.weatherData.sys.sunrise * 1000 );
				this.sunset = new Date( this.weatherData.sys.sunset * 1000 );
				resolve(this.weatherData);
			})
			.catch((e)=>{
				reject(e);
			});
		});
	}

	// 天気情報を見やすい日本語形式で返す
	getWeatherJapanese(){
		if(typeof this.weatherData === 'undefined'){
			return null;
		}
		let weatherJPN = "今日の" + this.city_jpn_name + "の天気は";
		for(let i=0;i<this.weatherData.weather.length;i++){
			weatherJPN += this.weatherDisc[ this.weatherData.weather[i].id ];
			if(i < this.weatherData.weather.length - 1){
				weatherJPN += " かつ ";
			}
		}
		weatherJPN += " です。\n";
		weatherJPN += "現在の気温は" + this.weatherData.main.temp + "℃で、" +
		"湿度は" + this.weatherData.main.humidity + "%です。\n" +
		"日の出は" + this.sunrise.getHours() + "時" + this.sunrise.getMinutes() + "分 " +
		"日の入りは" + this.sunset.getHours() + "時" + this.sunset.getMinutes() + "分です。";
		return weatherJPN;
	}
}
