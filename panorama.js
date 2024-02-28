import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';


let body=document.querySelector("#scene")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,body.clientWidth / body.clientHeight, 0.1, 500 );
camera.position.set(0,0,0)
camera.lookAt( 0, 0, 0 );
camera.position.z = 1;


const renderer = new THREE.WebGLRenderer({alpha:true});
let cameraXr=renderer.xr.getCamera()

// console.log(renderer.xr.getCamera().cameras);

renderer.setSize( body.clientWidth, body.clientHeight );
renderer.xr.enabled = true
body.appendChild( renderer.domElement );
body.appendChild( VRButton.createButton( renderer ) );
let controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate=true;
controls.autoRotateSpeed=2

// console.log(renderer.xr.getController());
controls.minZoom=-20
controls.maxZoom=20
controls.enableZoom=true


// Sphère
let imgs=[{img:"360.jpg",title:"Rue centre ville"},{img:"tamende.jpg",title:"Tamende"},{img:"baraque.jpg",title:"Baraque interne"}]
let actual=0
const geometry = new THREE.SphereGeometry(50, 32, 32)
const texture = new THREE.TextureLoader().load(imgs[actual]["img"])
texture.wrapS = THREE.RepeatWrapping
texture.repeat.x = -1
const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
})
material.transparent = true
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

function mouve(direction) {
    if (direction=="Next") {
        if (actual==imgs.length-1) {
            actual=0            
        }else{
            actual++
        }
    }else{
        if (actual==0) {
            actual=imgs.length-1
        }else{
            actual--
        }
    }
    message(imgs[actual].title)
    
    // Update sphere
    new THREE.TextureLoader().load(imgs[actual]["img"],(t)=>{
        sphere.material.map=t
        sphere.material.needsUpdate=true
    })
    // Reset zoom
    camera.zoom=1
    cameraXr.zoom=1
    camera.updateProjectionMatrix();
    cameraXr.updateProjectionMatrix();
    
}

function zoom(direction) {
    if (direction=="in") {
        camera.zoom+=0.2
    }else{
        camera.zoom-=0.2
    }
    if (camera.zoom<1) {
        camera.zoom=1
    }
    message("ZOOM ×"+ Number.parseFloat(camera.zoom).toFixed(1) ) 
    camera.updateProjectionMatrix();
    if (cameraXr.cameras.length>0) {
        cameraXr.cameras[0].zoom=camera.zoom
        cameraXr.cameras[1].zoom=camera.zoom
        cameraXr.cameras[0].updateProjectionMatrix();
        cameraXr.cameras[1].updateProjectionMatrix();
    }
}
$(".message").hide();
function message(message="Salut!") {
    $(".message").toggle();
    $(".message").text(message);
    setTimeout(() => {
        $(".message").toggle();
    }, 2000);
}


let next=document.querySelector("#next")
next.addEventListener("click",()=>{mouve('Next')})

let previous=document.querySelector("#previous")
previous.addEventListener("click",()=>{mouve('Previous')})
// Zoom out
let zin = document.querySelector("#zoomin")
zin.addEventListener("click",(e)=>{zoom("in")})
// zoom in
let zout=document.querySelector("#zoomout")
zout.addEventListener("click",(e)=>{zoom("out")})

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
    // $('.mouse').css('margin-left', mouseX);
    // $('.mouse').css('margin-top', mouseY);
})

window.addEventListener("load",()=>{
    // animate()
    // console.log(renderer.xr.getCamera());
    setInterval(() => {
        zoom("in")        
    }, 2000);
    setInterval(() => {
        mouve("next")        
    }, 10000);
    renderer.setAnimationLoop( function () {
        
        controls.update()
        renderer.render( scene, camera );
    });
})



