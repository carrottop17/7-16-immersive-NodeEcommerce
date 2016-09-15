var ecommerceApp = angular.module("ecommerceApp", ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){

	var apiPath = "http://localhost:3000";

	$scope.register = function(){
		console.log($scope.username);
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response);
			if(response.data.message == 'added'){
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$location.path('/options');
				console.log(response.data);
			}
		},function errorCallback(response){
			console.log('error');
			console.log(response);
		});
	};

	$http.get(apiPath + '/getUserData=' + $cookies.get('token'))
	.then(function successCallback(response){
		//response.data.xxx = whatever res.json was in express.
		if (response.data.failure == 'badToken'){
			$location.path = '/login'
		}else if(response.data.failure == 'noToken'){
			$location.path = '/login' // no token
		}else{
			//the token is good. response.data will have their stuff in it
		}
	}, function errorCallback(response){
	})

	$scope.login = function(){
		$http.post(apiPath + '/login', {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.success == 'userfound'){
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$location.path('/options');
				$scope.loggedIn = true;
				console.log(response.data.token);
			}
			if(response.data.failure == 'noUser'){
				$scope.wrongUsername = true;
			}
			if(response.data.failure == 'badPass'){
				$scope.wrongPassword = true;
			}
		},function errorCallback(response){
			console.log('error');
			console.log(response);
		});
	};

	$scope.subscriptions = function(){};
});



//set up routes using the routes module
ecommerceApp.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'views/main.html',
		controller: 'mainController'
	})
	.when('/login',{
		templateUrl: 'views/login.html',
		controller: 'mainController'
	})
	.when('/register',{
		templateUrl: 'views/register.html',
		controller: 'mainController'
	})
	.when('/options',{
		templateUrl: 'views/options.html',
		controller: 'mainController'
	})
	.when('/delivery',{
		templateUrl: 'views/delivery.html',
		controller: 'mainController'
	})
});