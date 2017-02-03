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
  private todoItems: Task[]
}
```

`@Component`というデコレーターが出てきましたが、上記の設定はざっとこんな事を設定しています。`<todo></todo>`要素を使えるようにして、それは`todo.component.html`の中身を処理した後のHTML置き換えられ、その範囲だけに有効な`todo.component.css`を適用(`<head/>`に注入)します。

とりあえず初期データを入れて、ブラウザで表示させてみましょう。`TodoComponent`クラスを編集します。

```ts
export class TodoComponent {
  private todoItems: Task[]

  constructor() {
    this.todoItems = [
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
    <li *ngFor="let task of todoItems">
      <div>{{task.content}}</div>
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
    <li *ngFor="let task of todoItems">
      <div style=display:inline>
        <div *ngIf="!task.done">{{task.content}}</div>
        <del *ngIf="task.done">{{task.content}}</del>
      </div>
      <input type="checkbox" (change)="onChange(task)">
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
  private todoItems: Task[]

  constructor() {
    this.todoItems = [...];
  }

  onChange(task: Task) {
    task.done = !task.done;
  }
}
```

これで、`input[type=checkbox]`をクリックしたら、線が引かれたり消えたりするようになったと思います。

## タスクを追加するためのフォームコンポーネントを作る

新しく`todo-form`コンポーネントを作ります。

```bash
ng g component todo-form
```

そして、`todo-form/todo-form.component.html`と`todo-form/todo-form.component.ts`をそれぞれこんな感じに編集します。

```html
<form (submit)="onSubmit(todoForm.value)" [formGroup]="todoForm" novalidate>
  <input type="text" formControlName="content">
  <input type="submit" [disabled]="todoForm.invalid">
</form>
```

```ts
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  private todoForm: FormGroup

  ngOnInit() {
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

`[formGroup]`には`FormGroup`のインスタンスを指定します。この`[...]`という書き方は[Attribute binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#attribute-binding)と言って、設定した値は、実際にはその値を評価した結果に置き換わって設定されます。

`[formGroup]`に属する入力フォームには、HTMLでいう`name`属性のように`formControlName`という属性を設定します。これで名前を設定すると、その入力フォームに関する設定を`FormControl`クラスで設定できるようになります。

`new FormGroup(controls)`時に、`constrols`を渡す必要がありますが、この時の`key`になる名前が先程出てきた`formControlName`で指定した名前です。その値には、`FormControl`のインスタンスを渡します。

`FormControl`の第一引数は、初期値が2つ目にはValidatorを設定します。今回は`new FormControl('', Validators.required)`とValidatorは1つしか設定してませんが、複数設定したい場合は配列にして羅列することもできます。

実はAngular2にはFormの作成方法には`FormsModule`と`ReactiveFormsModule`の2種類があって上記の説明は後者のものになります。Form部分のテストを書く時、前者ではブラウザで検証しなければいけないのに対して、後者はクラスをインスタンスして簡単に値を操作できるのでテストを書きやすくなるようです。

<say>
でもFormが複雑になってくるとどっちもどっちな感じだそう😦
</say>

`FormsModule`はAngular1のような`ngModel`を使用して値を管理するタイプ。ここでは詳しく調べませんが[ここのサンプルコード](https://angular.io/docs/ts/latest/api/forms/index/NgForm-directive.html)を見るとよくわかると思います。

今現在`app.component.ts`で読み込まれているのは`FormsModule`なのでこれを`ReactiveFormsModule`に変更します。`ReactiveFormsModule`は`FormsModule`と同じ`@angular/forms`から`import`できます。

```ts
...
import {ReactiveFormsModule} from '@angular/forms';
...
@NgModule({
  declarations: [...],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: []
  ...
})
...
```

とりあえずここまでで、何かを入力すると`submit`が押せるようになって、押すと`console`にログが出るとこまでできました。

## 共通で使えるService（Model）を作る

Serviceファイルを`ng`コマンドで作ります。以下のコマンドを実行すると、`todo.service.ts`ファイルが作られます。

```bash
ng g service todo
```

出来たファイルの中身はこんな感じになっているはずです。

```ts
import {Injectable} from '@angular/core';

@Injectable()
export class SampleService {
  constructor() { }
}
```

`@Injectable`というデコレーターを付けたものを`@NgModule`の`providers`へ渡すと、そのインスタンスを様々なClassの`constructor`で持ってくることができます。つまり、`app.module.ts`を以下のように編集します。

```ts
...
import {TodoService} from './todo.service';
...
@NgModule({
  declarations: [...],
  imports: [...],
  providers: [TodoService],
  bootstrap: [...]
})
export class AppModule {}
```

これでComponentの`constructor`でもこんな感じでこのServiceのインスタンスを使えるようになりました。

```
@import {TodoService} from '../todo.service';
@Component({...})
class Component {
  constructor(todoService: TodoService) {}
}
```

`todo.component`に書いたTodoに関する情報を`todo.service`に移して、いくらか操作するためのメソッドなどを実装していきます。

### TodoService

```ts
import {Injectable} from '@angular/core';

// Keyは適当に変えてください😇
export const LOCALSTRAGE_KEY = 'javascript.nju33.work/start-angular2';

export class Task {
  constructor(public content: string, public done: boolean = false) {}
}

@Injectable()
export class TodoService {
  private tasks: Task[]

  constructor() {
    const item = localStorage.getItem(LOCALSTRAGE_KEY);
    if (item) {
      this.tasks = JSON.parse(item);
    } else {
      this.tasks = [];
    }
  }

  add(content: string) {
    this.tasks.unshift(new Task(content));
  }

  get(): Task[] {
    return this.tasks;
  }

  save() {
    localStorage.setItem(LOCALSTRAGE_KEY, JSON.stringify(this.tasks));
  }
}
```

上記の内容はこんな感じです。

- `constructor`でローカルストレージからデータを取得、無かったらただの`[]`を返す
- `add`はTaskの追加
- `get`はすべてのTaskを返す
- `save`はlocalStorageへデータを保存

では、このサービスを今まで作ってきたComponentに組み込みます。まずは、`todo-form.component.ts`です。

### TodoFormComponent

```ts
import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TodoService} from '../todo.service';

@Component({
  selector: 'todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  @Output() todoUpdate: EventEmitter<any> = new EventEmitter();
  private todoForm: FormGroup;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  onSubmit(formValue: {content: string}) {
    this.todoService.add(formValue.content);
    this.todoForm.reset();
    this.todoUpdate.emit();
  }
}
```

追加したのは、`todoUpdate`イベントを作ったことです。`onSubmit`でデータが追加されるとこのイベントがトリガーされて、そのタイミングで親（AppComponent）でも何か処理できるようになりました。

### TodoComponent

次に`todo/todo.component.ts`を編集します。

```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  DoCheck,
  KeyValueDiffers
} from '@angular/core';
import {TodoService, Task} from '../todo.service';

@Component({
  selector: 'todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, DoCheck {
  @Input() todoItems: Task[];
  @Output() completeChange: EventEmitter<Task> = new EventEmitter();
  private todoDiffers: any[];

  constructor(private differs: KeyValueDiffers) {}

  ngOnInit() {
    this.todoDiffers = this.todoItems.map(item => {
      return this.differs.find(item).create(null);
    });
  }

  ngDoCheck() {
    const changesArr = this.todoItems.filter((item, i) => {
      const changes = this.todoDiffers[i].diff(item);
      return changes;
    });

    if (changesArr.length > 0) {
      this.completeChange.emit();
    }
  }

  onChange(task: Task) {
    task.done = !task.done;
  }
}
```

こっちは、まず`taskItems`をInputで取得するように変更しました。そして、ライフサイクルの１つで自動で実行される`ngDoCheck`メソッドを定義して、Taskオブジェクトに何らかのデータ変更が起きた場合、`completeChange`イベントが起きるように修正しました。ちなみに`ngOnChanges`という変更を察知して実行されるメソッドもありますが、こっちは`string`や`number`、`boolean`みたいなプリミティブな値しか察知できないみたいなので、`ngDoCheck`によりチェックを行っています。

`@Input`でデータを取得する際の注意点ですが、必ずライフサイクルの1つである`ngOnInit`メソッドで行う必要があります。`constructor`で使おうとしても`undefined`となってしまいます。

<say>
ここにハマって1時間程悩みました😑
</say>

オブジェクトデータのチェックには`KeyValueDiffers`を使います。`const differ = this.differs.find(initData).create(null)`という感じで`initData`(最初のデータ)を渡した後、`differ.diff(nextData)`とすると、変更があった場合はそのオブジェクトを返して、変更がない場合は`null`を返してくれます。

<say>
最初調べた時、この`private differs: KeyValueDiffers`というのが「これ一体どこから来たんだ」って感じに思って混乱しました。
`constructor`で読み込んでるってことは`@NgModule`の`providers`関連かなと思って調べてみると、`AppModule`の`@NgModule`の`imports`で読み込んでいる`BrowserModule`が`exports`している`ApplicationsModule`に含まれている`providers`に`KeyValueDiffres`がありましたとさ✌️

あとちなみに、オブジェクトには`KeyValueDiffers`を使いますが、配列には`IterableDiffers`を使います。これも`ApplicationModule`の`providers`に記述されています。
</say>

### AppComponent周辺の編集

以上を踏まえて`app.component.html`を編集します。

```ts
<todo [todoItems]="todoItems" (completeChange)="onCompleteChange($event)"></todo>
<todo-form (todoUpdate)="onTodoUpdate()"></todo-form>
```

やっていることはこんな感じです。

- TodoComponentで`completeChange`がトリガーされるとAppComponentの`onCompleteChange`メソッドが実行
- TodoFormComponentで`todoUpdate`がトリガーされるとAppComponentの`onTodoUpdate`メソッドが実行
- TodoComponentにAppComponentの`todoItems`を渡す

上記であげたようなメソッドを実装します。

```ts
import {Component} from '@angular/core';
import {TodoService} from './todo.service';
import {Task} from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todoItems: Task[];

  constructor(private todoService: TodoService) {
    this.todoItems = this.todoService.get();
  }

  handleTodoUpdate() {
    this.todoService.save();
  }

  onTodoUpdate() {
    this.handleTodoUpdate();
  }

  onCompleteChange() {
    this.handleTodoUpdate();
  }
}
```

`onTodoUpdate`も`onCompleteChange`もただ、TodoServiceの`save()`コマンドでローカルストレージへ保存しているだけです。

ローカルストレージへデータを格納することでデータを保持できるようになりました。ここまでで、リロードした時に前回の状態が復活すると思いますが、`task.content`には線が引かれているのに`checkbox`にはチェックが入ってないような状態になってしまいます。これを直すには、`input[type=checkbox]`に`[checked]`を追加します。

```html
<input type="checkbox" (change)="onChange(task)" [checked]="task.done">
```

## 色々改善

### 開いた時に`task.done`が`false`なものは削除してしまう。

AppComponentの`constructor`をこのように変更します。

```ts
constructor(private todoService: TodoService) {
  this.todoItems = this.todoService.get().filter(task => !task.done);
}
```
