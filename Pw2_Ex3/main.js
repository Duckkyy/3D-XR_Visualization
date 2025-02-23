import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { XYZLoader } from "three/examples/jsm/Addons.js";

// Scene
var scene = new THREE.Scene();


// Render
const canvas = document.querySelector('#c');

const renderer = new THREE.WebGLRenderer(
    { antialias: true, canvas }
);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


// Camera
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.updateProjectionMatrix();
camera.position.set(0, 0, 40);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);


// GUI
const gui = new GUI();

let obj = {
    leftBoard: 0xff0000, 
    rightBoard: 0x00ff00,
    topBoard: 0x6a6b6c,
    frontBoard: 0x6a6b6c,
    bottomBoard: 0x6a6b6c,
    additionalLight: 'None',
    ambientLightEnable: true,
}

let wallFolder = gui.addFolder( 'Wall' );
wallFolder.addColor( obj, 'frontBoard' ).onChange( value => {
    frontBoardMesh.material.color.set(value)
} );
wallFolder.addColor( obj, 'leftBoard' ).onChange( value => {
    leftBoardMesh.material.color.set(value)
} );
wallFolder.addColor( obj, 'rightBoard' ).onChange( value => {
    rightBoardMesh.material.color.set(value)
} );
wallFolder.addColor( obj, 'topBoard' ).onChange( value => {
    topBoardMesh.material.color.set(value)
} );
wallFolder.addColor( obj, 'bottomBoard' ).onChange( value => {
    bottomBoardMesh.material.color.set(value)
} );
wallFolder.close()

// Lights
const lightTypes = {
    'None': undefined,
    'directionalLight': new THREE.DirectionalLight(0xFFFFFF, 1),
    'pointLight': new THREE.PointLight(0xFFFFFF, 1),
    'spotLight': new THREE.SpotLight(0xFFFFFF, 1), 
    'hemisphereLight': new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 1)
}
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

let secondLight;
let secondLightFolder;

function addPositionControls(folder, object, label = 'position') {
    const positionFolder = folder.addFolder(label);
    positionFolder.add(object.position, 'x', -10, 10, 0.1);
    positionFolder.add(object.position, 'y', -10, 10, 0.1);
    positionFolder.add(object.position, 'z', -10, 10, 0.1);
}

function addTargetControls(folder, light) {
    const target = light.target;
    scene.add(target); // Ensure target is added to the scene
    addPositionControls(folder, target, 'target position');
}

class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
}

// Add dropdown to select light
gui.add(obj, 'additionalLight', Object.keys(lightTypes)).onChange((value) => {
    if (value === "None") {
        scene.remove(secondLight);
        secondLight = undefined;
        additionalLightFolder.destroy();
        return
    }
    if (secondLight){
        scene.remove(secondLight);
    } 
    secondLight = lightTypes[value];
    scene.add(secondLight);

    if (secondLightFolder){
        secondLightFolder.destroy();
    }
    
    secondLightFolder = gui.addFolder(value);
    secondLightFolder.add(secondLight, 'intensity', 0, 100, 0.1);
    if (value == "hemisphereLight") {  
        secondLightFolder.addColor(new ColorGUIHelper(secondLight, 'color'), 'value').name('skyColor');
        secondLightFolder.addColor(new ColorGUIHelper(secondLight, 'groundColor'), 'value').name('groundColor');
    }
    else {
        secondLightFolder.addColor(new ColorGUIHelper(secondLight, 'color'), 'value').name('color');
    }

    // Add position controls
    if (secondLight.position) {
        addPositionControls(secondLightFolder, secondLight);
    }

    // Add target controls (just directional and spot lights)
    if (secondLight.target) {
        addTargetControls(secondLightFolder, secondLight);
    }
});

let ambientLightFolder = gui.addFolder( 'ambientLight' );
ambientLightFolder.add(obj, "ambientLightEnable").name("Enable").onChange((value) => {
    ambientLight.visible = value;
});
ambientLightFolder.add(ambientLight, 'intensity', 0, 100, 0.1);
ambientLightFolder.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
addPositionControls(ambientLightFolder, ambientLight);
ambientLightFolder.close();


// AXES helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


// Geometry
const frontBoardMesh = createMesh(
    new THREE.PlaneGeometry(30, 10), 0x6a6b6c,
    0, 0, 0,
    THREE.FrontSide
);

const leftBoardMesh = createMesh(
    new THREE.PlaneGeometry(24, 10), 0xff0000,
    -15, 0, 12,
    THREE.FrontSide,
    0, 90, 0
);

const rightBoardMesh = createMesh(
    new THREE.PlaneGeometry(24, 10), 0x00ff00,
    15, 0, 12,
    THREE.BackSide,
    0, 90, 0
);

const topBoardMesh = createMesh(
    new THREE.PlaneGeometry(30, 24), 0x6a6b6c,
    0, 5, 12,
    THREE.FrontSide,
    90, 0, 0
);

const bottomBoardMesh = createMesh(
    new THREE.PlaneGeometry(30, 24), 0x6a6b6c,
    0, -5, 12,
    THREE.BackSide,
    90, 0, 0
);

function createTableMesh(x, y, z, rotation) {
    const tableMesh = new THREE.Group();
    let tableDepth = 3;
    let tableZ = 5;
    if (!rotation) {
        tableDepth = 5;
        tableZ = 6;
    }
    const tableTopMesh = createMesh(
        new THREE.BoxGeometry(10, 0.5, tableDepth), 0xffffff,
        0, -2, tableZ
    );
    const tableLeg1 = createMesh(
        new THREE.CylinderGeometry(0.3, 0.3, 3, 32), 0xffffff,
        -4, -3.5, 6
    );
    const tableLeg2 = createMesh(
        new THREE.CylinderGeometry(0.3, 0.3, 3, 32), 0xffffff,
        4, -3.5, 6
    );
    const tableLeg3 = createMesh(
        new THREE.CylinderGeometry(0.3, 0.3, 3, 32), 0xffffff,
        -4, -3.5, 4
    );
    const tableLeg4 = createMesh(
        new THREE.CylinderGeometry(0.3, 0.3, 3, 32), 0xffffff,
        4, -3.5, 4
    );
    tableMesh.add(tableTopMesh, tableLeg1, tableLeg2, tableLeg3, tableLeg4);

    if (rotation) {
        tableMesh.rotation.y = Math.PI / 2;
    }
    tableMesh.position.set(x, y, z);

    return tableMesh;
};

const table1Mesh = createTableMesh(0, 0, 0);
const table2Mesh = createTableMesh(1.5, 0, 8.5, true);
const table3Mesh = createTableMesh(-10.5, 0, 8.5, true);
const table4Mesh = createTableMesh(1.5, 0, 18.5, true);
const table5Mesh = createTableMesh(-10.5, 0, 18.5, true);
const tableMeshes = [table1Mesh, table2Mesh, table3Mesh, table4Mesh, table5Mesh]

function createChairMesh(x, y, z, rotation) {
    const chairMesh = new THREE.Group();
    const seatMesh = createMesh(
        new THREE.BoxGeometry(2.5, 0.3, 2.5), 0xffffff,
        10, -3.5, 8.5
    );
    const chair1LegMesh = createMesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32), 0xffffff,
        9, -4.25, 7.5
    );
    const chair2LegMesh = createMesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32), 0xffffff,
        11, -4.25, 7.5
    );
    const chair3LegMesh = createMesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32), 0xffffff,
        9, -4.25, 9.5
    );
    const chair4LegMesh = createMesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32), 0xffffff,
        11, -4.25, 9.5
    );
    const backRestMesh = createMesh(
        new THREE.BoxGeometry(0.3, 3, 2.5), 0xffffff,
        11.25, -2.25, 8.5
    );
    chairMesh.add(seatMesh, chair1LegMesh, chair2LegMesh, chair3LegMesh, chair4LegMesh, backRestMesh);

    chairMesh.position.set(x, y, z);
    if (rotation) {
        chairMesh.rotation.y = Math.PI;
    };

    return chairMesh;
};

const chair1Mesh = createChairMesh(0, 0, 0);
const chair2Mesh = createChairMesh(0, 0, 17.5, true);
const chair3Mesh = createChairMesh(0, 0, 9.5);
const chair4Mesh = createChairMesh(0, 0, 26, true);

const chairMeshes = [chair1Mesh, chair2Mesh, chair3Mesh, chair4Mesh]
chairMeshes.forEach(mesh => {
    scene.add(mesh);
});

scene.add(frontBoardMesh, leftBoardMesh, rightBoardMesh, topBoardMesh, bottomBoardMesh);
tableMeshes.forEach(mesh => {
    scene.add(mesh);
});

// Cone
const coneGeometry = new THREE.ConeGeometry(1.2, 4, 50, 1.8, false, Math.PI * 2.00, Math.PI * 2.00);
const coneMesh = new THREE.Mesh(
    coneGeometry,
    new THREE.MeshLambertMaterial({
    color: 0x3ff7c3,
}));
coneMesh.position.set(-2, 0, 5);

// Cylinder
const CylinderGeometry = new THREE.CylinderGeometry(1.4, 1.4, 2.2, 50);
const cylinderMesh = new THREE.Mesh(CylinderGeometry, new THREE.MeshPhongMaterial({ color: 0xf02e21 }));
cylinderMesh.position.set(2, -0.7, 5);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.9, 30, 30);
const sphereMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshPhysicalMaterial({ color: 0x6699ff }));
sphereMesh.position.set(0, -0.9, 7);

scene.add(frontBoardMesh, leftBoardMesh, rightBoardMesh, topBoardMesh, bottomBoardMesh);
scene.add(coneMesh, cylinderMesh, sphereMesh);

function createMesh(geometry, color, x, y, z, sideView, rotationX, rotationY, rotationZ) {
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
    });

    if (sideView) {
        material.side = sideView;
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    if (rotationX) {
        mesh.rotation.x = rotationX * Math.PI / 180;
    }
    if (rotationY) {
        mesh.rotation.y = rotationY * Math.PI / 180;
    }
    if (rotationZ) {
        mesh.rotation.z = rotationZ * Math.PI / 180;
    }

    return mesh;
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize =
    canvas.width !== width ||
    canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);