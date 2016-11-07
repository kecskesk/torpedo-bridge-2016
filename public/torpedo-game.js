var BASE_URL = "http://localhost:4567";
var app = angular.module('torpedo-app', ['ngMaterial']);

app.controller('MainCtrl', function($scope, $http, $mdToast, $mdSidenav) {

	var canvas = new fabric.StaticCanvas('map');
	var interval = 2000;  // 1000 = 1 second, 3000 = 3 seconds
	function doAjax() {
		canvas.clear();
	 	$http.get(BASE_URL + "/rest/getInfos").success(function(response) {
				$scope.infos = response;

				// Draw things
				drawGameBase(response);
				drawSubmarines(response);
				drawEntities(response);
				setTimeout(doAjax, interval);
		 });
	};
	setTimeout(doAjax, interval);

	function drawGameBase(infos) {
		canvas.setWidth(infos.game.mapConfiguration.width);
		canvas.setHeight(infos.game.mapConfiguration.height);
		for (var island of infos.game.mapConfiguration.islandPositions){
			var circle = new fabric.Circle({
				radius: infos.game.mapConfiguration.islandSize, fill: 'red', 
				left: island.x, top: (infos.game.mapConfiguration.height - island.y), 
				originX: 'center', originY: 'center'
			});
			canvas.add(circle);
		}
	};

	function drawSubmarines(infos) {
		for (var sub of infos.submarines){
			var circle = new fabric.Circle({
				radius: infos.game.mapConfiguration.submarineSize, fill: 'green', 
				left: sub.position.x, top: (infos.game.mapConfiguration.height - sub.position.y), 
				originX: 'center', originY: 'center'
			});
			canvas.add(circle);


			var sonarRange = new fabric.Circle({
				radius: infos.game.mapConfiguration.sonarRange, fill:undefined,  stroke: "green",  strokeWidth: 2, 
				left: sub.position.x, top: (infos.game.mapConfiguration.height - sub.position.y), 
				originX: 'center', originY: 'center'
			});
			canvas.add(sonarRange);

			var submarineNumber = new fabric.Text(sub.id.toString(), {
			  left: sub.position.x - 25, top: (infos.game.mapConfiguration.height - sub.position.y) - 15, fontSize: 15
			});
			canvas.add(submarineNumber);

			var health = new fabric.Text('HP:100/'+sub.hp.toString(), {
			  left: sub.position.x - 25, top: (infos.game.mapConfiguration.height - sub.position.y) + 10, fontSize: 15
			});
			canvas.add(health);

			var trg = infos.targetStore[sub.id];
			var target = new fabric.Circle({
				radius: 2, fill: 'darkgreen', 
				left: trg.x, top: (infos.game.mapConfiguration.height - trg.y), 
				originX: 'center', originY: 'center'
			});
			canvas.add(target);

			var targetNumber = new fabric.Text(sub.id.toString(), {
			  left: trg.x, top: (infos.game.mapConfiguration.height - trg.y), fontSize: 15
			});
			canvas.add(targetNumber);

			drawSpeed(sub, infos.game.mapConfiguration.height);
		}
	};

	function drawEntities(infos) {
		for (var e of infos.entities){
			if (e.type === 'Submarine' && e.owner.name !== 'Thats No Moon') {
				var entity = new fabric.Circle({
					radius: infos.game.mapConfiguration.submarineSize, fill: 'red', 
					left: e.position.x, top: (infos.game.mapConfiguration.height - e.position.y), 
					originX: 'center', originY: 'center'
				});
				canvas.add(entity);
				var sonarRange = new fabric.Circle({
					radius: infos.game.mapConfiguration.sonarRange, fill:undefined,  stroke: "red",  strokeWidth: 1, 
					left: e.position.x, top: (infos.game.mapConfiguration.height - e.position.y), 
					originX: 'center', originY: 'center'
				});
				canvas.add(sonarRange);

				var owner = new fabric.Text(e.owner.name, {
				  left: e.position.x - 25, top: (infos.game.mapConfiguration.height - e.position.y) + 10, fontSize: 15
				});
				canvas.add(owner);

				drawSpeed(e, infos.game.mapConfiguration.height);

			}

			if (e.type === 'Torpedo') {

				var entity = new fabric.Circle({
					radius: 2, fill: 'black', 
					left: e.position.x, top: (infos.game.mapConfiguration.height - e.position.y), 
					originX: 'center', originY: 'center'
				});
				canvas.add(entity);
				var torpedoRange1 = new fabric.Circle({
					radius: infos.game.mapConfiguration.torpedoExplosionRadius, fill:undefined,  stroke: "black",  strokeWidth: 1, 
					left: e.position.x, top: (infos.game.mapConfiguration.height - e.position.y), 
					originX: 'center', originY: 'center'
				});
				canvas.add(torpedoRange1);

				var torpedoRange2 = new fabric.Circle({
					radius: infos.game.mapConfiguration.torpedoRange, fill:undefined,  stroke: "grey",  strokeWidth: 1, 
					left: e.position.x, top: (infos.game.mapConfiguration.height - e.position.y), 
					originX: 'center', originY: 'center'
				});
				canvas.add(torpedoRange2);

				drawSpeed(e, infos.game.mapConfiguration.height);
			}

			
		}
	};

	function drawSpeed(e, height) {
		var velocity_X = e.velocity*Math.cos(e.angle * Math.PI / 180);
		var velocity_Y = e.velocity*Math.sin(e.angle * Math.PI / 180);

		var inverted_y = height - e.position.y;

		var current = new fabric.Line([
			e.position.x, 
			inverted_y, 
			e.position.x + velocity_X, 
			inverted_y - velocity_Y
			], {
	        stroke: 'DarkRed',
	        strokeWidth: 2,
		    originX: 'center',
		    originY: 'center'

	    });
		canvas.add(current);
	};

});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');
});