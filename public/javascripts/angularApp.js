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
		.state('post', {
			url: '/posts/{id}',
			templateUrl: '/post.html',
			controller: 'PostCtrl',
			resolve: {
				Post: ['$stateParams', 'Posts', function($stateParams, Posts){
					return Posts.get($stateParams.id);
				}]
			}
		});

		$urlRouterProvider.otherwise('home');
	}
])
.factory('Posts', ['$http', function($http){
 	var o = {
		posts: []
	};

	o.get = function(id){
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		});
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

	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment);
	};

	o.likeComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/like')
					 .success(function(data){
					   comment.likes += 1;
				   });
	};

	return o;
}])
.controller('PostCtrl', ['$scope', 'Posts', 'Post', 
	function($scope, Posts, Post){

	$scope.post = Post;
	$scope.body = '';

	$scope.addComment = function(){
		if($scope.body === '') { return; }

		Posts.addComment(Post._id, {
			author: 'user',
			body: $scope.body,
			likes: 0
		})
		.success(function(comment){
    	$scope.post.comments.push(comment);
  	});

		$scope.body = '';
	}

	$scope.incrementLikes = function(comment){
		Posts.likeComment(Post, comment);
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