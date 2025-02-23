import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { ParametricGeometries } from "three/addons/geometries/ParametricGeometries.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import Stats from 'three/addons/libs/stats.module.js';

const canvas = document.querySelector('#c');
const view1Elem = document.querySelector("#view1");
const view2Elem = document.querySelector("#view2");

var clock = new THREE.Clock();
var stats = initStats();

const renderer = new THREE.WebGLRenderer(
	{ antialias: true, canvas }
);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = canvas.clientWidth / canvas.clientHeight; // the canvas default
const near = 0.1;
const far = 1000;
const perspectiveCamera = new THREE.PerspectiveCamera(
	fov,
	aspect,
	near,
	far
);
perspectiveCamera.updateProjectionMatrix();
perspectiveCamera.position.set(0, 0, 150);

const orthographicCamera = new THREE.OrthographicCamera(
	-view2Elem.offsetWidth / 7,
	view2Elem.offsetWidth / 7,
	view2Elem.offsetHeight / 7,
	-view2Elem.offsetHeight / 7,
	0.1,
	100
);
orthographicCamera.aspect = canvas.clientWidth / canvas.clientHeight;
orthographicCamera.updateProjectionMatrix();
orthographicCamera.position.set(0, 0, 100);

var flyControls = new FlyControls(perspectiveCamera, view1Elem);

flyControls.movementSpeed = 25;
flyControls.domElement = view1Elem;
flyControls.rollSpeed = Math.PI / 24;
flyControls.autoForward = true;
flyControls.dragToLook = false;

function initStats() {

	var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.getElementById("Stats-output").appendChild(stats.domElement);

	return stats;
}

const controls = new OrbitControls(
	perspectiveCamera,
	view1Elem
);

const controls2 = new OrbitControls(
	orthographicCamera,
	view2Elem
);

let scene = new THREE.Scene();

// AXES helper
// const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

for (let i = 0; i < 3; ++i) {
	createAllPrimitives(i * 30);
}

function addPrimitives(geometry, x, y, z) {
	const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	scene.add(mesh);
}

function createAllPrimitives(x) {
	// BoxGeometry
	const width = 8;
	const height = 8;
	const depth = 4;
	const boxGeometry = new THREE.BoxGeometry(
		width,
		height,
		depth
	);
	addPrimitives(boxGeometry, x, 0, 0);

	// CircleGeometry
	const radius = 7;
	const segments = 16;
	const circleGeometry = new THREE.CircleGeometry(
		radius,
		segments
	);
	addPrimitives(circleGeometry, x, 0, 20);

	// ConeGeometry
	const coneRadius = 6;
	const coneHeight = 8;
	const coneRadialSegments = 16;
	const coneHeightSegments = 2;
	const coneOpenEnded = true;
	const coneThetaStart = Math.PI * 0.0;
	const coneThetaLength = Math.PI * 2.0;
	const coneGeometry = new THREE.ConeGeometry(
		coneRadius,
		coneHeight,
		coneRadialSegments,
		coneHeightSegments,
		coneOpenEnded,
		coneThetaStart,
		coneThetaLength
	);
	addPrimitives(coneGeometry, x, 0, 40);

	// CylinderGeometry
	const cylinderRadiusTop = 4;
	const cylinderRadiusBottom = 4;
	const cylinderHeight = 8;
	const cylinderRadialSegments = 12;
	const cylinderGeometry = new THREE.CylinderGeometry(
		cylinderRadiusTop,
		cylinderRadiusBottom,
		height,
		cylinderRadialSegments
	);
	addPrimitives(cylinderGeometry, x, 0, -20);

	// DodecahedronGeometry
	const dodecahedronRadius = 7;
	const dodecahedronDetail = 5;
	const dodecahedronGeometry =
	new THREE.DodecahedronGeometry(
		dodecahedronRadius,
		dodecahedronDetail
	);
	addPrimitives(dodecahedronGeometry, x, 0, -40);

	// ExtrudeGeometry
	const extrudeShape = new THREE.Shape();
	const extrudeX = -2.5;
	const extrudeY = -5;
	extrudeShape.moveTo(extrudeX + 2.5, extrudeY + 2.5);
	extrudeShape.bezierCurveTo(
		extrudeX + 2.5,
		extrudeY + 2.5,
		extrudeX + 2,
		extrudeY,
		extrudeX,
		extrudeY
	);
	extrudeShape.bezierCurveTo(
		extrudeX - 3,
		extrudeY,
		extrudeX - 3,
		extrudeY + 3.5,
		extrudeX - 3,
		extrudeY + 3.5
	);
	extrudeShape.bezierCurveTo(
		extrudeX - 3,
		extrudeY + 5.5,
		extrudeX - 1.5,
		extrudeY + 7.7,
		extrudeX + 2.5,
		extrudeY + 9.5
	);
	extrudeShape.bezierCurveTo(
		extrudeX + 6,
		extrudeY + 7.7,
		extrudeX + 8,
		extrudeY + 4.5,
		extrudeX + 8,
		extrudeY + 3.5
	);
	extrudeShape.bezierCurveTo(
		extrudeX + 8,
		extrudeY + 3.5,
		extrudeX + 8,
		extrudeY,
		extrudeX + 5,
		extrudeY
	);
	extrudeShape.bezierCurveTo(
		extrudeX + 3.5,
		extrudeY,
		extrudeX + 2.5,
		extrudeY + 2.5,
		extrudeX + 2.5,
		extrudeY + 2.5
	);
	const extrudeSettings = {
		steps: 60,
		depth: 1.0,
		bevelEnabled: true,
		bevelThickness: 0.19,
		bevelSize: 0.1,
		bevelSegments: 3,
	};
	const extrudeGeometry = new THREE.ExtrudeGeometry(
		extrudeShape,
		extrudeSettings
	);
	addPrimitives(extrudeGeometry, x, 20, 0);

	// IcosahedronGeometry
	const icosahedronRadius = 7;
	const icosahedronDetail = 0;
	const icosahedronGeometry =
	new THREE.IcosahedronGeometry(
		icosahedronRadius,
		icosahedronDetail
	);
	addPrimitives(icosahedronGeometry, x, 20, 20);

	// LatheGeometry
	const lathePoints = [];
	for (let i = 0; i < 10; ++i) {
	lathePoints.push(
		new THREE.Vector2(
		Math.sin(i * 0.2) * 3 + 3,
		(i - 5) * 0.8
		)
	);
	}
	const latheSegments = 12;
	const lathePhiStart = Math.PI * 0.25;
	const lathePhiLength = Math.PI * 2.0;
	const latheGeometry = new THREE.LatheGeometry(
		lathePoints,
		latheSegments,
		lathePhiStart,
		lathePhiLength
	);
	addPrimitives(latheGeometry, x, 20, -20);

	// OctahedronGeometry
	const octahedronRadius = 4.0;
	const octahedronDetail = 5;
	const octahedronGeometry =
	new THREE.OctahedronGeometry(
		octahedronRadius,
		octahedronDetail
	);
	addPrimitives(octahedronGeometry, x, 20, 40);

	// ParametricGeometry
	const slices = 25;
	const stacks = 25;
	const parametricGeometry = new ParametricGeometry(
	ParametricGeometries.klein,
		slices,
		stacks
	);
	addPrimitives(parametricGeometry, x, 20, -40);

	// PlaneGeometry
	const planeWidth = 9;
	const planeHeight = 9;
	const planeWidthSegments = 3;
	const planeHeightSegments = 5;
	const planeGeometry = new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeWidthSegments,
		planeHeightSegments
	);
	addPrimitives(planeGeometry, x, 40, 0);

	// PolyhedronGeometry
	const polyhedronVerticesOfCube = [
		-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1,
		-1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
	];
	const polyhedronIndicesOfFaces = [
		2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4,
		0, 1, 2, 6, 6, 5, 1, 2, 3, 7, 7, 6, 2, 4, 5, 6, 6,
		7, 4,
	];
	const polyhedronRadius = 7;
	const polyhedronDetail = 2;
	const polyhedronGeometry =
	new THREE.PolyhedronGeometry(
		polyhedronVerticesOfCube,
		polyhedronIndicesOfFaces,
		polyhedronRadius,
		polyhedronDetail
	);
	addPrimitives(polyhedronGeometry, x, 40, 20);

	// RingGeometry
	const ringInnerRadius = 2.0;
	const ringOuterRadius = 4.0;
	const ringThetaSegments = 6;
	const ringPhiSegments = 2;
	const ringThetaStart = Math.PI * 1.1;
	const ringThetaLength = Math.PI * 2.0;
	const ringGeometry = new THREE.RingGeometry(
		ringInnerRadius,
		ringOuterRadius,
		ringThetaSegments,
		ringPhiSegments,
		ringThetaStart,
		ringThetaLength
	);
	addPrimitives(ringGeometry, x, 40, -20);

	// ShapeGeometry
	const shape = new THREE.Shape();
	const z = -2.5;
	const y = -5;
	shape.moveTo(z + 2.5, y + 2.5);
	shape.bezierCurveTo(
		z + 2.5,
		y + 2.5,
		z + 2,
		y,
		z,
		y
	);
	shape.bezierCurveTo(
		z - 3,
		y,
		z - 3,
		y + 3.5,
		z - 3,
		y + 3.5
	);
	shape.bezierCurveTo(
		z - 3,
		y + 5.5,
		z - 1.5,
		y + 7.7,
		z + 2.5,
		y + 9.5
	);
	shape.bezierCurveTo(
		z + 6,
		y + 7.7,
		z + 8,
		y + 4.5,
		z + 8,
		y + 3.5
	);
	shape.bezierCurveTo(
		z + 8,
		y + 3.5,
		z + 8,
		y,
		z + 5,
		y
	);
	shape.bezierCurveTo(
		z + 3.5,
		y,
		z + 2.5,
		y + 2.5,
		z + 2.5,
		y + 2.5
	);
	const curveSegments = 20;
	const shapeGeometry = new THREE.ShapeGeometry(
		shape,
		curveSegments
	);
	addPrimitives(shapeGeometry, x, 40, 40);

	// SphereGeometry
	const sphereRadius = 7;
	const sphereWidthSegments = 12;
	const sphereHeightSegments = 14;
	const spherePhiStart = Math.PI * 0.34;
	const spherePhiLength = Math.PI * 1.0;
	const sphereThetaStart = Math.PI * 1.0;
	const sphereThetaLength = Math.PI * 1.0;
	const sphereGeometry = new THREE.SphereGeometry(
		sphereRadius,
		sphereWidthSegments,
		sphereHeightSegments,
		spherePhiStart,
		spherePhiLength,
		sphereThetaStart,
		sphereThetaLength
	);
	addPrimitives(sphereGeometry, x, 40, -40);

	// TetrahedronGeometry
	const tetrahedronRadius = 7;
	const tetrahedronDetail = 0;
	const tetrahedronGeometry =
	new THREE.TetrahedronGeometry(
		tetrahedronRadius,
		tetrahedronDetail
	);
	addPrimitives(tetrahedronGeometry, x, -20, 0);

	// TextGeometry
	const loader = new FontLoader();
	loader.load(
		"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
		(font) => {
			const text = "HYP.js";
			const textGeometry = new TextGeometry(text, {
				font: font,
				size: 3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.15,
				bevelSize: 0.3,
				bevelSegments: 5,
			});
			addPrimitives(textGeometry, x, -20, 20);
		}
	);

	// TorusGeometry
	const torusRadius = 5;
	const torusTubeRadius = 2;
	const torusRadialSegments = 30;
	const torusTubularSegments = 30;
	const torusGeometry = new THREE.TorusGeometry(
		torusRadius,
		torusTubeRadius,
		torusRadialSegments,
		torusTubularSegments
	);
	addPrimitives(torusGeometry, x, -20, -20);

	// TorusKnotGeometry
	const torusKnotRadius = 3.5;
	const torusKnotTubeRadius = 1.5;
	const torusKnotRadialSegments = 8;
	const torusKnotTubularSegments = 64;
	const torusKnotP = 2;
	const torusKnotQ = 3;
	const torusKnotGeometry =
	new THREE.TorusKnotGeometry(
		torusKnotRadius,
		torusKnotTubeRadius,
		torusKnotTubularSegments,
		torusKnotRadialSegments,
		torusKnotP,
		torusKnotQ
	);
	addPrimitives(torusKnotGeometry, x, -20, 40);

	// TubeGeometry
	class CustomSinCurve extends THREE.Curve {
		constructor(scale) {
			super();
			this.scale = scale;
		}
		getPoint(t) {
			const tx = t * 3 - 1.5;
			const ty = Math.sin(2 * Math.PI * t);
			const tz = 0;
			return new THREE.Vector3(
				tx,
				ty,
				tz
			).multiplyScalar(this.scale);
		}
	}
	const tubePath = new CustomSinCurve(4);
	const tubeTubularSegments = 20;
	const tubeRadius = 1;
	const tubeRadialSegments = 8;
	const tubeClosed = false;
	const tubeGeometry = new THREE.TubeGeometry(
		tubePath,
		tubeTubularSegments,
		tubeRadius,
		tubeRadialSegments,
		tubeClosed
	);
	addPrimitives(tubeGeometry, x, -20, -40);

	// EdgesGeometry
	const edgesRadius = 7;
	const edgesWidthSegments = 6;
	const edgesHeightSegments = 3;
	const edgesSphereGeometry =
	new THREE.SphereGeometry(
		edgesRadius,
		edgesWidthSegments,
		edgesHeightSegments
	);
	// const thresholdAngle =  1;
	const edgesGeometry = new THREE.EdgesGeometry(
		edgesSphereGeometry
	);
	const edges = new THREE.LineSegments(
		edgesGeometry,
		new THREE.LineBasicMaterial({ color: 0xffffff })
	);
	edges.position.set(x, -40, 0);
	scene.add(edges);

	// WireframeGeometry
	const wireframeSize = 8;
	const wireframeWidthSegments = 2;
	const wireframeHeightSegments = 2;
	const wireframeDepthSegments = 2;
	const wireframeGeometry =
	new THREE.WireframeGeometry(
		new THREE.BoxGeometry(
			wireframeSize,
			wireframeSize,
			wireframeSize,
			wireframeWidthSegments,
			wireframeHeightSegments,
			wireframeDepthSegments
		)
	);
	const wireframeEdges = new THREE.LineSegments(
		wireframeGeometry,
		new THREE.LineBasicMaterial({ color: 0xffffff })
	);
	wireframeEdges.position.set(x, -40, 20);
	scene.add(wireframeEdges);
}

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const pixelRatio = window.devicePixelRatio;
	const width = Math.floor(canvas.clientWidth * pixelRatio);
	const height = Math.floor(canvas.clientHeight * pixelRatio);
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
	renderer.setSize(width, height, false);
	}
	return needResize;
}

function setScissorForElement(elem) {
	const canvasRect = canvas.getBoundingClientRect();
	const elemRect = elem.getBoundingClientRect();

	// compute a canvas relative rectangle
	const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
	const left = Math.max(0, elemRect.left - canvasRect.left);
	const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
	const top = Math.max(0, elemRect.top - canvasRect.top);

	const width = Math.min(canvasRect.width, right - left);
	const height = Math.min(canvasRect.height, bottom - top);

	// setup the scissor to only render to that part of the canvas
	const positiveYUpBottom = canvasRect.height - bottom;
	renderer.setScissor(left, positiveYUpBottom, width, height);
	renderer.setViewport(left, positiveYUpBottom, width, height);

	// return the aspect
	return width / height;
}

function render(time) {
	time *= 0.0005;

	scene.traverse(object => {
		if (object instanceof THREE.Mesh) {
			object.rotation.x = time;
		}
	});

	stats.update();
	var delta = clock.getDelta();

	flyControls.update(delta);

	resizeRendererToDisplaySize(renderer);

	renderer.setScissorTest(true);

	{
		const aspect = setScissorForElement(view1Elem);

		perspectiveCamera.aspect = aspect;
		perspectiveCamera.updateProjectionMatrix();

		renderer.render(scene, perspectiveCamera);
	}

	// render from the 2nd camera
	{
		const aspect = setScissorForElement(view2Elem);

		orthographicCamera.aspect = aspect;
		orthographicCamera.updateProjectionMatrix();

		renderer.render(scene, orthographicCamera);
	}

	requestAnimationFrame(render);
}

requestAnimationFrame(render);