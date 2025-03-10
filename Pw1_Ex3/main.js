import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function makeInstance(
    scene,
    texture,
    geometry,
    color,
    x
) {
    const material = new THREE.MeshBasicMaterial({
        color,
        map: texture,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
}

function main() {
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
    );
    camera.position.z = 5;

    var controls = new OrbitControls(
        camera,
        renderer.domElement
    );
    controls.listenToKeyEvents(window); // optional

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // AXES helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(
            color,
            intensity
        );
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    // NOT A GOOD EXAMPLE OF HOW TO MAKE A CUBE!
    // Only trying to make it clear most vertices are unique
    const vertices = [
        // front
        { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] }, // 0
        { pos: [-.5, -1, 1], norm: [0, 0, 1], uv: [.25, 0] }, // 1
        { pos: [.5, -1, 1], norm: [0, 0, 1], uv: [.75, 0] }, // 2
        { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] }, // 3
        { pos: [-.5, -.5, 1], norm: [0, 0, 1], uv: [.25, .25] }, // 4
        { pos: [.5, -.5, 1], norm: [0, 0, 1], uv: [.75, .25] }, // 5
        { pos: [-.5, .5, 1], norm: [0, 0, 1], uv: [.25, .75] }, // 6
        { pos: [.5, .5, 1], norm: [0, 0, 1], uv: [.75, .75] }, // 7
        { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] }, // 8
        { pos: [-.5, 1, 1], norm: [0, 0, 1], uv: [.25, 1] }, // 9
        { pos: [.5, 1, 1], norm: [0, 0, 1], uv: [.75, 1] }, // 10
        { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] }, // 11
        // right
        { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] }, // 12
        { pos: [1, -1, 0.5], norm: [1, 0, 0], uv: [.25, 0] }, // 13
        { pos: [1, -1, -0.5], norm: [1, 0, 0], uv: [.75, 0] }, // 14
        { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] }, // 15
        { pos: [1, -.5, 0.5], norm: [1, 0, 0], uv: [.25, .25] }, // 16
        { pos: [1, -.5, -0.5], norm: [1, 0, 0], uv: [.75, .25] }, // 17
        { pos: [1, .5, 0.5], norm: [1, 0, 0], uv: [.25, .75] }, // 18
        { pos: [1, .5, -0.5], norm: [1, 0, 0], uv: [.75, .75] }, // 19
        { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] }, // 20
        { pos: [1, 1, 0.5], norm: [1, 0, 0], uv: [.25, 1] }, // 21
        { pos: [1, 1, -0.5], norm: [1, 0, 0], uv: [.75, 1] }, // 22
        { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] }, // 23
        // back
        { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] }, // 24
        { pos: [.5, -1, -1], norm: [0, 0, -1], uv: [.25, 0] }, // 25
        { pos: [-.5, -1, -1], norm: [0, 0, -1], uv: [.75, 0] }, // 26
        { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] }, // 27
        { pos: [.5, -.5, -1], norm: [0, 0, -1], uv: [.25, .25] }, // 28
        { pos: [-.5, -.5, -1], norm: [0, 0, -1], uv: [.75, .25] }, // 29
        { pos: [.5, .5, -1], norm: [0, 0, -1], uv: [.25, .75] }, // 30
        { pos: [-.5, .5, -1], norm: [0, 0, -1], uv: [.75, .75] }, // 31
        { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] }, // 32
        { pos: [.5, 1, -1], norm: [0, 0, -1], uv: [.25, 1] }, // 33
        { pos: [-.5, 1, -1], norm: [0, 0, -1], uv: [.75, 1] }, // 34
        { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] }, // 35
        // left
        { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] }, // 36
        { pos: [-1, -1, -0.5], norm: [-1, 0, 0], uv: [.25, 0] }, // 37
        { pos: [-1, -1, 0.5], norm: [-1, 0, 0], uv: [.75, 0] }, // 38
        { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] }, // 39
        { pos: [-1, -.5, -0.5], norm: [-1, 0, 0], uv: [.25, .25] }, // 40
        { pos: [-1, -.5, 0.5], norm: [-1, 0, 0], uv: [.75, .25] }, // 41
        { pos: [-1, .5, -0.5], norm: [-1, 0, 0], uv: [.25, .75] }, // 42
        { pos: [-1, .5, 0.5], norm: [-1, 0, 0], uv: [.75, .75] }, // 43
        { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] }, // 44
        { pos: [-1, 1, -0.5], norm: [-1, 0, 0], uv: [.25, 1] }, // 45
        { pos: [-1, 1, 0.5], norm: [-1, 0, 0], uv: [.75, 1] }, // 46
        { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] }, // 47
        // top
        { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [0, 0] }, // 48
        { pos: [-.5, 1, 1], norm: [0, 1, 0], uv: [.25, 0] }, // 49
        { pos: [.5, 1, 1], norm: [0, 1, 0], uv: [.75, 0] }, // 50
        { pos: [1, 1, 1], norm: [0, 1, 0], uv: [1, 0] }, // 51
        { pos: [-.5, 1, .5], norm: [0, 1, 0], uv: [.25, .25] }, // 52
        { pos: [.5, 1, .5], norm: [0, 1, 0], uv: [.75, .25] }, // 53
        { pos: [-.5, 1, -.5], norm: [0, 1, 0], uv: [.25, .75] }, // 54
        { pos: [.5, 1, -.5], norm: [0, 1, 0], uv: [.75, .75] }, // 55
        { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [0, 1] }, // 56
        { pos: [-.5, 1, -1], norm: [0, 1, 0], uv: [.25, 1] }, // 57
        { pos: [.5, 1, -1], norm: [0, 1, 0], uv: [.75, 1] }, // 58
        { pos: [1, 1, -1], norm: [0, 1, 0], uv: [1, 1] }, // 59

        // bottom
        { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [0, 0] }, // 60
        { pos: [-.5, -1, -1], norm: [0, -1, 0], uv: [.25, 0] }, // 61
        { pos: [.5, -1, -1], norm: [0, -1, 0], uv: [.75, 0] }, // 62
        { pos: [1, -1, -1], norm: [0, -1, 0], uv: [1, 0] }, // 63
        { pos: [-.5, -1, -.5], norm: [0, -1, 0], uv: [.25, .25] }, // 64
        { pos: [.5, -1, -.5], norm: [0, -1, 0], uv: [.75, .25] }, // 65
        { pos: [-.5, -1, .5], norm: [0, -1, 0], uv: [.25, .75] }, // 66
        { pos: [.5, -1, .5], norm: [0, -1, 0], uv: [.75, .75] }, // 67
        { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [0, 1] }, // 68
        { pos: [-.5, -1, 1], norm: [0, -1, 0], uv: [.25, 1] }, // 69
        { pos: [.5, -1, 1], norm: [0, -1, 0], uv: [.75, 1] }, // 70
        { pos: [1, -1, 1], norm: [0, -1, 0], uv: [1, 1] }, // 71
    ];

    const numVertices = vertices.length;
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    const positions = new Float32Array(
        numVertices * positionNumComponents
    );
    const normals = new Float32Array(
        numVertices * normalNumComponents
    );
    const uvs = new Float32Array(
        numVertices * uvNumComponents
    );
    let posNdx = 0;
    let nrmNdx = 0;
    let uvNdx = 0;
    for (const vertex of vertices) {
        positions.set(vertex.pos, posNdx);
        normals.set(vertex.norm, nrmNdx);
        uvs.set(vertex.uv, uvNdx);
        posNdx += positionNumComponents;
        nrmNdx += normalNumComponents;
        uvNdx += uvNumComponents;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            positionNumComponents
        )
    );
    geometry.setAttribute(
        "normal",
        new THREE.BufferAttribute(
            normals,
            normalNumComponents
        )
    );
    geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(uvs, uvNumComponents)
    );

    geometry.setIndex([
        // front
        0, 1, 8,
        8, 1, 9,
        1, 2, 4,
        4, 2, 5,
        2, 3, 10,
        10, 3, 11,
        6, 7, 9,
        9, 7, 10,
        // right
        12, 13, 20,
        20, 13, 21,
        13, 14, 16,
        16, 14, 17,
        14, 15, 22,
        22, 15, 23,
        18, 19, 21,
        21, 19, 22,
        // back
        24, 25, 32,
        32, 25, 33,
        25, 26, 28,
        28, 26, 29,
        26, 27, 34,
        34, 27, 35,
        30, 31, 33,
        33, 31, 34,
        // left
        36, 37, 44,
        44, 37, 45,
        37, 38, 40,
        40, 38, 41,
        38, 39, 46,
        46, 39, 47,
        42, 43, 45,
        45, 43, 46,
        // top
        48, 49, 56,
        49, 57, 56,
        49, 50, 52,
        50, 53, 52,
        54, 55, 57,
        55, 58, 57,
        50, 51, 58,
        51, 59, 58,
        // bottom
        60, 61, 68,
        68, 61, 69,
        61, 62, 64,
        64, 62, 65,
        62, 63, 70,
        70, 63, 71,
        66, 67, 69,
        69, 67, 70,
    ]);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("grenouille.jpg");

    const cubes = [
    makeInstance(scene, texture, geometry, 0x00ff00, 0),
    makeInstance(
        scene,
        texture,
        geometry,
        0xff0000,
        -3
    ),
    makeInstance(scene, texture, geometry, 0x0000ff, 3),
    ];

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

    function render(time) {
        //   time *= 0.0004;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect =
            canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();