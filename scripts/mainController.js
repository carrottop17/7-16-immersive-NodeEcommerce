var ecommerceApp = angular.module("ecommerceApp", ['ngRoute', 'ngCookies']);
var apiPath = "http://danielbarranco.com:3000";
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){

window.scrollTo(0, 0);
	
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

	$scope.logout = function(){
		$cookies.remove('token');
		$cookies.remove('cart');
	}

	$scope.deliver = function(){
		$http.post(apiPath + '/delivery', {
			name: $scope.name,
			address: $scope.address,
			address2: $scope.address2,
			city: $scope.city,
			state: $scope.state,
			zipCode: $scope.zipCode,
			phone: $scope.phone,
			order: $cookies.get('cart', $scope.order),
			token: $cookies.get('token')
		}).then(function successCallback(response){
			$location.path('/checkout');
		}, function errorCallback(response){
		});
	};
});

ecommerceApp.controller('optionsController', function($scope, $http, $cookies, $location){
	window.scrollTo(0, 0);
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
		if(oldCart == undefined){
			var newCart = name;
		}else{
			var newCart = oldCart + ',' + name;
		};
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
	window.scrollTo(0, 0);
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
    }

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
});

ecommerceApp.controller('checkoutController', function($scope, $http, $cookies, $location){
	window.scrollTo(0, 0);
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
			$scope.name = response.data.name;
			$scope.address = response.data.address;
			$scope.address2 = response.data.address2;
			$scope.city = response.data.city;
			$scope.state = response.data.state;
			$scope.zipCode = response.data.zipCode;
			$scope.phone = response.data.phone;
			var cart = $cookies.get('cart');
    		$scope.cartItemsArray = cart.split(',');
    		var cartItemsArray2 = cart.split(',');
    		$scope.quantity = cartItemsArray2.length;
    		$scope.total = cartItemsArray2.length * 3.99;
    		console.log(cart);
		}
	}, function errorCallback(response){
		console.log(response.status);
	});
	
    $scope.payOrder = function(userOptions) {
        $scope.errorMessage = "";
        var handler = StripeCheckout.configure({
            key: 'pk_test_NB6POtLjg1OYRbj9mdn3sLrr',
            image: 'images/image_i.png',
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
            name: 'Image Direct',
            description: 'All your favorite Image Titles',
            amount: $scope.total * 100
        });
    };
});

ecommerceApp.controller('receiptController', function($scope, $http, $cookies, $location){
	window.scrollTo(0, 0);
	$http({
		method: 'GET',
		url: apiPath + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			//redirect to login page
			$location.path('/login');
			console.log(response.data);
		} else {
			var cart = $cookies.get('cart');
    		$scope.cartItemsArray = cart.split(',');
    		var cartItemsArray2 = cart.split(',');
    		$scope.quantity = cartItemsArray2.length;
    		$scope.total = cartItemsArray2.length * 3.99;
    		$cookies.remove('cart');
		}
	}, function errorCallback(response){
		console.log(response.status);
	});
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
		controller: 'checkoutController'
	})
	.when('/receipt',{
		templateUrl: 'views/receipt.html',
		controller: 'receiptController'
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