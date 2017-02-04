---
title: Todoアプリを作る
---

## Todoアプリを作る前に

[json-server](https://github.com/typicode/json-server)というJSONファイルだけで簡単にRESTなサーバーを起動できるパッケージがあるのでインストールしといてください。

```bash
npm i -g json-server
```

json-serverは以下のように起動できます。後ろに対象の`.json`ファイルを指定します。

```bash
json-server db.json
```

デフォルトで`3000`で起動しますが、もしポートを変えたくなったら`json-server.json`というファイルを作って以下のようにしてください。

```json
{
  "port": 3333
}
```

## JSONファイルを作る

`db.json`を作ります。こんな感じでファイルを作っといてください。

```bash
{
  "tasks": [
    {"id": 1, "content": "foo", "done": false},
    {"id": 2, "content": "bar", "done": false}
  ]
}
```

これで起動して、`localhost:3000/tasks`へアクセスすると上記のデータが帰ってくるはずです。

```bash
json-server db.json
# ...
curl http://localhost:3000/tasks
# [
#   {
#     "id": 1,
#     "content": "foo",
#     "done": false
#   },
#   {
#     "id": 2,
#     "content": "bar",
#     "done": false
#   }
# ]
```

## Viewを作る

`src/todo-view.js`を作ります。JSXでゴリゴリ書いていきます。1つ以下で使われている`oninit`はライフサイクルメソッドです。要素が作られる前に勝手に実行されます。

<say>
ライフサイクルメソッドには、他に`oncreate`や`onbeforeremove`、`onremove`、`onbeforeupdate`があります。詳しくは[mithril.js.org/lifecycle-methods.html#the-dom-element-lifecycle](http://mithril.js.org/lifecycle-methods.html#the-dom-element-lifecycle)を参照してください。
</say>

<say>
あとReactを使っている人向けの注意点ですが、`on`の後は小文字なので注意‼️(`onclick`や`onsubmit`)

ハマりました😭
</say>

```js
import m from 'mithril';

class TodoView {
  constructor() {
    this.tasks = null;
  }

  oninit(vnode) {
    const {model} = vnode.attrs;
    model.getTasks().then(tasks => {
      this.tasks = tasks;
    });
  }

  handleSubmit(model) {
    return async e => {
      e.preventDefault();
      const contentElem = e.target[0]
      const content = contentElem.value;

      if (!content) {
        return;
      }

      const latestTask = await model.addTask({
        content,
        done: false
      });
      console.log(latestTask);
      this.tasks.push(latestTask);

      contentElem.value = ''
    };
  }

  removeTask(model, task, idx) {
    return () => {
      model.removeTask(task);
      this.tasks.splice(idx, 1);
    };
  }

  view(vnode) {
    const {model} = vnode.attrs;

    if (this.tasks === null) {
      return <section>Loading...</section>;
    }

    return (
      <section>
        {this.count}
        <ul>
          {(this.tasks || []).map((task, idx) => (
            <li>
              <span>{task.content}</span>
              <input type="checkbox"
                     onclick={model.toggleComplete(task)}
                     checked={task.done ? true : false}/>
              <button onclick={this.removeTask(model, task, idx)}
                      style={task.done ? 'display:inline' : 'display:none'}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onsubmit={this.handleSubmit(model)}>
          <input type="text"/>
          <input type="submit"/>
        </form>
      </section>
    )
  }
}

export default new TodoView();
```

## Modelを作る

`src/todo-model.js`を作ります。RESTへのアクセスなどの処理をまとめます。

Mithrilには`request`という外部とデータをやり取りできるメソッドが組み込まれてるのでこれを使います。

```js
import {request} from 'mithril';

function api([path], id) {
  if (id) {
    return `http://localhost:3000/${path}${id}`;
  }
  return `http://localhost:3000/${path}`;
}

class TodoModel {

  // タスクを全部取ってくる
  async getTasks() {
    const tasks = await request(api`tasks`);
    return tasks;
  }

  // タスクを追加
  async addTask(task) {
    const latestTask = await request({
      method: 'POST',
      url: api`tasks`,
      data: task
    });
    return latestTask;
  }

  // タスクの状態を変更
  toggleComplete(task) {
    return () => {
      task.done = !task.done;
      request({
        method: 'PUT',
        url: api`tasks/${task.id}`,
        data: task
      });
    };
  }

  // タスクを削除
  removeTask(task) {
    request({
      method: 'DELETE',
      url: api`tasks/${task.id}`
    });
  }
}

export default new TodoModel();

```

ちなみに、MithrilがViewを更新するタイミングですが、`onclick`などのユーザーアクションが起きた場合か、`request`が実行された時？に更新されます。それ以外で更新したい場合は、`m.redraw`を実行します。

<say>
`request`の辺り間違ってるかも。。
</say>

## エントリーファイルを作る

`src/index.js`でTodoViewとTodoModelをがっちゃんこします。

```js
import m, {mount} from 'mithril';
import todoModel from './todo-model';
import TodoView from './todo-view';

class TodoApp {
  view() {
    return (
      <div>
        <h1>Todo</h1>
        <TodoView model={todoModel}></TodoView>
      </div>
    )
  }
}

mount(document.body, new TodoApp());
```

## Todoアプリ完成！

<iframe width="560" height="315" src="https://www.youtube.com/embed/rKoQNWOnfvE" frameborder="0" allowfullscreen></iframe>
