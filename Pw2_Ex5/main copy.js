import * as THREE from "three";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { clearcoat, clearcoatRoughness, emissive, iridescence, iridescenceIOR, metalness, roughness, sheen, sheenRoughness, vertexColor } from "three/tsl";
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
camera.position.set(0, 0, 20);

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
}

// Wall
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
let lightFolder = gui.addFolder('Light');
lightFolder.close();

const lightTypes = {
    'None': undefined,
    'directionalLight': new THREE.DirectionalLight(0xFFFFFF, 1),
    // 'pointLight': new THREE.PointLight(0xFFFFFF, 1),
    'spotLight': new THREE.SpotLight(0xFFFFFF, 1), 
    'hemisphereLight': new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 1)
}
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

let pointLight = new THREE.PointLight(0xFFFFFF, 1);
scene.add(pointLight)

let additionalLight;
let additionalLightFolder;

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
lightFolder.add(obj, 'additionalLight', Object.keys(lightTypes)).onChange((value) => {
    if (value === "None") {
        scene.remove(additionalLight);
        additionalLight = undefined
        return
    }
    if (additionalLight){
        scene.remove(additionalLight);
    } 
    additionalLight = lightTypes[value];
    scene.add(additionalLight);

    if (additionalLightFolder){
        additionalLightFolder.destroy();
    }
    
    additionalLightFolder = lightFolder.addFolder(value);
    additionalLightFolder.add(additionalLight, 'intensity', 0, 5, 0.01);
    if (value == "hemisphereLight") {  
        additionalLightFolder.addColor(new ColorGUIHelper(additionalLight, 'color'), 'value').name('skyColor');
        additionalLightFolder.addColor(new ColorGUIHelper(additionalLight, 'groundColor'), 'value').name('groundColor');
    }
    else {
        additionalLightFolder.addColor(new ColorGUIHelper(additionalLight, 'color'), 'value').name('color');
    }

    // Add position controls
    if (additionalLight.position) {
        addPositionControls(additionalLightFolder, additionalLight);
    }

    // Add target controls (just directional and spot lights)
    if (additionalLight.target) {
        addTargetControls(additionalLightFolder, additionalLight);
    }
});

let ambientLightFolder = lightFolder.addFolder( 'ambientLight' );
ambientLightFolder.add(ambientLight, 'intensity', 0, 5, 0.01);
ambientLightFolder.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
addPositionControls(ambientLightFolder, ambientLight);
ambientLightFolder.close();

const rectLightLeft = new THREE.RectAreaLight(0xff0000, 3, 8, 10);
rectLightLeft.position.set(-5.999, 0, 4);
rectLightLeft.lookAt(0, 0, 4);

const rectLightRight = new THREE.RectAreaLight(0x00ff00, 3, 8, 10);
rectLightRight.position.set(5.99, 0, 4);
rectLightRight.lookAt(0, 0, 4);

let pointLightFolder = lightFolder.addFolder( 'pointLight' );
pointLightFolder.add(pointLight, 'intensity', 0, 5, 0.01);
pointLightFolder.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
addPositionControls(pointLightFolder, pointLight);
pointLightFolder.close();

// AXES helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


// Geometry
const frontBoardMesh = createMesh(
    new THREE.PlaneGeometry(12, 10), 0x6a6b6c,
    0, 0, 0,
    THREE.FrontSide
);

const leftBoardMesh = createMesh(
    new THREE.PlaneGeometry(8, 10), 0xff0000,
    -6, 0, 4,
    THREE.FrontSide,
    0, 90, 0
);

const rightBoardMesh = createMesh(
    new THREE.PlaneGeometry(8, 10), 0x00ff00,
    6, 0, 4,
    THREE.BackSide,
    0, 90, 0
);

const topBoardMesh = createMesh(
    new THREE.PlaneGeometry(12, 8), 0x6a6b6c,
    0, 5, 4,
    THREE.FrontSide,
    90, 0, 0
);

const bottomBoardMesh = createMesh(
    new THREE.PlaneGeometry(12, 8), 0x6a6b6c,
    0, -5, 4,
    THREE.BackSide,
    90, 0, 0
);

const table = createMesh(
    new THREE.BoxGeometry(8, 2, 6), 0x7f8389,
    0, -4, 4
);

// Cone
const coneGeometry = new THREE.ConeGeometry(1.2, 4, 50, 1.8, false, Math.PI * 2.00, Math.PI * 2.00);
const coneMesh = new THREE.Mesh(
    coneGeometry,
    new THREE.MeshLambertMaterial({
    color: 0x3ff7c3,
}));
coneMesh.position.set(-2, -1, 3);

// Cylinder
const CylinderGeometry = new THREE.CylinderGeometry(1.4, 1.4, 2.2, 50);
const cylinderMesh = new THREE.Mesh(CylinderGeometry, new THREE.MeshPhongMaterial({ color: 0xf02e21 }));
cylinderMesh.position.set(2, -1.9, 3);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.9, 30, 30);
const sphereMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshPhysicalMaterial({ color: 0x6699ff }));
sphereMesh.position.set(0, -2.1, 5);

scene.add(frontBoardMesh, leftBoardMesh, rightBoardMesh, topBoardMesh, bottomBoardMesh, table);
scene.add(coneMesh, cylinderMesh, sphereMesh);

// Material
let materialFolder = gui.addFolder("Material");
let meshes = [coneMesh, cylinderMesh, sphereMesh]


// Common Material Properties
const commonSettings = {
    transparent: false,
    opacity: 1,
    depthTest: false,
    depthWhite: false,
    alphaTest: 1,
    alphaHash: false,
    visible: true,
    side: "FrontSide"
};
let commonMaterialFolder = materialFolder.addFolder("Common")
commonMaterialFolder.add(commonSettings, 'transparent').name('transparent').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.transparent = value;
    }
});
commonMaterialFolder.add(commonSettings, 'opacity', 0, 1, 0.01).name('opacity').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.opacity = value;
    }
});
commonMaterialFolder.add(commonSettings, 'depthTest').name('depthTest').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.depthTest = value;
    }
});
commonMaterialFolder.add(commonSettings, 'depthWhite').name('depthWhite').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.depthWhite = value;
    }
});
commonMaterialFolder.add(commonSettings, 'alphaTest', 0, 1, 0.01).name('alphaTest').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.alphaTest = value;
    }
});
commonMaterialFolder.add(commonSettings, 'alphaHash').name('alphaHash').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.alphaHash = value;
    }
});
commonMaterialFolder.add(commonSettings, 'visible').name('visible').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.visible = value;
    }
});
const sideTypes = {
    "frontSide": THREE.FrontSide,
    "backSide": THREE.BackSide,
    "doubleSide": THREE.DoubleSide,
}
commonMaterialFolder.add(commonSettings, 'side', Object.keys(sideTypes)).name('side').onChange((value) => {
    for(let i = 0; i < meshes.length; i++) {
        meshes[i].material.side = sideTypes[value];
    }
});
commonMaterialFolder.close()

// Phong Material
const phongSettings = {
    color: 0xf02e21,
    emission: 0x000000,
    specular: 0x111111,
    shininess: 30,
    flatShading: false,
    wireFrame: false,
    vertexColor: false,
    fog: false,
    envMaps: "none",
    map: "none",
    alphaMap: "none",
    combine: "MultipleOperation",
    reflectivity: 1,
    refractionRatio: 0.98
};
const phongMaterialFolder = materialFolder.addFolder("Phong");
phongMaterialFolder.addColor(phongSettings, "color").name("color").onChange((value) => {
    cylinderMesh.material.color.set(value);
})
phongMaterialFolder.addColor(phongSettings, "emission").name("emission").onChange((value) => {
    cylinderMesh.material.emissive.set(value);
})
phongMaterialFolder.addColor(phongSettings, "specular").name("specular").onChange((value) => {
    cylinderMesh.material.specular.set(value);
})
phongMaterialFolder.add(phongSettings, 'shininess', 0, 100, 0.1).name('shininess').onChange((value) => {
    cylinderMesh.material.shininess = value;
});
phongMaterialFolder.add(phongSettings, 'flatShading').name('flatShading').onChange((value) => {
    cylinderMesh.material.flatShading = value;
    cylinderMesh.material.needsUpdate = true;
});
phongMaterialFolder.add(phongSettings, 'wireFrame').name('wireFrame').onChange((value) => {
    cylinderMesh.material.wireframe = value;
});
phongMaterialFolder.add(phongSettings, 'vertexColor').name('vertexColor').onChange((value) => {
    cylinderMesh.material.vertexColors = value;
    cylinderMesh.material.needsUpdate = true;
});
phongMaterialFolder.add(phongSettings, 'fog').name('fog').onChange((value) => {
    cylinderMesh.material.fog = value;
});
const envMaps = ["none", "reflection", "refraction"]
const textureLoader = new THREE.TextureLoader();
let phongMap = textureLoader.load('brick.jpeg');
phongMap.colorSpace = THREE.SRGBColorSpace;
phongMaterialFolder.add(phongSettings, "envMaps", envMaps).onChange(value => {
    if (value == "none") {
        cylinderMesh.material.envMap = null;
    }
    if (value == "reflection") {
        phongMap.mapping = THREE.EquirectangularReflectionMapping;
        cylinderMesh.material.envMap = phongMap;
    }
    if (value == "refraction") {
        phongMap.mapping = THREE.EquirectangularRefractionMapping;
        cylinderMesh.material.envMap = phongMap;
    }
    cylinderMesh.material.needsUpdate = true;
})
const brickTexture = new THREE.TextureLoader().load('brick.jpeg');
phongMaterialFolder.add(phongSettings, "map", ["none", "brick"]).onChange(value => {
    if (value == "none") {
        cylinderMesh.material.map = null;
    }
    if (value == "brick") {
        cylinderMesh.material.map = brickTexture;
    }
    cylinderMesh.material.needsUpdate = true;
})
const fibreTexture = new THREE.TextureLoader().load('fibres.jpg');
phongMaterialFolder.add(phongSettings, 'alphaMap', ['none', 'fibre']).onChange(value => {
    if (value == "none") {
        cylinderMesh.material.alphaMap = null;
    }
    if (value == "fibre") {
        cylinderMesh.material.alphaMap = fibreTexture;
    }
    cylinderMesh.material.needsUpdate = true;
});
phongMaterialFolder.add(phongSettings, 'combine', ['MultiplyOperation', 'MixOperation', 'AddOperation']).onChange(value => {
    let combine = THREE[value];
    cylinderMesh.material.combine = combine;
    cylinderMesh.material.needsUpdate = true;
});
phongMaterialFolder.add(phongSettings, 'reflectivity', 0, 1, 0.01).onChange(value => {
    cylinderMesh.material.reflectivity = value;
    cylinderMesh.material.needsUpdate = true;
})
phongMaterialFolder.add(phongSettings, 'refractionRatio', 0, 1, 0.01).onChange(value => {
    cylinderMesh.material.refractionRatio = value;
    cylinderMesh.material.needsUpdate = true;
});
phongMaterialFolder.close();

// Lambert Material
const lambertSettings = {
    color: 0x3ff7c3,
    emissive: 0x000000,
    wireFrame: false,
    vertexColors: false,
    fog: false,
    envMaps: "none",
    map: "none",
    alphaMap: "none",
    combine: "MultipleOperation",
    reflectivity: 1,
    refractionRatio: 0.98
}
const lambertMaterialFolder = materialFolder.addFolder("Lambert");
lambertMaterialFolder.addColor(lambertSettings, "color").name("color").onChange((value) => {
    coneMesh.material.color.set(value);
})
lambertMaterialFolder.addColor(lambertSettings, "emissive").name("emissive").onChange((value) => {
    coneMesh.material.emissive.set(value);
})
lambertMaterialFolder.add(lambertSettings, 'wireFrame').name('wireFrame').onChange((value) => {
    coneMesh.material.wireframe = value;
});
lambertMaterialFolder.add(lambertSettings, 'vertexColors').name('vertexColors').onChange((value) => {
    coneMesh.material.vertexColors = value;
    coneMesh.material.needsUpdate = true;
});
lambertMaterialFolder.add(lambertSettings, 'fog').name('fog').onChange((value) => {
    coneMesh.material.fog = value;
});
let lambertMap = textureLoader.load('brick.jpeg');
lambertMap.colorSpace = THREE.SRGBColorSpace;
lambertMaterialFolder.add(lambertSettings, "envMaps", envMaps).onChange(value => {
    if (value == "none") {
        coneMesh.material.envMap = null;
    }
    if (value == "reflection") {
        lambertMap.mapping = THREE.EquirectangularReflectionMapping;
        coneMesh.material.envMap = lambertMap;
    }
    if (value == "refraction") {
        lambertMap.mapping = THREE.EquirectangularRefractionMapping;
        coneMesh.material.envMap = lambertMap;
    }
    coneMesh.material.needsUpdate = true;
})
lambertMaterialFolder.add(lambertSettings, "map", ["none", "brick"]).onChange(value => {
    if (value == "none") {
        coneMesh.material.map = null;
    }
    if (value == "brick") {
        coneMesh.material.map = brickTexture;
    }
    coneMesh.material.needsUpdate = true;
})
lambertMaterialFolder.add(lambertSettings, 'alphaMap', ['none', 'fibre']).onChange(value => {
    if (value == "none") {
        coneMesh.material.alphaMap = null;
    }
    if (value == "fibre") {
        coneMesh.material.alphaMap = fibreTexture;
    }
    coneMesh.material.needsUpdate = true;
});
lambertMaterialFolder.add(lambertSettings, 'combine', ['MultiplyOperation', 'MixOperation', 'AddOperation']).onChange(value => {
    let combine = THREE[value];
    coneMesh.material.combine = combine;
    coneMesh.material.needsUpdate = true;
});
lambertMaterialFolder.add(lambertSettings, 'reflectivity', 0, 1, 0.01).onChange(value => {
    coneMesh.material.reflectivity = value;
    coneMesh.material.needsUpdate = true;
})
lambertMaterialFolder.add(lambertSettings, 'refractionRatio', 0, 1, 0.01).onChange(value => {
    coneMesh.material.refractionRatio = value;
    coneMesh.material.needsUpdate = true;
});
lambertMaterialFolder.close();

// Mesh Physical Material
const physicalSettings = {
    color: 0x6699ff,
    emissive: 0x000000,
    roughness: 1,
    metalness: 0,
    ior: 1.5,
    reflectivity: 1,
    iridescence: 1,
    iridescenceIOR: 1.3,
    sheen: 0,
    sheenRoughness: 1,
    sheenColor: 0x000000,
    clearcoat: 0,
    clearcoatRoughness: 0,
    specularIntensity: 1,
    specularColor: 0xffffff,
    flatShading: false,
    wireframe: false,
    vertexColors: false,
    fog: true,
    envMaps: "none",
    map: "none",
    roughnessMap: "none",
    alphaMap: "none",
    metalnessMap: "none",
    iridescenceMap: "none"
}
const physicalMaterialFolder = materialFolder.addFolder("MeshPhysical");
physicalMaterialFolder.addColor(physicalSettings, "color").name("color").onChange((value) => {
    sphereMesh.material.color.set(value);
});
physicalMaterialFolder.addColor(physicalSettings, "emissive").name("emissive").onChange((value) => {
    sphereMesh.material.emissive.set(value);
});
physicalMaterialFolder.add(physicalSettings, 'roughness', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.roughness = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'metalness', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.metalness = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'ior', 1, 2, 0.01).onChange(value => {
    sphereMesh.material.ior = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'reflectivity', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.reflectivity = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'iridescence', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.iridescence = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'iridescenceIOR', 1, 2, 0.01).onChange(value => {
    sphereMesh.material.iridescenceIOR = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'sheen', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.sheen = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'sheenRoughness', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.sheenRoughness = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.addColor(physicalSettings, "sheenColor").name("color").onChange((value) => {
    sphereMesh.material.sheenColor.set(value);
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'clearcoat', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.clearcoat = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'clearcoatRoughness', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.clearcoatRoughness = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'specularIntensity', 0, 1, 0.01).onChange(value => {
    sphereMesh.material.specularIntensity = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.addColor(physicalSettings, "specularColor").name("color").onChange((value) => {
    sphereMesh.material.specularColor.set(value);
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'wireframe').name('wireframe').onChange((value) => {
    sphereMesh.material.wireframe = value;
});
physicalMaterialFolder.add(physicalSettings, 'flatShading').name('flatShading').onChange((value) => {
    sphereMesh.material.flatShading = value;
});
physicalMaterialFolder.add(physicalSettings, 'vertexColors').name('vertexColors').onChange((value) => {
    sphereMesh.material.vertexColors = value;
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, 'fog').name('fog').onChange((value) => {
    sphereMesh.material.fog = value;
    sphereMesh.material.needsUpdate = true;
});
let physicalMap = textureLoader.load('brick.jpeg');
physicalMap.colorSpace = THREE.SRGBColorSpace;
physicalMaterialFolder.add(physicalSettings, "envMaps", envMaps).onChange(value => {
    if (value == "none") {
        sphereMesh.material.envMap = null;
    }
    if (value == "reflection") {
        physicalMap.mapping = THREE.EquirectangularReflectionMapping;
        sphereMesh.material.envMap = physicalMap;
    }
    if (value == "refraction") {
        physicalMap.mapping = THREE.EquirectangularRefractionMapping;
        sphereMesh.material.envMap = physicalMap;
    }
    sphereMesh.material.needsUpdate = true;
})
physicalMaterialFolder.add(physicalSettings, "map", ["none", "brick"]).onChange(value => {
    if (value == "none") {
        sphereMesh.material.map = null;
    }
    if (value == "brick") {
        sphereMesh.material.map = brickTexture;
    }
    sphereMesh.material.needsUpdate = true;
})
physicalMaterialFolder.add(physicalSettings, "roughnessMap", ["none", "brick"]).onChange(value => {
    if (value == "none") {
        sphereMesh.material.roughnessMap = null;
    }
    if (value == "brick") {
        sphereMesh.material.roughnessMap = brickTexture;
    }
    sphereMesh.material.needsUpdate = true;
})
physicalMaterialFolder.add(physicalSettings, "alphaMap", ["none", "fibre"]).onChange(value => {
    if (value == "none") {
        sphereMesh.material.alphaMap = null;
    }
    if (value == "fibre") {
        sphereMesh.material.alphaMap = fibreTexture;
    }
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, "metalnessMap", ["none", "fibre"]).onChange(value => {
    if (value == "none") {
        sphereMesh.material.metalnessMap = null;
    }
    if (value == "fibre") {
        sphereMesh.material.metalnessMap = fibreTexture;
    }
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.add(physicalSettings, "iridescenceMap", ["none", "fibre"]).onChange(value => {
    if (value == "none") {
        sphereMesh.material.iridescenceMap = null;
    }
    if (value == "fibre") {
        sphereMesh.material.iridescenceMap = fibreTexture;
    }
    sphereMesh.material.needsUpdate = true;
});
physicalMaterialFolder.close();

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