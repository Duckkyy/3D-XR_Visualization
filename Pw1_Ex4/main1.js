import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

var scene = new THREE.Scene();

const light1 = new THREE.AmbientLight(0xf0f0f0, 3);
light1.position.set(15, 15, 15);
const light = new THREE.SpotLight(0xffffff, 4.5);
light.position.set(0, 1500, 200);
light.angle = Math.PI * 0.2;
light.decay = 0;
light.castShadow = true;
light.shadow.camera.near = 200;
light.shadow.camera.far = 2000;
light.shadow.bias = - 0.000222;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light, light1);


var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(
    75,
    aspect,
    0.1,
    1000
);
camera.position.set(-100, 50, 150);

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

// AXES helper
// const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

// Body
const body = {
    geometry: new THREE.BoxGeometry(90, 16, 20),
    color: 0xe1b333,
    x: 0,
    y: 0,
    z: 0,
};

// frontLeftLegObj
const frontLeftJoint = {
    geometry: new THREE.CylinderGeometry(6, 6, 2, 8), // radiusTop=4, radiusBottom=4, height=2, radialSegments=7
    color: 0x1b1c17,
    x: -30,
    y: 0,
    z: 10,
    rotationX: 0.5,
};
const frontTopLegLeft = {
    geometry: new THREE.CylinderGeometry(3, 2, 32, 12),
    color: 0xe1b333,
    x: 10,
    y: 3,
    z: 10,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};
const frontBottomLegLeft = {
    geometry: new THREE.BoxGeometry(23, 2, 3),
    color: 0x1b1c17,
    x: 12,
    y: 3,
    z: 27,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};

// frontRightLegObj
const frontRightJoint = {
    geometry: new THREE.CylinderGeometry(6, 6, 2, 8), // radiusTop=4, radiusBottom=4, height=2, radialSegments=7
    color: 0x1b1c17,
    x: 30,
    y: 0,
    z: 10,
    rotationX: 0.5,
};
const frontTopLegRight = {
    geometry: new THREE.CylinderGeometry(3, 2, 32, 12),
    color: 0xe1b333,
    x: 10,
    y: 3,
    z: 10,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};
const frontBottomLegRight = {
    geometry: new THREE.BoxGeometry(23, 2, 3),
    color: 0x1b1c17,
    x: 12,
    y: 3,
    z: 27,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};

// backLeftLegObj
const backLeftJoint = {
    geometry: new THREE.CylinderGeometry(6, 6, 2, 8), // radiusTop=4, radiusBottom=4, height=2, radialSegments=7
    color: 0x1b1c17,
    x: -30,
    y: 0,
    z: -10,
    rotationX: 0.5,
};
const backTopLegLeft = {
    geometry: new THREE.CylinderGeometry(3, 2, 32, 12),
    color: 0xe1b333,
    x: 10,
    y: -3,
    z: 10,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};
const backBottomLegLeft = {
    geometry: new THREE.BoxGeometry(23, 2, 3),
    color: 0x1b1c17,
    x: 12,
    y: -3,
    z: 27,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};

// backRightLegObj
const backRightJoint = {
    geometry: new THREE.CylinderGeometry(6, 6, 2, 8), // radiusTop=4, radiusBottom=4, height=2, radialSegments=7
    color: 0x1b1c17,
    x: 30,
    y: 0,
    z: -10,
    rotationX: 0.5,
};
const backTopLegRight = {
    geometry: new THREE.CylinderGeometry(3, 2, 32, 12),
    color: 0xe1b333,
    x: 10,
    y: -3,
    z: 10,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};
const backBottomLegRight = {
    geometry: new THREE.BoxGeometry(23, 2, 3),
    color: 0x1b1c17,
    x: 12,
    y: -3,
    z: 27,
    rotationX: -90 / 180,
    rotationZ: 45 / 180,
};

const armRotator = {
    geometry: new THREE.CylinderGeometry(5, 5, 2, 4),
    color: 0x1b1c17,
    x: -25,
    y: 9,
    z: 0,
};

const arm1 = {
    geometry: new THREE.BoxGeometry(3, 25, 3),
    color: 0xe1b333,
    x: 0,
    y: 12,
    z: 0,
};

const armJoint1 = {
    geometry: new THREE.IcosahedronGeometry(3, 5),
    color: 0x1b1c17,
    x: 0,
    y: 1,
    z: 0,
};

const armJoint2 = {
    geometry: new THREE.IcosahedronGeometry(3, 5),
    color: 0x1b1c17,
    x: 0,
    y: 22.5,
    z: 0,
};

const arm2 = {
    geometry: new THREE.BoxGeometry(3, 25, 3),
    color: 0xe1b333,
    x: -12,
    y: 0,
    z: 0,
    rotationZ: 0.5,
};

const handJoint1 = {
    geometry: new THREE.CylinderGeometry(1, 1, 4, 50),
    color: 0x1b1c17,
    x: -23,
    y: 0,
    z: 0,
    rotationZ: 0.5,
};

const hand = {
    geometry: new THREE.SphereGeometry(3, 4, 1, Math.PI * 2.2, Math.PI * 1.6, Math.PI * 0.3, Math.PI * 0.3),
    color: 0xe1b333,
    x: 0,
    y: 5,
    z: 0,
    rotationZ: -0.5,
};

const bodyMesh = createMesh(body.geometry, body.color, body.x, body.y, body.z, body.rotationX, body.rotationY, body.rotationZ);

// frontLeftLegObj
const frontLeftLegObj = [frontTopLegLeft, frontBottomLegLeft];
let frontLeftLegMesh = createMesh(frontLeftJoint.geometry, frontLeftJoint.color, frontLeftJoint.x, frontLeftJoint.y, frontLeftJoint.z, frontLeftJoint.rotationX, frontLeftJoint.rotationY, frontLeftJoint.rotationZ);

for (let i = 0; i < frontLeftLegObj.length; i++) {
    let mesh = createMesh(
        frontLeftLegObj[i].geometry,
        frontLeftLegObj[i].color,
        frontLeftLegObj[i].x,
        frontLeftLegObj[i].y,
        frontLeftLegObj[i].z,
        frontLeftLegObj[i].rotationX,
        frontLeftLegObj[i].rotationY,
        frontLeftLegObj[i].rotationZ
    );
    frontLeftLegMesh.add(mesh);
}

// frontRightLegObj
const frontRightLegObj = [frontTopLegRight, frontBottomLegRight];
let frontRightLegMesh = createMesh(frontRightJoint.geometry, frontRightJoint.color, frontRightJoint.x, frontRightJoint.y, frontRightJoint.z, frontRightJoint.rotationX, frontRightJoint.rotationY, frontRightJoint.rotationZ);

for (let i = 0; i < frontRightLegObj.length; i++) {
    let mesh = createMesh(
        frontRightLegObj[i].geometry,
        frontRightLegObj[i].color,
        frontRightLegObj[i].x,
        frontRightLegObj[i].y,
        frontRightLegObj[i].z,
        frontRightLegObj[i].rotationX,
        frontRightLegObj[i].rotationY,
        frontRightLegObj[i].rotationZ
    );
    frontRightLegMesh.add(mesh);
}

// backLeftLegObj
const backLeftLegObj = [backTopLegLeft, backBottomLegLeft];
let backLeftLegMesh = createMesh(backLeftJoint.geometry, backLeftJoint.color, backLeftJoint.x, backLeftJoint.y, backLeftJoint.z, backLeftJoint.rotationX, backLeftJoint.rotationY, backLeftJoint.rotationZ);

for (let i = 0; i < backLeftLegObj.length; i++) {
    let mesh = createMesh(
        backLeftLegObj[i].geometry,
        backLeftLegObj[i].color,
        backLeftLegObj[i].x,
        backLeftLegObj[i].y,
        backLeftLegObj[i].z,
        backLeftLegObj[i].rotationX,
        backLeftLegObj[i].rotationY,
        backLeftLegObj[i].rotationZ
    );
    backLeftLegMesh.add(mesh);
}

// backRightLegObj
const backRightLegObj = [backTopLegRight, backBottomLegRight];
let backRightLegMesh = createMesh(backRightJoint.geometry, backRightJoint.color, backRightJoint.x, backRightJoint.y, backRightJoint.z, backRightJoint.rotationX, backRightJoint.rotationY, backRightJoint.rotationZ);

for (let i = 0; i < backRightLegObj.length; i++) {
    let mesh = createMesh(
        backRightLegObj[i].geometry,
        backRightLegObj[i].color,
        backRightLegObj[i].x,
        backRightLegObj[i].y,
        backRightLegObj[i].z,
        backRightLegObj[i].rotationX,
        backRightLegObj[i].rotationY,
        backRightLegObj[i].rotationZ
    );
    backRightLegMesh.add(mesh);
}

let armMesh = createMesh(armRotator.geometry, armRotator.color, armRotator.x, armRotator.y, armRotator.z, armRotator.rotationX, armRotator.rotationY, armRotator.rotationZ);
let arm1Mesh = createMesh(arm1.geometry, arm1.color, arm1.x, arm1.y, arm1.z, arm1.rotationX, arm1.rotationY, arm1.rotationZ);
let arm2Mesh = createMesh(arm2.geometry, arm2.color, arm2.x, arm2.y, arm2.z, arm2.rotationX, arm2.rotationY, arm2.rotationZ);
let armJoint1Mesh = createMesh(armJoint1.geometry, armJoint1.color, armJoint1.x, armJoint1.y, armJoint1.z, armJoint1.rotationX, armJoint1.rotationY, armJoint1.rotationZ);
let armJoint2Mesh = createMesh(armJoint2.geometry, armJoint2.color, armJoint2.x, armJoint2.y, armJoint2.z, armJoint2.rotationX, armJoint2.rotationY, armJoint2.rotationZ);
let handMesh = createMesh(hand.geometry, hand.color, hand.x, hand.y, hand.z, hand.rotationX, hand.rotationY, hand.rotationZ);
let handJoint1Mesh = createMesh(handJoint1.geometry, handJoint1.color, handJoint1.x, handJoint1.y, handJoint1.z, handJoint1.rotationX, handJoint1.rotationY, handJoint1.rotationZ);

armMesh.add(armJoint1Mesh);
armJoint1Mesh.add(arm1Mesh, armJoint2Mesh);
armJoint2Mesh.add(arm2Mesh, handJoint1Mesh, handMesh);
handJoint1Mesh.add(handMesh);

const partsMesh = [bodyMesh, armMesh, frontLeftLegMesh, frontRightLegMesh, backLeftLegMesh, backRightLegMesh]

for (let i = 0; i < partsMesh.length; i++) {
    scene.add(partsMesh[i]);
}

function createMesh(geometry, color, x, y, z, rotationX, rotationY, rotationZ) {
    const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: color,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    if (rotationX) {
        mesh.rotation.x = Math.PI * rotationX;
    }

    if (rotationY) {
        mesh.rotation.y = Math.PI * rotationY;
    }

    if (rotationZ) {
        mesh.rotation.z = Math.PI * rotationZ;
    }
    return mesh;
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const xOffset = 0;
const zOffset = 0;
const spacing = 10;
const gridRows = 50;

for (let x = -gridRows / 2; x < gridRows; x++) {
    for (let z = -gridRows / 2; z < gridRows; z++) {
        createMarks(xOffset + x * spacing, zOffset + z * spacing, spacing / 3, xOffset, zOffset);
    }
}

function createMarks(x, z, size, xOffset, zOffset) {
    const opacity = calculateOpacity(x, z, xOffset, zOffset);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: opacity
    });

    createCross(x - size / 2, x + size / 2, z, -35, z, lineMaterial);
    createCross(x, x, z - size / 2, -35, z + size / 2, lineMaterial);
}

function createCross(startX, endX, startZ, y, endZ, material) {
    const points = [
        new THREE.Vector3(startX, y, startZ),
        new THREE.Vector3(endX, y, endZ)
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, material);
    scene.add(line);
}

function calculateOpacity(x, z, xOffset, zOffset) {
    const distance = Math.sqrt((x - xOffset) ** 2 + (z - zOffset) ** 2);
    return 1 - distance / 150;
}

function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    time *= 0.001;
    armMesh.rotation.y = time;
    armJoint1Mesh.rotation.z = 1 / 2.5 * Math.PI * (Math.cos(time));
    armJoint2Mesh.rotation.y = Math.PI / 3 * (Math.cos(time) - Math.PI / 2);
    handJoint1Mesh.rotation.x = time;

    frontLeftLegMesh.rotation.y = 1 / 6 * Math.PI * (Math.cos(time)) + 1 / 15 * Math.PI;
    backRightLegMesh.rotation.y = 1 / 6 * Math.PI * (Math.cos(time)) + 1 / 15 * Math.PI;

    frontRightLegMesh.rotation.y = -(1 / 6 * Math.PI * (Math.cos(time)) - 1 / 15 * Math.PI);
    backLeftLegMesh.rotation.y = -(1 / 6 * Math.PI * (Math.cos(time)) - 1 / 15 * Math.PI);

    for (let i = 0; i < partsMesh.length; i++) {
        partsMesh[i].position.x -= 0.1;
    }

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
