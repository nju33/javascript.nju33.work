---
title: NuxtJSで生成されたファイルを眺める
---

## NuxtJSのディレクトリ構造

表示はできたけど、中の構造がどうなってるのかさっぱり分からないので、見てみたいと思います。とりあえずファイル構造はこうなってますね。

```bash
.
├── README.md
├── .nuxt
│   ├── App.vue
│   ├── client.js
│   ├── components
│   │   ├── nuxt-child.js
│   │   ├── nuxt-error.vue
│   │   ├── nuxt-link.js
│   │   ├── nuxt-loading.vue
│   │   └── nuxt.vue
│   ├── index.js
│   ├── router.js
│   ├── server.js
│   └── utils.js
├── assets
│   ├── css
│   │   └── main.css
│   └── img
│       └── logo.png
├── components
│   └── Footer.vue
├── dist # Generateした本番用ファイル
├── layouts
│   ├── default.vue
│   └── error.vue
├── node_modules # 略
├── nuxt.config.js
├── package.json
├── pages
│   ├── about.vue
│   └── index.vue
├── static
│   └── favicon.ico
├── plugins # デフォルトでは無い(vue用のプラグインを使う)
├── store # デフォルトでは無い(vuexを使う)
└── yarn.lock # yarn の時だけ
```

<say>
Atomエディタを使ってる方は事前に`apm install language-vue`してコードがハイライトされるようにすることをオススメします🙂

他のエディタにも多分似たようなのがあるかもしれないので探してみてくださいmm
</say>

NuxtJSでは、「ここにはこんなファイルを置く」というようなルールがあるので、見ていきます。

### Pages

ここへはページとなりうる`.vue`ファイルを起きます。ここに置いたファイルはNuxtJSで自動生成される`.nuxt/components/nuxt-link.js`というコンポーネントを使うことでリンクを貼ることができます。

<say>
`<next-link/>`というのは`<router-link/>`のラッパーなので、分からない所があったら[vue-router#router-link](http://router.vuejs.org/ja/api/router-link.html)を参照してください😀
</say>

```vue
<nuxt-link class="button" to="/about">
  About page
</nuxt-d >
```

<say>
`index.html`や`about.html`みたいに普段HTMLを作る感じで同じイメージでいいと思います。
</say>

### Layouts

`layouts/`へ置きます。初期では`layouts/default.vue`と`layouts/error.vue`があります。

重要なのは`<nuxt/>`というコンポーネントでここに現在のメイン要素の内容が入ります。

新しいLayoutを追加したい時はここに`new.vue`ファイルを作るだけです。（`new`はただの例で名前はなんでもいい）そのLayoutを使いたい時は、Pageの Export Object のLayoutキーに`new`（ファイル名）と設定します。

<say>
`error.vue`の方は正確にはLayoutsではなく`page`に近いもので、`404`などのエラーが出た場合は`error.vue`の内容が`<nuxt/>`に入ります。
</say>

### Assets

ここに置いたファイルは読み込む前にWebpackのLoaderの処理を適用することができます。

ちなみにLoaderで処理させるようにするためには、例えば`pages/index.vue`に含まれるような以下の部分

```html
<img src="../assets/img/logo.png"/>
```

は、`~`を使ってこんな感じにする必要があります。

```html
<img src="~assets/img/logo.png"/>
```

以下の設定はデフォルトの設定らしいです。

```js
[
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: 'url-loader',
    query: {
      limit: 1000, // 1KO
      name: 'img/[name].[hash:7].[ext]'
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 1000, // 1 KO
      name: 'fonts/[name].[hash:7].[ext]'
    }
  }
]
```

もし新しいLoaderを使いたいなどWebpackの設定を拡張したい場合は、`nuxt.config.js`の`build.extend(config, {isDev, isClient})`メソッドで行えます。例えば`.less`を使いたい場合はこんな感じです。

```js
build: {
  extend(config, {isDev, isClient}) {
    config.module.rules.push({
      test: /\.less$/,
      loader: 'less-loader'
    });
  }
}
```

### Static

こっちはAssetsとほぼ一緒で、単にWebpackの処理をしないような静的ファイルを置きます。

## Store

これは多分、複数のページに渡って状態を保持したい場合なんかに使うんじゃないかと思います。

<say>
あとで訂正するかも🤔
</say>

この機能を使うには、[vuex](https://vuex.vuejs.org/ja/)を追加でインストールする必要があります。

```bash
npm i -S vuex
yarn add vuex
```

NuxtJSは`store/index.js`ファイルがあるとこれを実行してくれるので、このファイルで`Vuex.Store`のインスタンスを`export`するようにします。

```js
import Vuex from 'vuex';
export default new Vuex.Store({...});
```

`export`した`store`は、`.vue`ファイルのTemplateの中で`$store`という変数でアクセスできます。

```html
<template>
  <button @click="$store.commit('increment')">{{$store.state.counter}}</button>
</template>
```

それぞれの値を分割`export`してNuxtJSにStoreを組み上げてもらう方法もあります。これは[ココ](https://nuxtjs.org/guide/vuex-store#modules-mode)を参照すると分かりやすいと思います。

### Plugins

事前に使いたいVuePluginをインストールしておきます。（ここでは仮に`vue-plugin`とします）`plugins/vue-plugin.js`を作って以下のようにします。

クライアントサイドだけで有効にしたい場合は、`process.BROWSER_BUILD`。サーバーサイドだけなら`process.SERVER_BUILD`というフラグを使って有効なプラグインを変えることができます。。

```js
import Vue from 'vue';
import VuePlugin from 'vue-plugin';

if (process.BROWSER_BUILD) {
  Vue.use(VuePlugin);
}
```

そして、`nuxt.config.js`でそのプラグインを設定します。`build.vender`はパフォーマンスを上げるために指定します。

```js
build: {vendor: ['vue-plugin']},
plugins: ['~plugins/vue-plugin']
```

### Middleware

良くわからないので誰か教えてください。

### ルーティングについて

「このPathnameなURLの時は、この`.vue`ファイルで」みたいなことが`nuxt.config.js`の`router.routes`で設定できます。これは、[VueRouter](http://router.vuejs.org/ja/)の設定と全く同じです。

```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'pages/user/index.vue'
    }
  ]
}
```

動的にルーティングしたい場合は、動的に変わる部分のディレクトリ名やファイル名に`_`をプレフィックスします。

```js
router: {
  routes: [
    // ...
    {
      name: 'users-id',
      path: '/users/:id?',
      component: 'pages/users/_id.vue'
    },
    {
      name: 'slug',
      path: '/:slug',
      component: 'pages/_slug/index.vue'
    },
    {
      name: 'slug-comments',
      path: '/:slug/comments',
      component: 'pages/_slug/comments.vue'
    }
  ]
}
```

基準パスを設定するには親Routeに`children`を設定します。上記の`users-id`なRouteはこう書くこともできます。一つ重要な点は、`children`を持つような`component`はマークアップに`<nuxt-child/>`を書くということを忘れないようにする必要があります。

もし動的なパスの中にもIgnoreパターンを設定したい場合は、その`.vue`の Export Object の中に`validate`というメソッドを定義して弾くことができます。

```js
validate() {
  export default {
    validate ({params}) {
      // Must be a number
      return /^\d+$/.test(params.id)
    }
  }  
}
```

上記では、`params.id`がNumberの時は正常に表示されますが、違う場合は`error.vue`が表示されます。

```js
router: {
  routes: [
    {
      path: '/users',
      component: 'pages/users.vue',
      children: [
        {
          path: '', // /users
          component: 'pages/users/index.vue',
          name: 'users'
        },
        {
          path: ':id', // /users/:id
          component: 'pages/users/_id.vue',
          name: 'users-id'
        }
      ]
    }
  ]
}
```

親が動的な場合にも対応できます。

```js
router: {
  routes: [
    {
      path: '/:slug',
      component: 'pages/_slug.vue',
      children: [
        {
          path: ':childSlug', // /:slug/:childSlug
          component: 'pages/_slug/_childSlug.vue',
          chilren: [
            {
              path: '',
              component: 'page/_slug/_childSlug/index.vue'
              name: 'something'
            }
          ]
        }
      ]
    }
  ]
}
```

## 好きなパッケージを使う

基本的にただ`<script/>`の中で`import`したりして自由に使えるみたいです。ただし、パフォーマンスを上げるために`nuxt.config.js`の`build/vender`に使ったパッケージ名を書いた方が良さげです。

```js
module.exports = {
  build: {
    vendor: ['axios']
  }
}
```
