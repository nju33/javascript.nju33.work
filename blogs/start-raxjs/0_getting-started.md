---
title: Getting started
---

## 環境構築

まず環境を整えます、`rax-cli`はYeomanみたいなすぐ使えるように環境を構築するコマンドを追加するパッケージです。まずはこれをグローバルにインストールします。

```bash
npm i -g rax-cli
```

で次に、以下のような`rax init`を実行します。

<say>
  色々とパッケージのインストールをするので、ネットワーク環境が悪いと時間が掛かったりするかも。。
</say>

```bash
$ rax init <project-name>
# > Creating a new Rax project in /path/to/<project-name>
# > Install dependencies:
# > ...
# > ✨  Done in 14.76s.
# > To run your app:
# >   cd sample
# >   yarnpkg run start
```

`Done`と表示されれば、インストールと環境構築は完了です！楽ちん！
