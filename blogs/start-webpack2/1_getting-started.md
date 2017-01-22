---
title: まずは、使ってみましょう
---

## 準備

まずは、適当に作業ディレクトリを作ります。

```bash
mkdir test && cd $_
```

次にWebpackをインストールします。

```bash
npm init -y && npm i -D webpack@beta
```

<say>
`-y`は全部デフォルト設定でいいですよと伝えるフラグです。

ここでは`webpack@beta`としていますが、これはまだ2017年1月現在、Webpack2が正式リリースされていない為です。今後正式リリースされて`webpack`だけで良くなるかもしれないので注意してください。（その時まだ修正されていなかったら[issue](https://github.com/nju33/javascript.nju33.work/issues)やプルリクなんかで教えてくださいmm）
</say>

## webpack.config.jsを作る

`webpack.config.js`という設定ファイルをプロジェクトルートに作ります。以下はインプットとアウトプットの設定を書いた、最小のものですがこれだけでも動作させる事ができます。

```js
module.exports = {
  // 基準となるファイル
  entry: './app/index.js',

  // アウトプット用のPath
  output: {
    filename: 'bundle.js',
    // ディレクトリへの絶対Path
    path: '${__dirname}/dist'
  }
};
```

## 適当にJavascriptファイルを用意

いくつか実際に`.js`ファイルも作ってみましょう。1つ目は上記の設定の`entry`になっている`app/index.js`ファイル、2つ目に、それから読み込む`app/log.js`を作ります。

### `app/log.js`

まずは`log.js`から。確認だけなので、コンソールにログを出すだけの関数を`module.exports`します。

```js
module.exports = text => console.log(text);
```

### `app/index.js`

次に、`index.js`から`log.js`を読み込んで上記の関数を実行するような処理を書いてみます。

```js
const log = require('./log');

log('Hello Webpack!');
```

## Webpackコマンドでビルドする

さて、準備はできたので後はビルドして1つのファイルにするのみです。

```bash
webpack
```

`dist`ディレクトリに`budnle.js`というファイルができていればちゃんと出来ています！

## ブラウザで確認する

HTMLをアウトプットディレクトリに作成してもいいんですが、ここでは[jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)というプラグインを使ってHTMLを作成したいと思います。

<say>
プラグインで作成すればそのまま`.gitignore`にアウトプットディレクトリを書けばいいだけなので。。
</say>

```bash
npm i -D html-webpack-plugin
```

インストールが済んだら、`webpack.config.js`にその設定を追加します。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: '${__dirname}/dist'
  },
  plugins: [new HtmlWebpackPlugin()]
};
```

編集が終わったら再度ビルドします。

```bash
webpack
```

`dist`ディレクトリに今度は`index.html`があれば大丈夫。ブラウザで`index.html`を開いて開発ツールのコンソールに`Hello Webpack!`と表示されたか確認してください。

<!-- break -->

## `html-webpack-plugin`

上記で使ったこのプラグインですが、いくつかオプションがあるので見ていきます。

<say>
オプションのことは[ココ](https://github.com/jantimon/html-webpack-plugin#configuration)に書かれているので各自で参照してください。
</say>

### `title`

HTMLファイルのタイトルを指定できます。

### `filename`

ファイル名の指定です。デフォルトで`index.html`なので、そのままで大丈夫だと思います。

### `template`

HTML以外を読めるようです。未確認。([the-template-option](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md#the-template-option))

### `inject`

`<script/>`タグの埋め込み場所を指定。デフォルトだと`<body/>`の最後ですが、`head`と指定すると`<head/>`の最後に埋め込まれます。

### `favicon`

faviconファイルのPathを指定。未確認。

### `minify`

HTMLファイルをMinifyするかどうか。未確認。Minifyには[html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)が使われている模様。

### `hash`

`.css`ファイルや`.js`ファイルの最後にハッシュを付けてブラウザに前回のファイルのキャッシュが残っていても内容が更新されるように。

### `cache`

変更された場合にのみファイルを更新？

### `showErrors`

デフォルトだとエラーが起きた時に、エラー内容がHTMLに書かれるようになる。`false`で無くせる。

### `chunks`

良くわからない。。。

### `chunksSortMode`

良くわからない。。。

### `excludeChunks`

Chunkファイルをスキップできるそうですが、未確認なので良くわからない。。

### `xhtml`

良くわからない。。

<disqus name="javascript.nju33.work" uuid=246ee840-e710-11e6-ac6c-6bda9c6ceda3>
