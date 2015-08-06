var notesApp = angular.module('notesApp', [
  'ngRoute',
  'ngSanitize'
]);

notesApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'views/noteView.html',
        controller: 'notesAppCtrl'
      }).
      when('/search', {
        templateUrl: 'views/searchView.html'
        // controller: 'notesAppCtrl'
      }).
      when('/logout', {
        templateUrl: 'views/noteView.html',
        controller: 'notesAppCtrl'
      }).
      when('/reccommend', {
        templateUrl: 'views/recommendView.html',
        controller: 'recommendController'
      })
      // when('/login', {
      //   templateUrl: 'views/loginView.html'
      // })
  }]);

notesApp.controller('notesAppCtrl', function ($scope, notesFactory) {
  $scope.getNotes = function(){
    notesFactory.getNotes().then(function(resp){
      // console.log(resp);
      $scope.notes = resp.data;
    }).then(function(){
      for(var note in $scope.notes){
        $scope.notes[note]['_source']['created_at'] = new Date($scope.notes[note]['_source']['created_at']);
      }
    })
  };
  $scope.createPost = function(content){
    notesFactory.createPost(content).then(function(resp){
      $scope.content = "";
    })
  }
  $scope.getNotes();
});

notesApp.controller('recommendController', function ($scope, notesFactory){
  $scope.searchPost = function(content){
    notesFactory.searchPost(content).then(function(resp){
      $scope.notes = resp.data;
    }).then(function(){
      for(var note in $scope.notes){
        $scope.notes[note]['_source']['created_at'] = new Date($scope.notes[note]['_source']['created_at']);
        $scope.notes[note]['highlight']['content'] = $scope.notes[note]['highlight']['content'].join(' ');
      }
    })
  }
})

notesApp.factory('notesFactory', function ($http) {
  var getNotes = function(){
    return $http({
      method: 'GET',
      url: '/posts'
    }).then(function(resp){
      return resp;
    })
  };
  var searchPost = function(content){
    return $http({
      method: 'POST',
      url: '/reccommend',
      data: {'content': content}
    }).then(function(resp){
      return resp;
    })
  };
  var createPost = function(content){
    return $http({
      method: 'POST',
      url: '/posts',
      data: {'content': content}
    }).then(function(resp){
      return resp;
    })
  };

  return {
    getNotes: getNotes,
    createPost: createPost,
    searchPost: searchPost
  }
});
