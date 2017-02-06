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
├── plugins # デフォルトでは無い
├── store # デフォルトでは無い
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

基準パスを設定するには親Routeに`children`を設定します。上記の`users-id`なRouteはこう書くこともできます。

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

```js
router: {
  routes: [
    {
      path: '/:slug',
      component: 'pages/_slug.vue',
      children: [
        {
          path: '',
          component: 'pages/_slug/index.vue',
          name: 'category'
        }
      ]
    }
  ]
}
```
