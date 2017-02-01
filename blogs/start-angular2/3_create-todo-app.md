---
title: Todoアプリを作ってみよう
---

## Todo Component を作る

ではさっそく、Angular2のコードを書いてみよう。Angular2はコンポーネントベースになりましたので、まずは`ng`コマンドで`<Todo/>`コンポーネントを作ります。以下のコマンドで作れます。

<say>
個人的には、 Reactみたいな感じを想像して開発できるので分かりやすくなった感じがしました😛
</say>

```bash
ng g component todo
```

すると`todo/`というディレクトリができて、その下がこんな感じの構造になったと思います。

```bash
.
├── todo.component.css
├── todo.component.html
├── # todo.component.spec.ts
└── todo.component.ts
```

また`app.module.ts`では、`TodoComponent`というものを読み込むように書き換わっていると思うので確認します。

```ts
import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';

@NgModule({
  declarations: [AppComponent, TodoComponent],
  imports: [BrowserModule, FormsModule, HttpModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

`@NgModule`は、`ng`コマンドで生成するものみたいなものを**ひとまとめ**にする為のものです。`declarations`は、ComponentやDirective、Pipeを。`imports`には、別のModuleを。`providers`には、Serviceを。`bootstrap`はエントリーポイント（ベース）となるComponentを指定します。

## Todo Component を編集する

編集するファイルは、`import`の`from`先を見たら分かるように、`./todo/todo.component.ts`を編集すれば良さそうです。

簡単なTodoのタスクアイテムのインターフェースを定義して、`items`プロパティに入れるようにしたいと思います。

```ts
interface Task {
  content: string,
  done: boolean
}

@Component({
  selector: 'todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  items: Task[]
}
```

`@Component`というデコレーターが出てきましたが、上記の設定はざっとこんな事を設定しています。`<todo></todo>`要素を使えるようにして、それは`todo.component.html`の中身を処理した後のHTML置き換えられ、その範囲だけに有効な`todo.component.css`を適用(`<head/>`に注入)します。

とりあえず初期データを入れて、ブラウザで表示させてみましょう。`TodoComponent`クラスを編集します。

```ts
export class TodoComponent {
  items: Task[]

  constructor() {
    this.items = [
      {content: 'foo', done: false},
      {content: 'bar', done: false}
    ];
  }
}
```

`items`へ`foo`と`bar`なタスクを入れてみました。次に`todo.component.html`を編集してこんな感じにします。

```html
<section>
  <h1>Todo</h1>
  <ul>
    <li *ngFor="let item of items; let i = index">
      <div>{{item.content}}</div>
      <input type="checkbox" (change)="onChange(i)">
    </li>
  </ul>
</section>
```

`ngFor`を使って`items`をループ処理しています。

<say>
先頭に`*`を忘れないように注意が要ります😣
</say>

そして、エントリーポイントとなる`app.component.html`をこのように編集します。

```html
<todo></todo>
```

TODO
