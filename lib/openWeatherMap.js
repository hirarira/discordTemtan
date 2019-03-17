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
    this.jpCityList = {
      "東京": 1850147,
      "大阪": 1853909,
      "横浜": 1848354,
      "名古屋": 1856057,
      "札幌": 2128295,
      "福岡": 1863967,
      "京都": 1857910,
      "さいたま": 6940394,
      "広島": 1862415,
      "仙台": 2111149,
      "堺": 1853195,
      "新潟": 1855431,
      "浜松": 1863289,
      "熊本": 1858421,
      "岡山": 1854383,
      "静岡": 1851717,
      "熊本": 1858421,
      "函館": 2130188,
      "旭川": 2130629,
      "青森": 2130658,
      "八戸": 2130204,
      "盛岡": 2111834,
      "秋田": 2113126,
      "福島": 2112923,
      "いわき": 2112539,
      "宇都宮": 1849053,
      "前橋": 1857843,
      "高崎": 1851002,
      "川越": 1859740,
      "川口": 1859730,
      "所沢": 1850181
    }
    this.cityWeather = [];
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
  getWeather(city_name){
    return new Promise((resolve, reject)=>{
      this.cityWeather[city_name] = {};
      this.cityWeather[city_name].city_name = city_name;
      const host = "http://api.openweathermap.org/data/2.5/weather";
      let url = "";
      this.cityWeather[city_name].city_code = this.jpCityList[city_name];
      if(typeof this.cityWeather[city_name].city_code === "undefined"){
        url = host + "?q=" + city_name + ",jp&units=metric" + "&APPID=" + this.token;
      }
      else{
        url = host + "?id=" + this.cityWeather[city_name].city_code + "&units=metric" + "&APPID=" + this.token;
      }
      this.getRequest(url)
      .then((res)=>{
        this.cityWeather[city_name].weatherData = JSON.parse(res);
        this.cityWeather[city_name].sunrise = new Date( this.cityWeather[city_name].weatherData.sys.sunrise * 1000 );
        this.cityWeather[city_name].sunset = new Date( this.cityWeather[city_name].weatherData.sys.sunset * 1000 );
        resolve(city_name);
      })
      .catch((e)=>{
        reject( JSON.parse(e) );
      });
    });
  }

  // 天気情報を見やすい日本語形式で返す
  getWeatherJapanese(city_name){
    let nowCity = this.cityWeather[city_name];
    if(typeof nowCity === 'undefined' || typeof nowCity.weatherData === 'undefined'){
      return null;
    }
    let weatherJPN = "今日の" + nowCity.city_name + "の天気は";
    for(let i=0;i<nowCity.weatherData.weather.length;i++){
      weatherJPN += this.weatherDisc[ nowCity.weatherData.weather[i].id ];
      if(i < nowCity.weatherData.weather.length - 1){
        weatherJPN += " かつ ";
      }
    }
    weatherJPN += " です。\n";
    weatherJPN += "現在の気温は" + nowCity.weatherData.main.temp + "℃で、" +
    "湿度は" + nowCity.weatherData.main.humidity + "%です。\n" +
    "日の出は" + nowCity.sunrise.getHours() + "時" + nowCity.sunrise.getMinutes() + "分 " +
    "日の入りは" + nowCity.sunset.getHours() + "時" + nowCity.sunset.getMinutes() + "分です。";
    return weatherJPN;
  }
}
