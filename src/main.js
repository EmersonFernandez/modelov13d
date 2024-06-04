import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuración inicial de la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.set(-186.51864946972694, 103.29856636823064, -115.84244739975364); // Ajusta la posición de la cámara para estar más cerca del modelo
camera.fog = new THREE.Fog(0xe6e6e6, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Habilitar las sombras en el renderizador
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombras suaves
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Añadir luz hemisférica
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemisphereLight.position.set(0, 20, 0);
scene.add(hemisphereLight);

// Añadir luz direccional (sol)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 15);
directionalLight.castShadow = true; // Habilitar sombras en la luz direccional

// Configurar las sombras de la luz direccional
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -90;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

scene.add(directionalLight);
const textureLoader = new THREE.TextureLoader();
// Añadir suelo
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xe6e6e6 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true; // Permitir que el suelo reciba sombras
scene.add(plane);

// Cargar la textura de fondo
textureLoader.load('./assets/vignette.jpg', function (texture) {
    scene.background = texture;
});

// Añadir controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Raycaster y mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Title 
const boxTitle = document.createElement('div');
const title1 = document.createElement('p');
const title2 = document.createElement('p');
document.body.appendChild(boxTitle);
boxTitle.appendChild(title1);
boxTitle.appendChild(title2);
boxTitle.style.position = 'absolute';
boxTitle.style.top = 0;
boxTitle.style.left = '50%';
boxTitle.style.transform = 'translate(-50%)'
boxTitle.style.textAlign = 'center';
boxTitle.style.color = '#ffffff'
boxTitle.style.margin = '10px 0';
title1.style.fontSize = '2.0rem';
title1.style.fontWeight = 'bold'
title2.style.fontSize = '1.5rem';
title1.style.margin = 0;
title1.style.padding = 0;
title2.style.margin = 0;
title2.style.padding = 0;
title1.textContent = 'GEOTECTURAS';
title2.textContent = 'TECNOLOGÍA PARA LA GESTIÓN URBANA';

// Tooltip
const tooltip = document.createElement('div');
tooltip.classList.add('div-tooltip');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'transparent';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '5px';
tooltip.style.display = 'none';
tooltip.style.textAlign = 'center';
tooltip.style.top = '20px';
tooltip.style.right = '20px';
tooltip.style.width = '300px'; // Ancho del tooltip como porcentaje del ancho de la ventana
tooltip.style.maxWidth = '200px'; // Ancho máximo absoluto para grandes pantallas
tooltip.style.fontSize = 'calc(10px + 0.5vw)'; // Tamaño de fuente responsivo
document.body.appendChild(tooltip);

const img = document.createElement('img'); // creamos elemento img
const p = document.createElement('p'); // creamos elemento p
p.style.fontSize = '0.99rem';
tooltip.appendChild(img); // lo añadimos al elemento tooltip
tooltip.appendChild(p); // lo añadimos al elemento tooltip

// Logo
const logo = document.createElement('img');
const logoBackground = document.createElement('div');
logoBackground.appendChild(logo);
logo.src = './assets/logo_fondoBlanco.png';
logo.alt = 'Logo';
logoBackground.style.position = 'absolute';
logoBackground.style.bottom = '20px';
logoBackground.style.right = '20px';
logoBackground.style.display = 'none';
logo.style.width = '320px'; // Ancho del logo como porcentaje del ancho de la ventana
logo.style.maxWidth = '200px'; // Ancho máximo absoluto para grandes pantallas
logo.style.height = 'auto'; // Altura automática para mantener la relación de aspecto
document.body.appendChild(logoBackground);

// Función para manejar el movimiento del mouse
function onMouseMove(event) {
    // Convertir coordenadas del mouse a coordenadas normalizadas del dispositivo
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Actualizar raycaster
    raycaster.setFromCamera(mouse, camera);

    // Verificar si el modelo está cargado
    if (loadedModel) {
        // Calcular objetos intersectados
        const intersects = raycaster.intersectObject(loadedModel, true);
        if (intersects.length > 0) {
            // Mostrar tooltip
            tooltip.style.display = 'block';
            // Asignar atributos al img
            img.src = './assets/imagen_tooltip.png'; // Ruta de la imagen
            img.alt = 'Imagen tooltip'; // Texto alternativo
            img.style.width = '100%'; // Hacer que la imagen ocupe el 100% del contenedor
            img.style.height = 'auto'; // Mantener la relación de aspecto
            img.style.borderRadius = '5px';

            // Puedes agregar otros atributos usando setAttribute
            img.setAttribute('title', 'imagen modelo tooltip');
            p.textContent = 'Modelo Digital para la gestión urbana en la construcción de ecosistemas digitales para ciudades inteligentes.'; // Cambia esto según tu necesidad
        } else {
            // Ocultar tooltip
            tooltip.style.display = 'none';
        }
    }
}

// Escuchar eventos de movimiento del mouse
window.addEventListener('mousemove', onMouseMove);

let loadedModel;

// Función para cargar el HDR y el modelo FBX
function loadScene() {
    return new Promise((resolve, reject) => {
        // Cargar entorno HDR
        new RGBELoader()
            .setPath('./assets/')
            .load('MR_INT-005_WhiteNeons_NAD.hdr', function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture; // Solo usar como entorno para reflejos

                // Cargar modelo FBX
                const loader = new FBXLoader();
                loader.load('./assets/modelo3d.fbx', function (object) {
                    console.log(object);
                    // Ajuste de la escala, posición y rotación del modelo
                    object.position.set(-20, -1470, 90);
                    object.rotation.set(-Math.PI / 2, 0, Math.PI / 8); // Ajuste de rotación en radianes
                    object.castShadow = true; // Habilitar sombras en el modelo
                    object.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true; // Habilitar sombras en cada malla del modelo
                            child.receiveShadow = true; // Permitir que cada malla reciba sombras
                        }
                    });
                    scene.add(object);
                    loadedModel = object; // Guardar referencia al modelo cargado
                    resolve(); // Resolver la promesa una vez que todo se haya cargado
                }, undefined, function (error) {
                    reject(error); // Rechazar la promesa si hay un error
                });
            }, undefined, function (error) {
                reject(error); // Rechazar la promesa si hay un error
            });
    });
}

// Funciones adicionales
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Iniciar la carga de la escena
loadScene().then(() => {
    // Ocultar el spinner y el texto de carga una vez que todo se haya cargado
    document.getElementById('loader-container').style.display = 'none';
    logoBackground.style.display = 'block';
    // Iniciar la animación
    animate();
}).catch((error) => {
    console.error('Error loading scene:', error);
    alert('Error loading scene. Check the console for details.');
});

// Función para manejar el redimensionamiento de la ventana del navegador
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Escuchar eventos de redimensionamiento de ventana
window.addEventListener('resize', onWindowResize);
