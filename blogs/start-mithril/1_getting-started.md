---
title: Mithrilを使い始める
---

MithrilJSはCDNで読み込んでもいいですが、どうせ`jsx`の環境を整えたくなったり、npmライブラリを使いたくなった時のことを考えてWebpackでビルドして使いたいと思います。

## 依存パッケージのインストール

以下のコマンドでMithrilJSとWebpackをインストールします。

```bash
npm i -S mithril;
npm i -D webpack \
         webpack-dev-server
         html-webpack-plugin \
         babel-core \
         babel-loader \
         babel-preset-env \
         babel-plugin-transform-runtime \
         babel-plugin-transform-react-jsx
```

これを書いている段階では環境はこんな感じです。

```bash
npm list --depth 0
# ├── babel-core@6.22.1
# ├── babel-loader@6.2.10
# ├── babel-plugin-transform-react-jsx@6.22.0
# ├── babel-plugin-transform-runtime@6.22.0
# ├── babel-preset-env@1.1.8
# ├── babel-runtime@6.22.0
# ├── html-webpack-plugin@2.28.0
# ├── mithril@1.0.0
# ├── node-pre-gyp@0.6.33 extraneous
# ├── webpack@2.2.1
# └── webpack-dev-server@2.3.0
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
            'transform-runtime',
            ['transform-react-jsx', {pragma: 'm'}]
          ]
        }
      }
    ]
  }
}
```

ちなみに、`transform-react-jsx`のpragmaっていうのは、そういう「名前のメソッドで[hyperscript](https://www.npmjs.com/package/hyperscript)の形へ変換します」という意味です。これは本来`react-jsx`と名前にある通り、デフォルトでは`pragma`は`React.createElement`になっているのでこれを変える必要があります。

そしたら、ビルドコマンドを`npm run-script`へ登録します。`package.json`の`scripts`を以下のように書きます。

```json
"scripts": {
  "start": "webpack-dev-server"
}
```

WebpackDevServerで、Webpackのコンパイルとサーバー起動を両方をやってくれます。
これで環境の準備はできました。

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

`mount`メソッドは、１つ目にElement、２つ目に`view`メソッドを持つ`object`を期待します。以下のコマンドを叩いてビルドとサーバーを起動します。

<say>
JSXの変換で`m`メソッドは使っているのでちゃんと`import`するように注意です！
</say>

```bash
npm start
```

コマンドが終了して、'dist/'以下がこんな感じの構造になっていたら大丈夫です。

```bash
./dist
├── bundle.js
└── index.html
```

その後ブラウザで「Hello Mithril!」と表示されたら完璧です💮(`webpack-dev-server`はデフォルトで`localhost:8080`で起動されます)
