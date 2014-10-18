angular.module('popNews', ['ui.router'])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
		  	postPromise: ['Posts', function(Posts){
    			return Posts.getAll();
  			}]
			}
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
])
.factory('Posts', ['$http', function($http){
 	var o = {
		posts: []
	};

	o.getAll = function(){
		return $http.get('/posts')
		.success(function(data){
			angular.copy(data, o.posts);
		})
	};

	o.create = function(post) {
	  return $http.post('/posts', post)
	  .success(function(data){
	    o.posts.push(data);
	  });
	};

	o.like = function(post) {
	  return $http.put('/posts/' + post._id + '/like')
	  .success(function(data){
	    post.likes += 1;
  	});
	};

	return o;
}])
.controller('PostsCtrl', ['$scope', '$stateParams', 'Posts', 
	function($scope, $stateParams, Posts){

	$scope.post = Posts.posts[$stateParams.id];
	$scope.body = '';

	$scope.addComment = function(){
		if($scope.body === '') { return; }
		$scope.post.comments.push({
			author: 'user',
			body: $scope.body,
			likes: 0
		});

		$scope.body = '';
	}

}])
.controller('MainCtrl', ['$scope', 'Posts', function($scope, Posts){
	$scope.title = '';
	$scope.posts = Posts.posts;

	$scope.addPost = function(){
		if($scope.title === ''){ return; }
		Posts.create({
			title: $scope.title,
			link: $scope.link
		});
		$scope.title = '';
		$scope.link = '';
	};

	$scope.incrementLikes = function(post) {
  	Posts.like(post);
	};

}]);