<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Three.js - ZSQD et GLTF</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; }
        #info {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            font-family: sans-serif;
            background: rgba(0,0,0,0.5);
            padding: 10px;
            border-radius: 5px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div id="info">Commandes : Z (Avancer), S (Reculer), Q (Gauche), D (Droite)</div>

    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
    </script>

    <script type="module">
        import * as THREE from 'three';
        import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

        // 1. INITIALISATION (Scène, Caméra, Rendu)
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb); // Ciel bleu clair

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 8); // Hauteur des yeux

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace; // Pour des couleurs correctes
        document.body.appendChild(renderer.domElement);

        // 2. LUMIÈRES (Indispensables pour voir le modèle)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight);

        // 3. SOL (Pour avoir un repère spatial)
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x888888);
        scene.add(gridHelper);

        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; // Coucher le plan pour en faire un sol
        floor.position.y = -0.01; // Légèrement en dessous de la grille
        scene.add(floor);

        // 4. CHARGEMENT DU MODÈLE GLTF
        const loader = new GLTFLoader();
        // Utilisation du lien RAW de GitHub
        const urlModele = 'https://raw.githubusercontent.com/INFINITYPdev/JS3DTest/main/BGP001.gltf';

        loader.load(
            urlModele,
            (gltf) => {
                const modele = gltf.scene;
                // Ajuste la position ou l'échelle si ton modèle est trop grand/petit
                // modele.scale.set(0.1, 0.1, 0.1); 
                scene.add(modele);
                console.log("Modèle chargé avec succès !");
            },
            undefined,
            (error) => console.error("Erreur de chargement du modèle :", error)
        );

        // 5. CONTRÔLES CLAVIER (Z S Q D)
        const keys = { z: false, s: false, q: false, d: false };

        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'z') keys.z = true;
            if (event.key.toLowerCase() === 's') keys.s = true;
            if (event.key.toLowerCase() === 'q') keys.q = true;
            if (event.key.toLowerCase() === 'd') keys.d = true;
        });

        window.addEventListener('keyup', (event) => {
            if (event.key.toLowerCase() === 'z') keys.z = false;
            if (event.key.toLowerCase() === 's') keys.s = false;
            if (event.key.toLowerCase() === 'q') keys.q = false;
            if (event.key.toLowerCase() === 'd') keys.d = false;
        });

        // 6. BOUCLE D'ANIMATION ET DÉPLACEMENT
        const speed = 0.15; // Vitesse de déplacement

        function animate() {
            requestAnimationFrame(animate);

            // Appliquer les mouvements à la caméra
            if (keys.z) camera.translateZ(-speed); // Avancer
            if (keys.s) camera.translateZ(speed);  // Reculer
            if (keys.q) camera.translateX(-speed); // Gauche
            if (keys.d) camera.translateX(speed);  // Droite

            // Bloquer la caméra pour qu'elle ne passe pas sous le sol
            if (camera.position.y < 0.5) camera.position.y = 0.5;

            renderer.render(scene, camera);
        }
        animate();

        // 7. RESPONSIVE DESIGN
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>