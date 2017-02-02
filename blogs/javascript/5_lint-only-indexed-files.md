---
title: 【lint-staged】GitでIndexに登録したファイルだけLintチェックを行う
---

## lint-stagedとは

リポジトリは[okonet/lint-staged](https://github.com/okonet/lint-staged)です。Indexへ登録したファイル（Commitして取り込む前の状態）のファイルだけにLintタスクを実行することができます。

<!-- break -->

## 設定ファイルを書く

設定ファイルを書くことで、「`*.css`にはCSSのLint`*.js`へはJSのLintを実行」と設定することができます。書き方は
対象ファイルのワイルドカードのプロパティに、`npm run-script`のScript名を書くだけです。また、複数のことをやらせたい場合は、値を配列にして羅列することもできます。

## 確認用ファイルを作る

とりあえず今回は、[sindresorhus/xo](https://github.com/sindresorhus/xo)というハピネスなJavascript用Linterを使いたいと思います。

```bash
npm i -D lint-staged xo
```

まず、`package.json`の`scripts`にこのLintを実行するScriptと`lint-staged`を実行するScriptを追加します。

```json
"scripts": {
  "lint:js": "xo",
  "lint-staged": "lint-staged"
}
```

これで、`npm run lint:js`でLintを実行できるようになりました。次に`.lintstagedrc`を編集します。

```json
{
  "*.js": "lint:js"
}
```

そして、あえてLintに引っかかるファイルを作成します。ファイル名はなんでも良いので、ここでは`incorrect.js`とします。

```js
const foo = 'foo';
```

上記のJavaScriptは「`foo`を定義してるけど使ってないぜ（no-unused-vars）😎」と警告してくれるはずです。

## lint-stagedる

ではさっそく実行してみます。

```bash
npm run lint-staged
# > @ lint-staged /Users/nju33/test/lint-staged
# > lint-staged
```

ですが、これは何も警告されないまま終わってしまいます。上記で述べたようにIndexへ登録する必要がありました。

```bash
git add incorrect.js
```

そして再度 lint-staged してみると、今度はちゃんとLintしてくれました。

```bash
npm run lint-staged
# > @ lint-staged /Users/nju33/test/lint-staged
# > lint-staged
#
# ❯ Running tasks for *.js
#   →   1 error
#   ✖ lint:js
#     →   1 error
#
# 🚫  lint:js found some errors. Please fix them and try committing again.
#
#  incorrect.js
#  ✖  1:7  a is assigned a value but never used.  no-unused-vars
#
#  1 error
```

## Commitする時にLintに引っかかるようだったらCommitをキャンセルする

まず、[typicode/husky](https://github.com/typicode/husky)をインストールします。これはGitコマンドのHookを`run-script`に設定できるようにするパッケージです。[Hookできるコマンド一覧](https://github.com/typicode/husky/blob/master/HOOKS.md#hooks)を参考にしてください。

```bash
npm i -D husky
```

`package.json`の`script`へ`precommit`Scriptを追加します。

```json
"scripts": {
  "precommit": "npm run lint-staged",
  "lint:js": "xo",
  "lint-staged": "lint-staged"
}
```

そして、Commitしてみると、「precommitが`failed`したぜ😎」と言われました。`git status`で確認したもまだ残ってることも確認できます。

```bash
git commit -m 💮
# > husky - npm run -s precommit
#
# ❯ Running tasks for *.js
#   →   1 error
#　...
#
# > husky - pre-commit hook failed (add --no-verify to bypass)
git status -s
# A  incorrect.js
```

## `incorrect.js`を修正して再Commit

Commitしたいので`incorrect.js`をLintに引っかからないようにします。

```js
const foo = 'foo';
console.log(foo);
```

そして`git add`して再度`git commit`します。

```bash
git ccommit -m 💮
# > husky - npm run -s precommit
#
# ✔ Running tasks for *.js
# [master (root-commit) 426f40b] 💮
```

今度は通りました。

<say>
やったぜ🎉🎉🎉
</say>

ちなみに、この今回の例は、[javascript-nju33-work-examples/lint-only-indexed-files](https://github.com/javascript-nju33-work-examples/lint-only-indexed-files)に置いてます。
