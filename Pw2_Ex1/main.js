import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

var scene = new THREE.Scene();

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const canvas = document.querySelector('#c');

const renderer = new THREE.WebGLRenderer(
    { antialias: true, canvas }
);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

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

// AXES helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

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