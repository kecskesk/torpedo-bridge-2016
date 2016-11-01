var BASE_URL = "http://195.228.45.100:8080/jc16-srv";
var app = angular.module('torpedo-app', ['ngMaterial']);

app.controller('MainCtrl', function($scope, $http, $mdToast, $mdSidenav) {

//	$http.get(BASE_URL + "/") //todo
//	 .then(function(response) {
//			 	$scope.submarines = response.data;
//	 });
	// Set Header for all HTTP request
   $http.defaults.headers.common.TEAMTOKEN = '355CCC4899499A19FB06D319744CB785';
	var canvas = new fabric.StaticCanvas('map');
    var islandCircle = null;
	 $scope.startGame = function() {
		 	$http.post(BASE_URL + "/game") //todo
			 .success(function(response) {
					 	$scope.gameID = response.id;
			 });
	 };

	 $scope.joinGame = function() {
		 	$http.post(BASE_URL + "/game/" + $scope.gameID)
			 .success(function(response) {
					 	console.log('Joined game');
			 });
	 };

	 $scope.getGameInfo = function() {
			$http.get(BASE_URL + "/game/" + $scope.gameID) //todo
			 .success(function(response) {
						$scope.gameInfo = response;
						canvas.setWidth(response.game.mapConfiguration.width);
						canvas.setHeight(response.game.mapConfiguration.height);
						for (var island of response.game.mapConfiguration.islandPositions){
							var circle = new fabric.Circle({
							  radius: $scope.gameInfo.game.mapConfiguration.islandSize, fill: 'red', left: island.x, top: ($scope.gameInfo.game.mapConfiguration.height - island.y), originX: 'center', originY: 'center'
							});
							canvas.add(circle);
							islandCircle = circle;
						}
			 });
	 };

	 $scope.getSubmarines = function() {
			$http.get(BASE_URL + "/game/" + $scope.gameID + "/submarine") //todo
			 .success(function(response) {
						$scope.submarines = response.submarines;
						canvas.clear();
						for (var sub of response.submarines){
							var circle = new fabric.Circle({
							  radius: $scope.gameInfo.game.mapConfiguration.submarineSize, fill: 'green', left: sub.position.x, top: ($scope.gameInfo.game.mapConfiguration.height - sub.position.y), originX: 'center', originY: 'center'
							});
							canvas.add(circle);
							canvas.add(islandCircle);
						}
			 });
	 };

	 $scope.move = function(submarineID, speed, turn) {
		 data = {
			 'speed': speed,
			 'turn': turn
		 }
			$http.post(BASE_URL + "/game/" + $scope.gameID + "/submarine/" + submarineID +"/move", data)
			 .success(function(response) {
						console.log(response);
			 });
	 };

	 $scope.getGameInfoText = function() {
	    return JSON.stringify($scope.gameInfo, null, 4);
	 };

});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');
});