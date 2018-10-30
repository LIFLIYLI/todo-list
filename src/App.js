import React, { Component } from 'react';
import 'normalize.css'
import './reset.css'
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import UserDialog from './UserDialog'
import {getCurrentUser, signOut} from './leanCloud'
import AV from 'leancloud-storage'
var TestObject = AV.Object.extend('TestObject')
var testObject = new TestObject()

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: [],   
    }
  }
  render() {
    let todos = this.state.todoList
    .filter((item)=> !item.deleted)
    .map((item,index)=>{
      return ( // 为什么这里要加个括号？这是动手题3 🐸
        <li key={index}>
         <TodoItem todo={item} onToggle={this.toggle.bind(this)} 
            onDelete={this.delete.bind(this)}/>
        </li>
      )
    })

    return (
      <div className="App">
        <h1>{this.state.user.username||'我'}的待办事件
          {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <div className="inputWrapper">
        <TodoInput content={this.state.newTodo} 
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol className="todoList">
          {todos}
        </ol>
        {this.state.user.id ? 
          null : 
          <UserDialog 
          onSignUp={this.onSignUpOrSignIn.bind(this)} 
          onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
      </div>
    )
  }
  signOut(){
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
    console.log('我出去了')
  }

  onSignUpOrSignIn(user){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user

    this.setState(stateCopy)
    console.log('我警来了') 
                     //********* */
                     var query = new AV.Query('TestObject');
                     query.equalTo('user', this.state.user.username);                     
                     let todolists = [];
                     query.find().then(function (lists) {                   
                       //var obj = results[0];                                           
                       lists.forEach(function(list) {
                         let todolist = list.get('kk')
                         todolists.push(todolist);
                         console.log('哪里')
                         console.log(todolists)  
                       })               
                     })             
                     setTimeout(()=>{
                      console.log('这里')
                      console.log(todolists) 
                        if(todolists.length>0){
                          console.log(todolists)
                          console.log('这里能找到') 
                          this.setState({
                            todoList:todolists[0]
                          })                               
                        }else{
                          this.setState({
                            todoList:[]
                          })
                          console.log('真的找不到')                                              
                        }                  
                      },200)
  }
  componentDidUpdate(){ 

  }
  toggle(e, todo){
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
  }
  changeTitle(event){
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    }) 
  }
  addTodo(event){ 
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })
    testObject.save({
      kk: this.state.todoList,
      user:this.state.user.username
    }).then(function(object) {
      alert('我记录了')
    })
  }    
  delete(event, todo){
    todo.deleted = true
    this.setState(this.state) 
    testObject.save({
      kk: this.state.todoList,
      user:this.state.user.username
    }).then(function(object) {
      alert('我删除了')
    })         
  } 
}

export default App;

let id = 0

 function idMaker(){
  id += 1
  return id
}