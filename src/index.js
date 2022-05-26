import {OBJLoader} from './three/examples/jsm/loaders/OBJLoader.js';
import { TrackballControls } from './three/examples/jsm/controls/TrackballControls.js';
import * as THREE from 'three';

let camera, scene, renderer,
	light1, light2, light3, light4, light5, light6, light7, light8,
	object, selectedPlayer, controls, selectedPlayerPos;

let onLight1 = true, onLight2 = true, onLight3 = true, 
	onLight4 = true, onLight5 = true, onLight6 = true,
	onLight7 = true, onLight8 = true, onSpotLight = true,
	onSphereLight = true, switchingLights = false, playerSelection = false,
	defaultView = true, playerCarry = false, playerDribble = false, playerKick = false;

let player1Pos = new THREE.Vector3(5, -25, 0);
let player2Pos = new THREE.Vector3(25, -25, 0);
let ballPos = new THREE.Vector3(15, -25, 0);

init();
animate();

// Events

document.addEventListener("keydown", (e) => {
	if (e.key == "l")
	{
		switchingLights = true;
		console.log("Switching Lights")
	}

	else if (switchingLights)
	{
		console.log("Lightno", e.key)
		if (e.key == "1")
		{
			onLight1 = !onLight1;
			let light = scene.getObjectByName("light1");
			light.visible = onLight1;
		}
		else if (e.key == "2")
		{
			onLight2 = !onLight2;
			let light = scene.getObjectByName("light2");
			light.visible = onLight2;
		}
		else if (e.key == "3")
		{
			onLight3 = !onLight3;
			let light = scene.getObjectByName("light3");
			light.visible = onLight3;
		}
		else if (e.key == "4")
		{
			onLight4 = !onLight4;
			let light = scene.getObjectByName("light4");
			light.visible = onLight4;
		}
		else if (e.key == "5")
		{
			onLight5 = !onLight5;
			let light = scene.getObjectByName("light5");
			light.visible = onLight5;
		}
		else if (e.key == "6")
		{
			onLight6 = !onLight6;
			let light = scene.getObjectByName("light6");
			light.visible = onLight6;
		}
		else if (e.key == "7")
		{
			onLight7 = !onLight7;
			let light = scene.getObjectByName("light7");
			light.visible = onLight7;
		}
		else if (e.key == "8")
		{
			onLight8 = !onLight8;
			let light = scene.getObjectByName("light8");
			light.visible = onLight8;
		}
		else if (e.key == "9")
		{
			onSpotLight = !onSpotLight;
			let light = scene.getObjectByName("spotLight");
			light.visible = onSpotLight;
		}
		else if (e.key == "0")
		{
			onSphereLight = !onSphereLight;
			let light = scene.getObjectByName("football").getObjectByName("sphereLight");
			light.visible = onSphereLight;
		}
	}

	// Camera Zoom in and zoom out
	if (e.key == '+')
	{
		camera.position.z -= 5;
	}
	if (e.key == '-')
	{
		camera.position.z += 5;
	}

	// Selecting user player
	if (e.key == 'p')
	{
		playerSelection = true;
		console.log("Player Selection")
	}
	else if (playerSelection)
	{
		if (e.key == '1')
		{
			selectedPlayer = "player1";
			let player = scene.getObjectByName(selectedPlayer);
			let playerCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
			playerCamera.name = "playerCamera";
			player.add(playerCamera);
			console.log("Player 1 selected")
		}
		else if (e.key == '2')
		{
			selectedPlayer = "player2";
			let player = scene.getObjectByName(selectedPlayer);
			let playerCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
			playerCamera.name = "playerCamera";
			player.add(playerCamera);
			console.log("Player 2 selected")
		}
	}

	// camera view toggle
	if (e.key == 'v')
	{
		console.log("Toggle Camera View");
		defaultView = !defaultView;
	}

	// move 
	if (e.key == 'c')
	{
		
		if (selectedPlayer == "player1")
			selectedPlayerPos = player1Pos;
		else if (selectedPlayer == "player2")
			selectedPlayerPos = player2Pos
		
		console.log(selectedPlayer, "carry", selectedPlayerPos.distanceTo(ballPos))
		if (selectedPlayerPos.distanceTo(ballPos) < 15)
		{
			console.log("Can carry")
			playerCarry = true;
			playerDribble = false;
		}
	}

	// player carry

	if (playerCarry)
	{
		if (e.key == 'ArrowRight')
		{
			selectedPlayerPos.x += 3;
			ballPos.x += 3;

			scene.getObjectByName(selectedPlayer).position.x = selectedPlayerPos.x;
			scene.getObjectByName("football").position.x = ballPos.x;
		}
		else if (e.key == 'ArrowLeft')
		{
			selectedPlayerPos.x -= 3;
			ballPos.x -= 3;

			scene.getObjectByName(selectedPlayer).position.x = selectedPlayerPos.x;
			scene.getObjectByName("football").position.x = ballPos.x;
		}
		else if (e.key == 'ArrowUp')
		{
			selectedPlayerPos.y += 3;
			ballPos.y += 3;

			scene.getObjectByName(selectedPlayer).position.y = selectedPlayerPos.y;
			scene.getObjectByName("football").position.y = ballPos.y;
		}
		else if (e.key == 'ArrowDown')
		{
			selectedPlayerPos.y -= 3;
			ballPos.y -= 3;

			scene.getObjectByName(selectedPlayer).position.y = selectedPlayerPos.y;
			scene.getObjectByName("football").position.y = ballPos.y;
		}
	}

	// Dribble
	if (e.key == 'd')
	{
		if (selectedPlayer == "player1")
			selectedPlayerPos = player1Pos;
		else if (selectedPlayer == "player2")
			selectedPlayerPos = player2Pos
		
		console.log(selectedPlayer, "dribble", selectedPlayerPos.distanceTo(ballPos))
		if (selectedPlayerPos.distanceTo(ballPos) > 5 && selectedPlayerPos.distanceTo(ballPos) < 15)
		{
			console.log("Can dribble")
			playerDribble = true;
		}
	}

	if (playerDribble)
	{
		if (e.key == 'ArrowRight')
		{
			selectedPlayerPos.x += 3;
			ballPos.x += 5;
			let ball = scene.getObjectByName("football");

			// ball.rotation

			scene.getObjectByName(selectedPlayer).position.x = selectedPlayerPos.x;
			scene.getObjectByName("football").position.x = ballPos.x;
		}
		else if (e.key == 'ArrowLeft')
		{
			selectedPlayerPos.x -= 3;
			ballPos.x -= 5;

			scene.getObjectByName(selectedPlayer).position.x = selectedPlayerPos.x;
			scene.getObjectByName("football").position.x = ballPos.x;
		}
		else if (e.key == 'ArrowUp')
		{
			selectedPlayerPos.y += 3;
			ballPos.y += 5;

			scene.getObjectByName(selectedPlayer).position.y = selectedPlayerPos.y;
			scene.getObjectByName("football").position.y = ballPos.y;
		}
		else if (e.key == 'ArrowDown')
		{
			selectedPlayerPos.y -= 3;
			ballPos.y -= 5;

			scene.getObjectByName(selectedPlayer).position.y = selectedPlayerPos.y;
			scene.getObjectByName("football").position.y = ballPos.y;
		}
	}

	// Kick
	if (e.key == 'k')
	{
		if (selectedPlayer == "player1")
			selectedPlayerPos = player1Pos;
		else if (selectedPlayer == "player2")
			selectedPlayerPos = player2Pos
		
		console.log(selectedPlayer, "dribble", selectedPlayerPos.distanceTo(ballPos));
		playerKick = true;

	}

	if (playerKick)
	{
		if (e.key == 'ArrowRight')
		{
			selectedPlayerPos.x += 3;
			ballPos.x += 5;
			let ball = scene.getObjectByName("football");

			scene.getObjectByName(selectedPlayer).position.x = selectedPlayerPos.x;
			scene.getObjectByName("football").position.x = ballPos.x;
		}
		else if (e.key == 'ArrowLeft')
		{
			selectedPlayerPos.x -= 3;
			ballPos.x -= 5;

			scene.getObjectByName(selectedPlayer).position.x = selectedPlayerPos.x;
			scene.getObjectByName("football").position.x = ballPos.x;
		}
		else if (e.key == 'ArrowUp')
		{
			selectedPlayerPos.y += 3;
			ballPos.y += 5;

			scene.getObjectByName(selectedPlayer).position.y = selectedPlayerPos.y;
			scene.getObjectByName("football").position.y = ballPos.y;
		}
		else if (e.key == 'ArrowDown')
		{
			selectedPlayerPos.y -= 3;
			ballPos.y -= 5;

			scene.getObjectByName(selectedPlayer).position.y = selectedPlayerPos.y;
			scene.getObjectByName("football").position.y = ballPos.y;
		}
	}
});

function init() {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = 10;
	camera.position.y = -20;
	camera.position.z = 50;

	scene = new THREE.Scene();

	// Objects

	const loader = new OBJLoader();
	
	loader.load('models/ground.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 30 );
		object.position.x = 27;
		object.position.y = -20;
		object.rotation.x = 0.5 * Math.PI;
		object.rotation.x = 0.5 * Math.PI;
		object.name = "ground"
		scene.add( object );
	}, function (xhr) {}, function (err) {console.log(err)} );

	loader.load( 'models/teapot.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 0.2 );
		object.position.x = 0;
		object.position.y = -35;
		object.name = "obstacle1"
		scene.add( object );
	} );

	loader.load( 'models/teapot.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 0.2 );
		object.position.x = 0;
		object.position.y = -10;
		object.name = "obstacle2"
		scene.add( object );
	} );

	loader.load( 'models/teapot.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 0.2 );
		object.position.x = 30;
		object.position.y = -10;
		object.name = "obstacle3"
		scene.add( object );
	} );

	loader.load( 'models/teapot.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 0.2 );
		object.position.x = 30;
		object.position.y = -35;
		object.name = "obstacle4"
		scene.add( object );
	} );

	loader.load( 'models/avatar.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 0.08 );

		object.position.x = 5;
		object.position.y = -25;
		object.rotation.z = 0.5 * Math.PI;
		// object.rotation.x = -Math.PI / 3;
		object.name = "player1"
		scene.add( object );

	} );

	loader.load( 'models/avatar.obj', function ( obj ) {

		object = obj;
		object.scale.multiplyScalar( 0.08 );
		object.position.x = 25;
		object.position.y = -25;
		object.rotation.z = -0.5 * Math.PI;
		// object.rotation.x = -Math.PI / 2;
		object.name = "player2"
		scene.add( object );

	} );

	loader.load( 'models/sphere.obj', function ( obj ) {

		object = new THREE.SphereGeometry(2);

		const texture = new THREE.TextureLoader().load('football_texture.png');
		let material = new THREE.MeshStandardMaterial( { map: texture } );
		object = new THREE.Mesh( object, material );

		// object.scale.multiplyScalar( 2 );
		object.position.x = 15;
		object.position.y = -25;
		object.position.z = 2;
		object.name = "football"


		// Light attached to the football
		var sphereLight = new THREE.PointLight( 0xffffff, 2, 50 );
		sphereLight.name = "sphereLight";

		object.add(sphereLight);
		scene.add(object);

	});

	//Fixed lights
	const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

	light1 = new THREE.PointLight( 0xffffff, 2, 50 );
	// light1.color = 0xff0000;
	light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light1.position.x = 50;
	light1.position.y = -2;
	light1.name = "light1";
	scene.add( light1 );

	light2 = new THREE.PointLight( 0xffffff, 2, 50 );
	light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light2.position.set( -30, -40, 0 );
	light2.name = "light2";
	scene.add( light2 );

	light3 = new THREE.PointLight( 0xffffff, 2, 50 );
	light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light3.position.x = 50;
	light3.position.y = -40;
	light3.name = "light3";
	scene.add( light3 );

	light4 = new THREE.PointLight( 0xffffff, 2, 50 );
	light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light4.position.x = -30;
	light4.position.y = -2;
	light4.name = "light4";
	scene.add( light4 );
	
	light5 = new THREE.PointLight( 0xffffff, 2, 50 );
	light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light5.position.x = 10;
	light5.position.y = -2;
	light5.name = "light5";
	scene.add( light5 );

	light6 = new THREE.PointLight( 0xffffff, 2, 50 );
	light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light6.position.x = 10;
	light6.position.y = -40;
	light6.name = "light6";
	scene.add( light6 );

	light7 = new THREE.PointLight( 0xffffff, 2, 50 );
	light7.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light7.position.x = 50;
	light7.position.y = -25;
	light7.name = "light7";
	scene.add( light7 );

	light8 = new THREE.PointLight( 0xffffff, 2, 50 );
	light8.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	light8.position.x = -30;
	light8.position.y = -25;
	light8.name = "light8";
	scene.add( light8 );

	// Search Light
	const spotLight = new THREE.SpotLight( 0xffff00 );
	spotLight.position.set( 5, -25, 20 );
	spotLight.name = "spotLight"
	scene.add( spotLight );
	
	//renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor(0x00EE00);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	// controls.dynamicDampingFactor = 0.5;
    controls.target.set(10, -20, 0);

	// controls.keys = [ 'KeyA', 'KeyS', 'KeyD' ];

}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	render();
}

function render() {
	
	if (playerDribble)
	{
		let player2 = scene.getObjectByName("player2");
		player2.position.x += 0.003 * Math.random() * ([-1,1][Math.round(Math.random())])
		let ball = scene.getObjectByName("football");
		for (let index = 0; index < 10; index++) {
			if (ball.position.x >= 50) {
				scene.clear();
				init();
				playerKick = false;
				break;
			}

			if (ball.position.distanceTo(scene.getObjectByName("obstacle1").position) < 5 || 
			ball.position.distanceTo(scene.getObjectByName("obstacle2").position) < 5 ||
			ball.position.distanceTo(scene.getObjectByName("obstacle3").position) < 5 ||
			ball.position.distanceTo(scene.getObjectByName("obstacle4").position) < 5 || 
			ball.position.distanceTo(scene.getObjectByName("player2").position) < 5) 
			{
				console.log("Collided")
				ball.position.x -= 3;
			}
			ball.rotation.z = 0.09 * Math.PI;
		}
	}

	if (playerKick)
	{
		let player2 = scene.getObjectByName("player2");
		player2.position.x += 0.003 * Math.random() * (Math.pow(-1, Math.round(Math.random())))
		let ball = scene.getObjectByName("football");
		for (let index = 0; index < 10; index++) {
			if (ball.position.x >= 50) {
				scene.getObjectByName("player1").position.set(5, -25, 0);
				scene.getObjectByName("player2").position.set(25, -25, 0);
				scene.getObjectByName("football").position.set(15, -25, 0);
				playerKick = false;
				break;
			}
			if (ball.position.distanceTo(scene.getObjectByName("obstacle1").position) < 5 || 
			ball.position.distanceTo(scene.getObjectByName("obstacle2").position) < 5 ||
			ball.position.distanceTo(scene.getObjectByName("obstacle3").position) < 5 ||
			ball.position.distanceTo(scene.getObjectByName("obstacle4").position) < 5 || 
			ball.position.distanceTo(scene.getObjectByName("player2").position) < 5) 
			{
				console.log("Collided")
				ball.position.x -= 3;
			}
			ball.position.x += 3;
			ball.rotation.z = 0.09 * Math.PI;
		}

		
	}
	if (defaultView)
		renderer.render( scene, camera );
	else
		renderer.render(scene, scene.getObjectByName(selectedPlayer).getObjectByName("playerCamera"));
}