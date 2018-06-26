import React, { PureComponent } from 'react'
import config from "./db_config"
import fb from "firebase"
import uuid from "uuid"

import LoginForm from "./components/login"

interface Todo {
  content: string
  completed: boolean
}

interface TodosObj {
  [key: string]: Todo
}

interface S {
  fb: fb.app.App
  loggedIn: boolean
  user: fb.User | null
  todos: TodosObj
}

export default class App extends PureComponent<{}, S> {

  constructor(props: any) {
    super(props)

    this.state = {
      fb: fb.initializeApp(config),
      loggedIn: false,
      user: null,
      todos: {}
    }

    this.checkLoggedIn = this.checkLoggedIn.bind(this)
    this.addHandler = this.addHandler.bind(this)
    this.removeHandler = this.removeHandler.bind(this)
  }

  addTodo(todo: TodosObj) {
    this.setState({
      todos: Object.assign({}, this.state.todos, todo)
    })
  }

  removeTodo(id: string) {
    debugger
    const todos = Object.assign({}, this.state.todos)
    delete todos[id]

    this.setState({
      todos
    })
    
  }

  updateTodos() {
    this.state.fb.database().ref(`todos/${(this.state.user as fb.User).uid}`).set(this.state.todos)
  }

  // That english tho
  checkLoggedIn(user: fb.User | null) {
    // Logged in
    if(user && !this.state.loggedIn) {
      // @ts-ignore
      fb.database(fb.app()).ref(`todos/${user.uid}`).on("value", snap => {
        if(snap) {
          this.setState({
            todos: Object.assign({}, this.state.todos, snap.val())
          })
        }
      })
      this.setState({
        loggedIn: true,
        user,
        
      })
    } 
    // Not logged in
    else if(!user && this.state.loggedIn) {
      this.setState({
        loggedIn: false,
        user
      })
    }
  }

  componentDidMount() {
    fb.auth().onAuthStateChanged(this.checkLoggedIn)
  }

  composeTodo(content: string, completed: boolean = false, id = ""): TodosObj {
    return {
      [id || uuid.v4()]: {
        content,
        completed
      }
    }
  }

  addHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    debugger
    // @ts-ignore
    const todoContent = e.target.todoinput.value
    if(!todoContent) {
      alert("You didn't write anything... I'm ashamed of you... 😔")
      return false
    } else {
      const newTodo = this.composeTodo(todoContent)
      this.addTodo(newTodo)
      e.target.todoinput.value = ""
      return true
    }
    debugger
  }

  removeHandler(e: React.MouseEvent<HTMLButtonElement>) {
    // @ts-ignore
    const id = e.target.parentElement.attributes["data-id"].value
    this.removeTodo(id)
    debugger
  }


  mapTodos(todosObj: TodosObj) {
    const keys = Object.keys(todosObj)
    return keys
      .map(key => ({key, todo: todosObj[key]}))
      .map(({key, todo}, i: number) => (
        <li className="todos__item" key={i} data-id={key}>
          <p className="todos__item__content">{todo.content}</p>
          <button onClick={this.removeHandler} className="todos__item__btn">X</button>
        </li>
      ))
  }

  render() {
    if(!this.state.loggedIn) {
      return (
        <main className="main">
          <LoginForm auth={this.state.fb.auth()}/>
        </main>
      )
    } else if(this.state.user){
      return (
        <main className="main">

          <ol className="todos">
            {
              this.mapTodos(this.state.todos)
            }
          </ol>

          <form action="" className="input" onSubmit={this.addHandler}>
            <label className="input__label" htmlFor="todoinput">New todo</label>
            <input type="text" name="todoinput" id="todoinput" className="input__todo" placeholder="New todo"/>
            <input className="input__btn" type="submit" value="Add"/>
          </form>
        </main>
      )
    } else {
      return (
        <h1>
          Sry bruh, there was an error. I know it's not your fault, but ya know... Leave...
        </h1>
      )
    }
  }
}
