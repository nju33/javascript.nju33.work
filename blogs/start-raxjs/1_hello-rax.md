---
title: Hello Rax
---

## とりあえず、表示させる

次に実際にサーバーを起動して、実際にブラウザでみれるようにします。

前のセクションでインストールをした時に、`Done`の下に続きがあったと思うので、それをそのまま実行します。

<say>
とここで、`yarnpkg`というコマンドを実行しています。
（確認はしてないですが、、）もし「`yarnpkg`なんて知りません」と言われちゃったら、
[yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install)から`yarn`をインストールした後にもう一度実行してみてください。
</say>

```bash
# > ✨  Done in 14.76s.
# > To run your app:
# >   cd <project-name>
# >   yarnpkg run start
```

`run start`すると、サーバーが`http://localhost:8080`で立ち上がるのでブラウザでアクセスすると、こんな感じで表示されました！

![Welcome to Rax](/raxjs/images/hello-rax/welcome-to-rax.png)

ちなみに、プロジェクトのディレクトリ構造はこうなっているようです。

```bash
.
├── node_modules # ...長すぎるので省略
│  
├── package.json
├── public
│   └── index.html
├── src
│   ├── App.css
│   ├── App.js
│   └── index.js
├── webpack.config.js
└── yarn.lock
```

`package.json`も開いてみて、依存パッケージを確認します。

```json
"dependencies": {
  "rax": "^0.1.5",
  "rax-components": "^0.1.5"
},
"devDependencies": {
  "babel-preset-rax": "...",
  "babel-*": "...",
  "*-webpack-plugin": "...",
  "*-loader": "...",
  "webpack": "...",
  "webpack-dev-server": "..."
}

```

主に本番で使うのは、`rax`と`rax-components`というパッケージのようです。
またこの環境では、ざっと`babel`(es6)で書いて`webpack`でBuildするといった感じのプロジェクトができあがったようですね。

あと`babel-preset-rax`って何だろうと思ったので調べると、どうやら`babel-preset-react`に幾つかの便利なPluginを追加したもので、特にRax特有のPluginというのはないようです。

## 「Hello Rax」になるよう書き換える

`src/App.js`を弄くれば良さそうなのでエディタで開きます。さて、色々と`import`してますね。

```js
import {createElement, Component} from 'rax';
import {View, Text} from 'rax-components';
```

名前からですけどなんとなく、`rax`というのはコンポーネントを作るためで、`rax-components`は`rax`公式のコンポーネント群が入ってる感じです。

`rax-components`で何が有るんじゃいと思ったので調べると、[rax-components](https://github.com/alibaba/rax/tree/master/packages/rax-components/src)にあるものが使えるようです。
このコンポーネント群ですが、全てに初期スタイル(`styles.initial`)が適用されるようなので注意が必要かもしれません。

では書き換え作業に入るんですが、実はほぼ出来上がってるものが[公式サイトのExample](http://rax.taobaofed.org/#examples)にあるのでほぼ丸ごと使ってしまいます。

では、`src/App.js`を書き換えてください。

```js
import {createElement, Component} from 'rax';
import {View, Text} from 'rax-components';

class App extends Component {
  render() {
    return <View style={styles.container}>
      <Text>Hello Rax</Text>
    </View>;
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default App;
```

`yarn start`して、[localhost:8080](http://localhost:8080)にアクセスして、画像のようになってればバッチリです！

![Welcome to Rax](/raxjs/images/hello-rax/hello-rax.png)

<say>
というか、`class`より`const`の記述が後でも、`export`を`const`より後にすればちゃんと読み込まれるんですね。。知らなかった。
</say>
