angular.module('MetronicApp')
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
 url: 'https://safe-oasis-58234.herokuapp.com/api'
  // url: 'http://localhost:8200/api'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});