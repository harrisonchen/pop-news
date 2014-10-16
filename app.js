angular.module('popNews', ['ui.router'])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
])
.factory('Posts', function(){
	return {
		posts: []
	};
})
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

	$scope.incrementLikes = function(comment){
		comment.likes += 1;
	};

}])
.controller('MainCtrl', ['$scope', 'Posts', function($scope, Posts){
	$scope.title = '';
	$scope.posts = Posts.posts;

	$scope.addPost = function(){
		if($scope.title === ''){ return; }
		$scope.posts.push({
			title: $scope.title,
			link: $scope.link,
			likes: 0,
			comments: [
				{author: 'Joe', body: 'Cool post!', likes: 0},
    		{author: 'Bob', body: 'Great idea but everything is wrong!', likes: 0}
			]
		});
		$scope.title = '';
		$scope.link = '';
	};

	$scope.incrementLikes = function(post){
		post.likes += 1;
	};

}]);