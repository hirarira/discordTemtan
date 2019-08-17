# discordTemtan
Discord版のテムたんbot

## 起動方法（Docker版）
* `./dockerfiles/node.env` に環境変数を記載 ( node.env.example を参考)
* `docker-compose up -d`

## 起動方法（通常版）
* `npm install`  
* `TEMTAN_TOKEN=(トークン) OPEN_WEATHER_MAP=(トークン) node temtan.js`
