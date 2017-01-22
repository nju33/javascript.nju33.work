---
title: Webpackとは
---

リンクから来た人は繰り返しになる部分があるので、飛ばしてくださいmm

最近、フロントエンドの周りではよく[Webpack](https://github.com/webpack/webpack)について耳にすることが多くなりました。

> webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

Webpackは、モジュールバンドラーと呼ばれるもので、コードを複数のファイルに分割して管理することができます。NodeJSの世界では、`reuqire`や`import`という構文を使って別ファイルの内容を使ったりということは既にできていますが、ブラウザの世界に話を変えると、そのままでは対応はまだまだなのが現実です。ブラウザの世界でもそういった構文を使ってJavascriptなどを書くことができるようにするツールがWebpackです。

<say>
よく似たものに[Browserify](http://browserify.org/)があります。
</say>

ただWebpackには若干ややこしい設定があり、困惑する部分もあります。自分の理解も兼ねて一度まとめてみようと思います。

<say>
ちなみに、ここからはWebpack2についての話になりますので、注意です。  
わからない所があれば、[Document](https://webpack.js.org/)を参照してください。
</sat>
