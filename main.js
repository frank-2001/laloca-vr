import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';


let body=document.querySelector("#scene")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,body.clientWidth / body.clientHeight, 0.1, 500 );
camera.position.set(0,0,100)
camera.lookAt( 0, 0, 0 );
camera.position.z = 10;


const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize( body.clientWidth, body.clientHeight );
renderer.xr.enabled = true
body.appendChild( renderer.domElement );
body.appendChild( VRButton.createButton( renderer ) );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const geometry = new THREE.BoxGeometry(1);
// const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
//create a blue LineBasicMaterial
// const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// const cube = new THREE.Mesh( geometry, material );
// const cube = new THREE.Line( geometry, material );

// scene.add(cube);

//     console.log(scene.children);
// Load model
const loader = new GLTFLoader();
let objet
loader.load( 'lieutenantHead.gltf', 
    function ( gltf ) {
        objet=gltf.scene
        scene.add(objet);
    },
    function (xhr) {
      //While it is loading, log the progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function ( error ) {
        console.error( error );
    } 
);
// Add the light to the scene
const topLight = new THREE.DirectionalLight( 0xffffff,1); // soft white light
// topLight.position.set(500, 500, 500) //top-left-ish
// topLight.castShadow = true;
scene.add( topLight );

const light = new THREE.AmbientLight( 0x333333,5); // soft white light
scene.add( light );

let controls = new OrbitControls(camera, renderer.domElement);

// Zoom out
let zin = document.querySelector("#zoomin")
zin.addEventListener("click",(e)=>{
    camera.position.z++;
})
// zoom in
let zout=document.querySelector("#zoomout")
zout.addEventListener("click",(e)=>{
    camera.position.z--; 
});
//Keep track of the mouse position, so we can make the eye move
let mouseX = body.clientWidth / 2;
let mouseY = body.clientHeight / 2;
function animate() {
	requestAnimationFrame( animate );
    // objet.rotation.x=-1.2+mouseY*2.5/window.innerHeight
    // objet.rotation.y=-3+mouseX/window.innerWidth*3
	renderer.render( scene, camera );
}

window.addEventListener("resize",(e)=>{
    console.log("Screen Resized");
    camera.aspect=body.clientWidth/body.clientHeight
    camera.updateProjectionMatrix();
    renderer.setSize(body.clientWidth,body.clientHeight)
})
window.addEventListener("mousemove",(e)=>{
    mouseX=e.clientX
    mouseY=e.clientY
})
// setTimeout(() => {
//     animate()    
// }, 2000);
console.log(scene.children);

window.addEventListener("load",()=>{
    console.log("loaded");
    // animate()
    renderer.setAnimationLoop( function () {
        console.log(scene.children);
        renderer.render( scene, camera );
    });
})



