import AV from 'leancloud-storage'

 var APP_ID = '84GSl2aD34P8veMcp9CKy4Rs-gzGzoHsz'
var APP_KEY = 'aq4UG3QW6b6jCwMQisogbrVx'
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})
var TestObject = AV.Object.extend('TestObject')
var testObject = new TestObject()
 export default AV

 export function signUp(username, password, successFn, errorFn){
    // 新建 AVUser 对象实例
   var user = new AV.User()
   // 设置用户名
   user.setUsername(username)
   // 设置密码
   user.setPassword(password)
   // 设置邮箱
   user.signUp().then(function (loginedUser) {
     let user = getUserFromAVUser(loginedUser)
     successFn.call(null, user)
   }, function (error) {
     errorFn.call(null, error)
   })
    return undefined

  }

  export function signIn(username, password, successFn, errorFn){
    AV.User.logIn(username, password).then(function (loginedUser) {
      let user = getUserFromAVUser(loginedUser)
      successFn.call(null, user)

    }, function (error) {
      errorFn.call(null, error)
    })
  }
  
  export function getCurrentUser(){
    let user = AV.User.current()
    if(user){
      return getUserFromAVUser(user)
    }else{
      return null
    }
  }
  export function signOut(){
  AV.User.logOut()
  return undefined
}

  function getUserFromAVUser(AVUser){
   return {
     id: AVUser.id,
     ...AVUser.attributes
   }
}