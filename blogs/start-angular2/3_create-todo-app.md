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

今の状態を、ブラウザで確認してこの画像のようになっていればココまで大丈夫です。

![create todo app | first view](/images/start-angular2/images/first-view.png)

## Task の状態を Toggle できるようにする

上記セクションで記述した`todo.component`を編集して、チェックボックスをクリックするとタスクを完了して、再度クリックしたらタスク完了をキャンセルできる感じにしてみたいと思います。

`todo.component.html`をこのようにします。

```html
<section>
  <h1>Todo</h1>
  <ul>
    <li *ngFor="let item of items; let i = index">
      <div style=display:inline>
        <div *ngIf="!item.done">{{item.content}}</div>
        <del *ngIf="item.done">{{item.content}}</del>
      </div>
      <input type="checkbox" (change)="onChange(item)">
    </li>
  </ul>
</section>
```

`ngIf`は、値が`true`だと表示されて`false`だと要素自体がなくなるDirectiveです。つまり、`item.done`が`true`になった時、`<del></del>`要素で囲むようにします。

`item.done`をToggleする方法ですが、`<input/>`に`change`イベントを登録して、チェックが変わるたびにその`item`の`done`プロパティの`bool`を反対にするような方法でやりたいと思います。

多分Angular2を知らない人は、`(change)`という見慣れない属性値を見て、さっそく困惑していると思いますが僕もです。

Outputという機能で、この機能を使って外部のコンポーネントに対してこのコンポーネントのデータを渡したりすることができます。これは`@Output() <eventName> = new EventEmitter()`という感じで定義することができます。`this.<eventName>.emit()`した時、Output属性の値に指定したメソッドが呼び出されます。

ただ、じゃあ上記なら`@Output() change`とすればいいのだろうと思うかもしれませんが、一般的なDOMイベント（`change`や`click`）はの場合は、理解が不十分なので間違ってるかもしれませんが、いちいち`@Output`宣言はいりません。その要素でDOMイベントが起きると、`@Output`されたイベントの如く(`emit`みたいな)トリガーされて、Output値のメソッド(上記なら`onChange`)を実行させることができます。

<say>
間違ってるかもしれませんが、多分[ココ](https://github.com/angular/angular/blob/8f5dd1f11e6ca1888fdbd3231c06d6df00aba5cc/modules/%40angular/platform-webworker/src/web_workers/ui/event_dispatcher.ts#L25)に載ってるものはOutputとして使えるんじゃないかなと思います。間違ってたらすいません。。
</say>

`onChange`メソッドを実装します。このメソッドの内容はただ渡された`item`の`done`プロパティのBool値を反転させるだけです。`TodoComponent`はこうなりました。

```ts
export class TodoComponent {
  items: Task[]

  constructor() {
    this.items = [...];
  }

  onChange(item: Task) {
    item.done = !item.done;
  }
}
```

これで、`input[type=checkbox]`をクリックしたら、線が引かれたり消えたりするようになったと思います。

## タスクを追加するためのフォームコンポーネントを作る

新しく`todo-form`コンポーネントを作ります。

```bash
ng g component todo-form
```

```html
<form (submit)="onSubmit(todoForm.value, todoForm.valid)" [formGroup]="todoForm" novalidate>
  <input type="text" [(ngModel)]="content" formControlName="content">
  <input type="submit" [disabled]="todoForm.invalid">
</form>
```

```ts
import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
  todoForm: FormGroup

  constructor() {
    this.todoForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  onSubmit(formValue: {content: string}) {
    console.log(formValue);
    this.todoForm.reset();
  }
}
```
