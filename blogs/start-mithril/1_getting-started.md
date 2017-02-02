---
title: Mithrilを使い始める
---

MithrilJSはCDNで読み込んでもいいですが、どうせ`jsx`の環境を整えたくなったり、npmライブラリを使いたくなった時のことを考えてWebpackでビルドして使いたいと思います。

## 依存パッケージのインストール

以下のコマンドでMithrilJSとWebpackをインストールします。

```bash
npm i -S mithril;
npm i -D webpack \
         html-webpack-plugin \
         babel-loader \
         babel-preset-env \
         babel-plugin-transform-react-jsx
```

これを書いている段階では環境はこんな感じです。

```bash
npm list --depth 0
# ├── UNMET PEER DEPENDENCY babel-core@^6.0.0
# ├── babel-loader@6.2.10
# ├── babel-plugin-transform-react-jsx@6.22.0
# ├── babel-preset-env@1.1.8
# ├── html-webpack-plugin@2.28.0
# ├── mithril@1.0.0
# └── webpack@2.2.1
```

## Webpackの設定

ここではBabelの`babel-plugin-transform-react-jsx`を使ってJSX記法を使える設定まで行います。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['env'],
          plugins: [
            ['transform-react-jsx', {pragma: 'm'}]
          ]
        }
      }
    ]
  }
}
```

そして、ビルドコマンドを`npm run-script`へ登録します。`package.json`の`scripts`を以下のように書きます。

```json
"scripts": {
  "start": "webpack --watch"
}
```

これでWebpack準備はできました。

## 「Hello Mithril」と表示する

エントリーポイントとなる`./src/index.js`ファイルを編集して以下のようにします。

```js
import m, {mount} from 'mithril';

class HelloMithril {
  view() {
    return <h1>Hello Mithril !</h1>
  }
}

mount(document.body, new HelloMithril());
```

`mount`メソッドは、１つ目にElement、２つ目に`view`メソッドを持つ`object`を期待します。以下のコマンドを叩いてビルドします。

```bash
npm start
```

コマンドが終了して、'dist/'以下がこんな感じの構造になっていたら大丈夫です。

```bash
./dist
├── bundle.js
└── index.html
```

サーバーを立てるコマンドはなんでも良いのですが、ここでは[zeit/serve](https://github.com/zeit/serve)を使います。`serve`を使ってみたい人は以下を叩いてインストールできます。

```js
npm i -g serve
```

終わったら`./dist`ディレクトリでサーバーを起動しましょう。その後ブラウザで「Hello Mithril!」と表示されたら完璧です💮

<say>
`serve`ならデフォルトで`localhost:3000`で起動して、URLがクリップボードにコピーされるのでOmniboxにペーストするだけです！
</say>
