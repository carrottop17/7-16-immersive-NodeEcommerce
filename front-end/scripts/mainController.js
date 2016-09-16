var ecommerceApp = angular.module("ecommerceApp", ['ngRoute', 'ngCookies']);
var apiPath = "http://localhost:3000";
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){
//var testSK = sk_test_MbXigc17vvk4oKDF0RB427ht;
//var testPK = pk_test_NB6POtLjg1OYRbj9mdn3sLrr;
//var liveSK = sk_live_INviSDKDWAqNM3WTxF05VlZc;
//var livePK = pk_live_Cndi6cVv4LUsMcYU1dMo0o4F;

	

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

// if(location.path == "")

// ecommerceApp.factory('token', )
// 	$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'))
// 	.then(function successCallback(response){
// 		//response.data.xxx = whatever res.json was in express.
// 		if (response.data.failure == 'badToken'){
// 			$location.path = '/login'
// 		}else if(response.data.failure == 'noToken'){
// 			$location.path = '/login' // no token
// 		}else{
// 			//the token is good. response.data will have their stuff in it
// 			$scope.username = response.data.username;
// 			//etc
// 		}
// 	}, function errorCallback(response){
// 	})

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
});

ecommerceApp.controller('optionsController', function($scope, $http, $cookies, $location){
	// make sure the user is logged in, i.e., that someone has not just pasted /options in the URL
	$http({
		method: 'GET',
		url: apiPath + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			//redirect to login page
			$location.path('/login');
			console.log(response.data);
		} else {
			$scope.username = response.data;
		}
	}, function errorCallback(response){
		console.log(response.status);
	});


	$scope.addToCart = function(name){
		var oldCart = $cookies.get('cart');
		var newCart = oldCart + ',' + name;
		$cookies.put('cart', newCart)
	};

	$scope.removeFromCart = function(name) {
		var cart = $cookies.get('cart');
	  	var values = cart.split(',');
	  	for(var i = 0; i < values.length; i++) {
	    	if(values[i] == name) {
	      	values.splice(i, 1);
	      	var newCart = values.join(',');
	    	}
	  	}
	  	$cookies.put('cart', newCart)
	};

	$scope.submitOrder = function(name){
		$location.path('delivery')
	};

});

ecommerceApp.controller('cartController', function($scope, $http, $cookies, $location){
	$http({
		method: 'GET',
		url: apiPath + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			//redirect to login page
			$location.path('/login');
			console.log(response.data);
		} else {
			$scope.username = response.data;
		}
	}, function errorCallback(response){
		console.log(response.status);
	});
	
	$scope.getCart = function(){
    	var cart = $cookies.get('cart');
    	$scope.cartItemsArray = cart.split(',');
    	console.log(cart);
    	
    	// for(var i = 0; i<cartItemsArray.length; i++){
        //do stuff with each index
        //i.e., get the cost, the name, etc. and load them up into another array
    	// }
    }

    $scope.payOrder = function(userOptions) {
        $scope.errorMessage = "";
        var handler = StripeCheckout.configure({
            key: 'pk_test_NB6POtLjg1OYRbj9mdn3sLrr',
            image: 'assets/img/dc_roasters_200x124_lt.png',
            locale: 'auto',
            token: function(token) {
                console.log("The token Id is: ");
                console.log(token.id);

                $http.post(apiPath + '/stripe', {
                    amount: $scope.total * 100,
                    stripeToken: token.id,
                    token: $cookies.get('token')
                        //This will pass amount, stripeToken, and token to /payment
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.success) {
                        //Say thank you
                        $location.path('/receipt');
                    } else {
                        $scope.errorMessage = response.data.message;
                        //same on the checkout page
                    }
                }, function errorCallback(response) {});
            }
        });
        handler.open({
            name: 'DC Roasters',
            description: 'A Better Way To Grind',
            amount: $scope.total * 100
        });
    };
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
		controller: 'optionsController'
	})
	.when('/cart',{
		templateUrl: 'views/cart.html',
		controller: 'cartController'
	})
	.when('/checkout',{
		templateUrl: 'views/checkout.html',
		controller: 'cartController'
	})
	.when('/payment',{
		templateUrl: 'views/payment.html',
		controller: 'cartController'
	})
	.when('/delivery',{
		templateUrl: 'views/delivery.html',
		controller: 'mainController'
	})
});