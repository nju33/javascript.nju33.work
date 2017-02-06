---
title: Getting started
---

何にせよはずは環境を整える所から初めましょうか。

`npm`コマンドで`vue-cli`をグローバルにインストールします。これで`vue`コマンドが使えるようになります。

```bash
$ npm i -g vue-cli
```

`nuxtjs`なプロジェクトを作るには、以下のような`vue init nuxt/starter <project name>`コマンドを実行するだけです。
色々聞かれますが、全部Enterを押してれば大丈夫だと思います。
最後に出てきた`To get started`に書かれてることをそのまま実行します。

```bash
$ vue init nuxt/starter try-nuxt

# ? Project name try-nuxt
# ? Project description Nuxt.js project
# ? Author nju33 <nju33.ki@gmail.com>
#
#    vue-cli · Generated "try-nuxt".
#
#    To get started:
#
#      cd try-nuxt
#      npm install # Or yarn
#      npm run dev
```

これでだけでNuxtJSなプロジェクト環境ができました。

`npm run dev`とするとlocalhost:3000でサーバーが立ち上がります。アクセスしてこんな画面になったら準備完了です。

![After run dev](/getting-started/images/getting-started/after-run-dev.png)

ちなみにポートを変えたい場合は`dev`スクリプトで`PORT`環境変数に違う数値を設定するように変更します。

```json
{
  "scripts": {
    "dev": "PORT=3333 nuxt"
  }
}
```
