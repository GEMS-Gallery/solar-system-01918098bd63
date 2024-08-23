import React, { useEffect, useState, useRef } from 'react';
import { Box, Modal, Typography, CircularProgress } from '@mui/material';
import * as THREE from 'three';
import { backend } from 'declarations/backend';

type Planet = {
  id: number;
  name: string;
  orbitalPeriod: number | null;
  gravity: number | null;
};

const App: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const fetchedPlanets = await backend.getPlanets();
        setPlanets(fetchedPlanets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching planets:', error);
        setLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || loading) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Add sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add planets
    const planetObjects: THREE.Mesh[] = [];
    planets.forEach((planet, index) => {
      const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
      const planetMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xFFFFFF });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.position.x = 10 + index * 5;
      scene.add(planetMesh);
      planetObjects.push(planetMesh);
    });

    camera.position.z = 50;

    const animate = () => {
      requestAnimationFrame(animate);

      planetObjects.forEach((planet, index) => {
        const angle = Date.now() * 0.001 * (1 / (index + 1));
        const radius = 10 + index * 5;
        planet.position.x = Math.cos(angle) * radius;
        planet.position.z = Math.sin(angle) * radius;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const handleClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(planetObjects);

      if (intersects.length > 0) {
        const clickedPlanet = planets[planetObjects.indexOf(intersects[0].object as THREE.Mesh)];
        setSelectedPlanet(clickedPlanet);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, [planets, loading]);

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <canvas ref={canvasRef} />
      )}
      <Modal
        open={selectedPlanet !== null}
        onClose={() => setSelectedPlanet(null)}
        aria-labelledby="planet-modal-title"
        aria-describedby="planet-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="planet-modal-title" variant="h6" component="h2">
            {selectedPlanet?.name}
          </Typography>
          <Typography id="planet-modal-description" sx={{ mt: 2 }}>
            Orbital Period: {selectedPlanet?.orbitalPeriod} Earth days<br />
            Gravity: {selectedPlanet?.gravity} m/s²
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default App;
