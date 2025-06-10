class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.planets = [];
        this.isPaused = false;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.textureLoader = new THREE.TextureLoader();
        this.loadingManager = new THREE.LoadingManager();
        
        // Planet data with expanded astronomical properties
        this.planetData = [
            { 
                name: 'Mercury', 
                color: 0x8C7853, 
                size: 0.8, 
                distance: 15, 
                speed: 4.74, 
                info: 'Closest planet to the Sun',
                texture: 'images/mercury.png',
                nasaData: {
                    diameter: '4,879 km',
                    orbitalPeriod: '88 days',
                    surfaceTemp: '-173 to 427°C',
                    moons: 0,
                    gravity: '3.7 m/s²',
                    description: 'Mercury is the smallest planet in our solar system and closest to the Sun. It has a thin atmosphere and extreme temperature variations.'
                }
            },
            { 
                name: 'Venus', 
                color: 0xFFC649, 
                size: 1.2, 
                distance: 20, 
                speed: 3.50, 
                info: 'Hottest planet in our solar system',
                texture: 'images/venus.jpg',
                nasaData: {
                    diameter: '12,104 km',
                    orbitalPeriod: '225 days',
                    surfaceTemp: '462°C',
                    moons: 0,
                    gravity: '8.87 m/s²',
                    description: 'Venus has a thick, toxic atmosphere filled with carbon dioxide and is permanently shrouded in yellowish clouds of sulfuric acid.'
                }
            },
            { 
                name: 'Earth', 
                color: 0x6B93D6, 
                size: 1.3, 
                distance: 25, 
                speed: 2.98, 
                info: 'Our home planet',
                texture: 'images/earth.jpg',
                nasaData: {
                    diameter: '12,742 km',
                    orbitalPeriod: '365.25 days',
                    surfaceTemp: '-88 to 58°C',
                    moons: 1,
                    gravity: '9.81 m/s²',
                    description: 'Earth is the only known planet to support life, with a perfect balance of water, atmosphere, and temperature.'
                }
            },
            { 
                name: 'Mars', 
                color: 0xC1440E, 
                size: 1.0, 
                distance: 30, 
                speed: 2.41, 
                info: 'The Red Planet',
                texture: 'images/mars1.jpg',
                nasaData: {
                    diameter: '6,792 km',
                    orbitalPeriod: '687 days',
                    surfaceTemp: '-153 to 20°C',
                    moons: 2,
                    gravity: '3.71 m/s²',
                    description: 'Mars is known for its red appearance due to iron oxide (rust) on its surface and has the largest volcano in the solar system.'
                }
            },
            { 
                name: 'Jupiter', 
                color: 0xD8CA9D, 
                size: 3.5, 
                distance: 40, 
                speed: 1.31, 
                info: 'Largest planet in our solar system',
                texture: 'images/jupitermap.jpg',
                nasaData: {
                    diameter: '139,820 km',
                    orbitalPeriod: '11.86 years',
                    surfaceTemp: '-108°C (cloud top)',
                    moons: 79,
                    gravity: '24.79 m/s²',
                    description: 'Jupiter is a gas giant with a Great Red Spot, a storm larger than Earth that has been raging for centuries.'
                }
            },
            { 
                name: 'Saturn', 
                color: 0xFAD5A5, 
                size: 3.0, 
                distance: 50, 
                speed: 0.97, 
                info: 'Famous for its spectacular rings',
                texture: 'images/saturn.jpg',
                hasRings: true,
                nasaData: {
                    diameter: '120,536 km',
                    orbitalPeriod: '29.46 years',
                    surfaceTemp: '-139°C (cloud top)',
                    moons: 83,
                    gravity: '10.44 m/s²',
                    description: 'Saturn is known for its extensive ring system and is a gas giant composed mostly of hydrogen and helium.'
                }
            },
            { 
                name: 'Uranus', 
                color: 0x4FD0E7, 
                size: 2.0, 
                distance: 60, 
                speed: 0.68, 
                info: 'Ice giant tilted on its side',
                texture: 'images/uranus.jpg',
                nasaData: {
                    diameter: '50,724 km',
                    orbitalPeriod: '84 years',
                    surfaceTemp: '-197°C (cloud top)',
                    moons: 27,
                    gravity: '8.69 m/s²',
                    description: 'Uranus has a unique tilt, causing extreme seasons, and is composed of water, ammonia, and methane ices.'
                }
            },
            { 
                name: 'Neptune', 
                color: 0x4B70DD, 
                size: 1.9, 
                distance: 70, 
                speed: 0.54, 
                info: 'Windiest planet',
                texture: 'images/neptune.jpg',
                nasaData: {
                    diameter: '49,244 km',
                    orbitalPeriod: '164.8 years',
                    surfaceTemp: '-201°C (cloud top)',
                    moons: 14,
                    gravity: '11.15 m/s²',
                    description: 'Neptune is known for its deep blue color and strong winds, with storms like the Great Dark Spot.'
                }
            }
        ];
        
        // Sun data
        this.sunData = {
            name: 'Sun',
            info: 'The center of our solar system',
            texture: 'images/sun1.png',
            color: 0xFFD700,
            nasaData: {
                diameter: '1,391,000 km',
                surfaceTemp: '5,500°C',
                gravity: '274 m/s²',
                description: 'The Sun is a G-type main-sequence star at the center of our solar system, providing energy for life on Earth.'
            }
        };
        
        this.init();
    }
    
    init() {
        this.showLoading();
        this.setupLoadingManager();
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 50, 100);
    
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Setup everything
        this.setupLighting();
        this.createStarField();
        this.createSun();
        this.createPlanets();
        this.setupControls();
        this.createUI();
        this.setupEventListeners();
        
        // Start animation
        this.animate();
    }
    
    setupLoadingManager() {
        this.loadingManager.onLoad = () => {
            this.hideLoading();
            console.log('All textures loaded successfully!');
        };
        
        this.loadingManager.onProgress = (url, loaded, total) => {
            console.log(`Loading: ${loaded}/${total} - ${url}`);
        };
        
        this.loadingManager.onError = (url) => {
            console.warn(`Failed to load texture: ${url}`);
        };
        
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    }
    
    showLoading() {
        const loading = document.createElement('div');
        loading.id = 'loading-indicator';
        loading.className = 'loading';
        loading.textContent = 'Loading Solar System';
        document.body.appendChild(loading);
    }
    
    hideLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.remove();
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Sun light (point light)
        const sunLight = new THREE.PointLight(0xffffff, 2, 300);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 300;
        this.scene.add(sunLight);
    }
    
    createStarField() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ 
            color: 0xFFFFFF, 
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const starsVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }
    
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
        
        // Try to load sun texture, fallback to basic material
        let sunMaterial;
        
        try {
            const sunTexture = this.textureLoader.load(
                this.sunData.texture,
                // Success callback
                (texture) => {
                    console.log('Sun texture loaded successfully');
                },
                // Progress callback
                undefined,
                // Error callback
                (error) => {
                    console.warn('Sun texture failed to load, using fallback material');
                }
            );
            
            sunMaterial = new THREE.MeshBasicMaterial({ 
                map: sunTexture,
                emissive: this.sunData.color,
                emissiveIntensity: 0.3
            });
        } catch (error) {
            // Fallback material if texture loading fails
            sunMaterial = new THREE.MeshBasicMaterial({ 
                color: this.sunData.color,
                emissive: 0xFFAA00,
                emissiveIntensity: 0.3
            });
        }
        
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.name = 'Sun';
        this.scene.add(sun);
        
        // Add sun rotation
        this.sun = sun;
    }
    
    createSaturnRings(planetGroup, planetSize) {
        try {
            // Create multiple ring layers for realistic appearance
            const ringLayers = [
                { innerRadius: planetSize * 1.2, outerRadius: planetSize * 2.2, opacity: 0.9 },
                { innerRadius: planetSize * 2.3, outerRadius: planetSize * 2.8, opacity: 0.7},
                { innerRadius: planetSize * 2.9, outerRadius: planetSize * 3.2, opacity: 0.5 }
            ];
            
            // Try to load ring texture
            const ringTexture = this.textureLoader.load(
                'images/saturnRing.jpg',
                // Success callback
                (texture) => {
                    console.log('Saturn ring texture loaded successfully');
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    
                    // Create textured rings
                    this.createTexturedRings(planetGroup, ringLayers, texture);
                },
                // Progress callback
                undefined,
                // Error callback
                (error) => {
                    console.warn('Saturn ring texture failed to load, using procedural rings');
                    // Create procedural rings as fallback
                    this.createProceduralRings(planetGroup, ringLayers);
                }
            );
            
        } catch (error) {
            console.warn('Ring creation failed, creating simple rings as fallback');
            this.createSimpleRings(planetGroup, planetSize);
        }
    }
    
    createTexturedRings(planetGroup, ringLayers, texture) {
        ringLayers.forEach((layer, index) => {
            const ringGeometry = new THREE.RingGeometry(layer.innerRadius, layer.outerRadius, 128);
            
            // Create UV mapping for ring texture
            const positions = ringGeometry.attributes.position.array;
            const uvArray = [];
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                const radius = Math.sqrt(x * x + z * z);
                const angle = Math.atan2(z, x);
                
                // Map radius to U coordinate (0 = inner, 1 = outer)
                const u = (radius - layer.innerRadius) / (layer.outerRadius - layer.innerRadius);
                // Map angle to V coordinate
                const v = (angle + Math.PI) / (2 * Math.PI);
                
                uvArray.push(u, v);
            }
            
            ringGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
            
            const ringMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true,
                opacity: layer.opacity,
                side: THREE.DoubleSide,
                alphaTest: 0.1
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2; // Rotate to be horizontal
            ring.receiveShadow = true;
            ring.castShadow = true;
            
            // Add slight tilt to rings for realism
            ring.rotation.z = Math.PI * 0.05;
            
            planetGroup.add(ring);
        });
        
        // Add particle ring for extra detail
        this.createParticleRing(planetGroup, ringLayers[0].innerRadius, ringLayers[ringLayers.length - 1].outerRadius);
    }
    
    createProceduralRings(planetGroup, ringLayers) {
        ringLayers.forEach((layer, index) => {
            const ringGeometry = new THREE.RingGeometry(layer.innerRadius, layer.outerRadius, 128);
            
            // Create procedural ring material with gradient
            const ringMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.1, 0.3, 0.6 - index * 0.1),
                transparent: true,
                opacity: layer.opacity,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.receiveShadow = true;
            ring.castShadow = true;
            ring.rotation.z = Math.PI * 0.05;
            
            planetGroup.add(ring);
        });
        
        // Add particle ring for extra detail
        this.createParticleRing(planetGroup, ringLayers[0].innerRadius, ringLayers[ringLayers.length - 1].outerRadius);
    }
    
    createSimpleRings(planetGroup, planetSize) {
        // Simple fallback rings
        const ringGeometry = new THREE.RingGeometry(planetSize * 1.5, planetSize * 2.5, 64);
        const ringMaterial = new THREE.MeshLambertMaterial({
            color: 0xDDCCAA,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.receiveShadow = true;
        ring.castShadow = true;
        ring.rotation.z = Math.PI * 0.05;
        
        planetGroup.add(ring);
    }
    
    createParticleRing(planetGroup, innerRadius, outerRadius) {
        try {
            const particleCount = 1000;
            const particles = new THREE.BufferGeometry();
            const positions = [];
            const colors = [];
            
            for (let i = 0; i < particleCount; i++) {
                // Random position in ring area
                const angle = Math.random() * Math.PI * 2;
                const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = (Math.random() - 0.5) * 0.1; // Very thin ring
                
                positions.push(x, y, z);
                
                // Vary particle colors
                const color = new THREE.Color();
                color.setHSL(0.1 + Math.random() * 0.1, 0.5, 0.5 + Math.random() * 0.3);
                colors.push(color.r, color.g, color.b);
            }
            
            particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            const particleMaterial = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });
            
            const particleRing = new THREE.Points(particles, particleMaterial);
            particleRing.rotation.x = Math.PI / 2;
            particleRing.rotation.z = Math.PI * 0.05;
            
            planetGroup.add(particleRing);
        } catch (error) {
            console.warn('Particle ring creation failed:', error);
        }
    }
    
    createPlanets() {
        this.planetData.forEach((data, index) => {
            // Create planet geometry
            const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
            
            // Create material with texture or fallback to color
            let planetMaterial;
            
            try {
                const planetTexture = this.textureLoader.load(
                    data.texture,
                    // Success callback
                    (texture) => {
                        console.log(`${data.name} texture loaded successfully`);
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                    },
                    
                    undefined,
                    // Error callback
                    (error) => {
                        console.warn(`${data.name} texture failed to load, using color fallback`);
                    }
                );
                
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    map: planetTexture
                });
            } catch (error) {
                // Fallback to solid color if texture fails
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: data.color 
                });
            }
            
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.name = data.name;
            
            // Create orbit group
            const orbitGroup = new THREE.Group();
            
            // Create planet group (for rings and moons)
            const planetGroup = new THREE.Group();
            planetGroup.add(planet);
            
            // Add rings if this is Saturn
            if (data.hasRings) {
                this.createSaturnRings(planetGroup, data.size);
            }
            
            planetGroup.position.x = data.distance;
            orbitGroup.add(planetGroup);
            this.scene.add(orbitGroup);
            
            // Create orbit line visual
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 128);
            const orbitColors = [
                0xFF6B6B, // Red for Mercury
                0xFFD93D, // Yellow for Venus
                0x6BCF7F, // Green for Earth
                0xFF8E53, // Orange for Mars
                0xA8E6CF, // Light green for Jupiter
                0xFFB3BA, // Pink for Saturn
                0x87CEEB, // Sky blue for Uranus
                0x4169E1  // Royal blue for Neptune
            ];
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: orbitColors[index] || 0x888888, 
                transparent: true, 
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbitLine.rotation.x = Math.PI / 2;
            this.scene.add(orbitLine);
            
            // Store planet data
            this.planets.push({
                mesh: planet,
                planetGroup: planetGroup,
                orbitGroup: orbitGroup,
                data: data,
                currentSpeed: data.speed,
                angle: Math.random() * Math.PI * 2 // Random starting position
            });
        });
    }
    
    setupControls() {
        // Simple camera controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.renderer.domElement.style.cursor = 'grabbing';
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                
                const spherical = new THREE.Spherical();
                spherical.setFromVector3(this.camera.position);
                
                spherical.theta -= deltaMove.x * 0.01;
                spherical.phi += deltaMove.y * 0.01;
                spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
                
                this.camera.position.setFromSpherical(spherical);
                this.camera.lookAt(0, 0, 0);
            }
            
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
            
            // Update mouse position for raycasting
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            this.checkHover();
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
        });
        
        // Add click handler for planet details
        this.renderer.domElement.addEventListener('click', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.handlePlanetClick();
        });
        
        // Set initial cursor
        this.renderer.domElement.style.cursor = 'grab';
        
        // Zoom controls
        this.renderer.domElement.addEventListener('wheel', (e) => {
            const zoomSpeed = 0.1;
            const direction = e.deltaY > 0 ? 1 : -1;
            
            this.camera.position.multiplyScalar(1 + direction * zoomSpeed);
            
            // Limit zoom
            const distance = this.camera.position.length();
            if (distance < 20) {
                this.camera.position.normalize().multiplyScalar(20);
            } else if (distance > 250) {
                this.camera.position.normalize().multiplyScalar(250);
            }
            
            e.preventDefault();
        });
    }
    
    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const planetMeshes = this.planets.map(p => p.mesh);
        planetMeshes.push(this.sun); 
        const intersects = this.raycaster.intersectObjects(planetMeshes);
        
        const tooltip = document.getElementById('tooltip');
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            let planetData;
            
            if (object.name === 'Sun') {
                planetData = this.sunData;
            } else {
                planetData = this.planets.find(p => p.mesh === object).data;
            }
            
            tooltip.innerHTML = `<strong>${planetData.name}</strong><br>${planetData.info}`;
            tooltip.style.display = 'block';
            tooltip.style.left = (this.mouse.x + 1) * window.innerWidth / 2 + 10 + 'px';
            tooltip.style.top = (-this.mouse.y + 1) * window.innerHeight / 2 + 10 + 'px';
            
            // Change cursor to pointer
            this.renderer.domElement.style.cursor = 'pointer';
        } else {
            tooltip.style.display = 'none';
            this.renderer.domElement.style.cursor = 'grab';
        }
    }
    
    handlePlanetClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const planetMeshes = this.planets.map(p => p.mesh);
        planetMeshes.push(this.sun); 
        const intersects = this.raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            let planetData;
            
            if (object.name === 'Sun') {
                planetData = this.sunData;
            } else {
                planetData = this.planets.find(p => p.mesh === object).data;
            }
            
            this.showPlanetDetails(planetData);
        }
    }
    
     showPlanetDetails(planetData) {
        try {
            let modal = document.getElementById('planet-info-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'planet-info-modal';
                document.body.appendChild(modal);
            }
            
            modal.innerHTML = `
                <div class="modal-header">
                <h2>${planetData.name}</h2>
                 <button class="close-btn">Close</button> 
                </div>
               <p>${planetData.nasaData.description}</p>
                <ul>
                    <li><strong>Diameter:</strong> ${planetData.nasaData.diameter}</li>
                    <li><strong>Orbital Period:</strong> ${planetData.nasaData.orbitalPeriod}</li>
                    <li><strong>Surface Temperature:</strong> ${planetData.nasaData.surfaceTemp}</li>
                    <li><strong>Moons:</strong> ${planetData.nasaData.moons}</li>
                    <li><strong>Gravity:</strong> ${planetData.nasaData.gravity}</li>
                </ul>
            `;
            
            modal.style.display = 'block';
            

            const closeButton = modal.querySelector('.close-btn');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                    console.log('Modal closed');
                });
            } else {
                console.warn('Close button not found in modal');
            }
        } catch (error) {
            console.error('Failed to show planet details:', error);
        }
    }
    
    createUI() {
        const controlsContainer = document.getElementById('planet-controls');
        
        this.planets.forEach((planet, index) => {
            const controlGroup = document.createElement('div');
            controlGroup.className = 'control-group';
            
            const label = document.createElement('label');
            label.textContent = planet.data.name;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '10';
            slider.step = '0.1';
            slider.value = planet.data.speed;
            
            const valueDisplay = document.createElement('div');
            valueDisplay.className = 'value-display';
            valueDisplay.textContent = `Speed: ${planet.data.speed.toFixed(1)}x`;
            
            slider.addEventListener('input', (e) => {
                const newSpeed = parseFloat(e.target.value);
                planet.currentSpeed = newSpeed;
                valueDisplay.textContent = `Speed: ${newSpeed.toFixed(1)}x`;
            });
            
            controlGroup.appendChild(label);
            controlGroup.appendChild(slider);
            controlGroup.appendChild(valueDisplay);
            controlsContainer.appendChild(controlGroup);
        });
    }
    
    setupEventListeners() {
        // Pause/Resume button
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            const btn = document.getElementById('pause-btn');
            btn.textContent = this.isPaused ? 'Resume' : 'Pause';
            btn.className = this.isPaused ? 'pause' : '';
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.planets.forEach((planet, index) => {
                planet.angle = 0;
                planet.currentSpeed = planet.data.speed;
                
                // Reset UI sliders
                const sliders = document.querySelectorAll('#planet-controls input[type="range"]');
                sliders[index].value = planet.data.speed;
                
                const valueDisplays = document.querySelectorAll('#planet-controls .value-display');
                valueDisplays[index].textContent = `Speed: ${planet.data.speed.toFixed(1)}x`;
            });
            
            // Reset camera position
            this.camera.position.set(0, 50, 100);
            this.camera.lookAt(0, 0, 0);
            
            // Hide planet info modal if open
            const modal = document.getElementById('planet-info-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    document.getElementById('pause-btn').click();
                    break;
                case 'KeyR':
                    document.getElementById('reset-btn').click();
                    break;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isPaused) {
            const deltaTime = this.clock.getDelta();
            
            // Animate sun rotation
            if (this.sun) {
                this.sun.rotation.y += deltaTime * 0.5;
            }
            
            // Animate planets
            this.planets.forEach(planet => {
                // Orbital motion
                planet.angle += planet.currentSpeed * deltaTime * 0.1;
                planet.orbitGroup.rotation.y = planet.angle;
                
                // Planet rotation on its axis
                planet.mesh.rotation.y += deltaTime * 2;
                
                // Rotate Saturn's rings slowly
                if (planet.data.hasRings) {
                    planet.planetGroup.rotation.y += deltaTime * 0.5;
                }
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the solar system when the page loads
window.addEventListener('load', () => {
    new SolarSystem();
});