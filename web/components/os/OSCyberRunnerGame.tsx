"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  Shield,
  Gauge,
  Gamepad2,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import {
  playCrystalCollect,
  playBoostSound,
  playCrashSound,
  playGameOverSound,
  playUiClick,
} from "@/lib/audio";

type GameState = "START" | "PLAYING" | "PAUSED" | "GAMEOVER";
type Difficulty = "normal" | "nitro" | "zen";

interface ActiveItem {
  mesh: THREE.Object3D;
  type: "crystal" | "obstacle";
  z: number;
  x: number;
  lane: number;
  points?: number;
  collected?: boolean;
}

export default function OSCyberRunnerGame() {
  const { theme, highScore, setHighScore, soundEnabled, toggleSound } = useOSStore();
  const themeConfig = getThemeConfig(theme);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState<number>(0);
  const [shields, setShields] = useState<number>(3);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [comboCount, setComboCount] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [newHighScoreAlert, setNewHighScoreAlert] = useState<boolean>(false);

  // Engine state refs to bypass React render loop lag in requestAnimationFrame
  const engineRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    ship: THREE.Group | null;
    gridSegments: THREE.GridHelper[];
    items: ActiveItem[];
    particles: THREE.Points | null;
    thrusterParticles: THREE.Points | null;
    clock: THREE.Clock;
    targetX: number;
    currentX: number;
    speed: number;
    baseSpeed: number;
    isBoosting: boolean;
    nextSpawnZ: number;
    animationFrameId: number | null;
    score: number;
    shields: number;
    multiplier: number;
    combo: number;
    activeState: GameState;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    ship: null,
    gridSegments: [],
    items: [],
    particles: null,
    thrusterParticles: null,
    clock: new THREE.Clock(),
    targetX: 0,
    currentX: 0,
    speed: 0.8,
    baseSpeed: 0.8,
    isBoosting: false,
    nextSpawnZ: 0,
    animationFrameId: null,
    score: 0,
    shields: 3,
    multiplier: 1,
    combo: 0,
    activeState: "START",
  });

  // Start / Restart Game
  const startGame = useCallback((diff: Difficulty = difficulty) => {
    playUiClick();
    const eng = engineRef.current;
    const base = diff === "nitro" ? 1.3 : diff === "zen" ? 0.7 : 0.9;

    eng.baseSpeed = base;
    eng.speed = base;
    eng.score = 0;
    eng.shields = diff === "zen" ? 999 : 3;
    eng.multiplier = 1;
    eng.combo = 0;
    eng.targetX = 0;
    eng.currentX = 0;
    eng.activeState = "PLAYING";

    // Clear old items from scene
    if (eng.scene) {
      eng.items.forEach((item) => {
        eng.scene?.remove(item.mesh);
      });
    }
    eng.items = [];
    eng.nextSpawnZ = 0;

    setScore(0);
    setShields(eng.shields);
    setMultiplier(1);
    setComboCount(0);
    setCurrentSpeed(Math.round(base * 100));
    setNewHighScoreAlert(false);
    setGameState("PLAYING");
  }, [difficulty]);

  const pauseGame = useCallback(() => {
    playUiClick();
    const eng = engineRef.current;
    if (eng.activeState === "PLAYING") {
      eng.activeState = "PAUSED";
      setGameState("PAUSED");
    } else if (eng.activeState === "PAUSED") {
      eng.activeState = "PLAYING";
      setGameState("PLAYING");
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (eng.activeState === "START") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (eng.activeState === "GAMEOVER") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.code === "KeyP" || e.code === "Escape") {
        e.preventDefault();
        pauseGame();
        return;
      }

      if (eng.activeState !== "PLAYING") return;

      const laneStep = 3.2;
      const maxX = 6.4;

      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        eng.targetX = Math.max(-maxX, eng.targetX - laneStep);
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        eng.targetX = Math.min(maxX, eng.targetX + laneStep);
      } else if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        e.preventDefault();
        if (!eng.isBoosting) {
          eng.isBoosting = true;
          eng.speed = eng.baseSpeed * 1.6;
          playBoostSound();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        eng.isBoosting = false;
        eng.speed = eng.baseSpeed;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startGame, pauseGame]);

  // Steer controls for on-screen buttons
  const steerLeft = () => {
    const eng = engineRef.current;
    if (eng.activeState !== "PLAYING") return;
    eng.targetX = Math.max(-6.4, eng.targetX - 3.2);
  };

  const steerRight = () => {
    const eng = engineRef.current;
    if (eng.activeState !== "PLAYING") return;
    eng.targetX = Math.min(6.4, eng.targetX + 3.2);
  };

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060b);
    scene.fog = new THREE.FogExp2(0x05060b, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 300);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 1.2, -10);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    dirLight.position.set(0, 20, 10);
    scene.add(dirLight);

    const sunGlow = new THREE.PointLight(0xff0077, 3.0, 80);
    sunGlow.position.set(0, 2, -70);
    scene.add(sunGlow);

    // 5. Starfield & Space Dust Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 80;
      starPos[i + 1] = Math.random() * 30 + 1;
      starPos[i + 2] = -Math.random() * 180;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 6. Dual Scrolling Ground Grid Tracks
    const gridSegments: THREE.GridHelper[] = [];
    const segmentLength = 100;
    for (let i = 0; i < 2; i++) {
      const grid = new THREE.GridHelper(segmentLength, 20, 0x00ffcc, 0x112244);
      grid.position.set(0, 0, -i * segmentLength);
      scene.add(grid);
      gridSegments.push(grid);
    }

    // 7. Futuristic Player Cyber-Ship Mesh
    const shipGroup = new THREE.Group();

    // Central cockpit fuselage (faceted diamond prism)
    const hullGeo = new THREE.ConeGeometry(0.7, 2.4, 4);
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.rotateY(Math.PI / 4);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0a101a,
      roughness: 0.3,
      metalness: 0.8,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 0.5;
    shipGroup.add(hull);

    // Neon Canopy
    const canopyGeo = new THREE.BoxGeometry(0.35, 0.25, 0.8);
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.75, 0.1);
    shipGroup.add(canopy);

    // Swept delta wings
    const wingGeo = new THREE.BufferGeometry();
    const wingVertices = new Float32Array([
      // Left wing
      0, 0.5, 0.4,
      -1.8, 0.45, 1.1,
      0, 0.5, -0.6,
      // Right wing
      0, 0.5, 0.4,
      0, 0.5, -0.6,
      1.8, 0.45, 1.1,
    ]);
    wingGeo.setAttribute("position", new THREE.BufferAttribute(wingVertices, 3));
    wingGeo.computeVertexNormals();
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x050c18,
      roughness: 0.2,
      metalness: 0.9,
      side: THREE.DoubleSide,
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    shipGroup.add(wings);

    // Wingtip neon glow edges
    const wingEdgeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const leftTip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.2), wingEdgeMat);
    leftTip.position.set(-1.75, 0.45, 0.6);
    shipGroup.add(leftTip);

    const rightTip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.2), wingEdgeMat);
    rightTip.position.set(1.75, 0.45, 0.6);
    shipGroup.add(rightTip);

    // Engine Thrusters Glow
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const leftThruster = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8), thrusterMat);
    leftThruster.rotation.x = Math.PI / 2;
    leftThruster.position.set(-0.4, 0.5, 1.2);
    shipGroup.add(leftThruster);

    const rightThruster = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8), thrusterMat);
    rightThruster.rotation.x = Math.PI / 2;
    rightThruster.position.set(0.4, 0.5, 1.2);
    shipGroup.add(rightThruster);

    shipGroup.position.set(0, 0.3, 0);
    scene.add(shipGroup);

    // Store in Engine Ref
    const eng = engineRef.current;
    eng.scene = scene;
    eng.camera = camera;
    eng.renderer = renderer;
    eng.ship = shipGroup;
    eng.gridSegments = gridSegments;
    eng.particles = starPoints;
    eng.clock.start();

    // Resize Observer for dynamic window scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && eng.renderer && eng.camera) {
          eng.camera.aspect = w / h;
          eng.camera.updateProjectionMatrix();
          eng.renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Procedural Item Spawner Helper
    const spawnItems = (zDist: number) => {
      const lanes = [-6.4, -3.2, 0, 3.2, 6.4];
      const shuffled = [...lanes].sort(() => Math.random() - 0.5);

      // Spawn 1-2 Obstacles
      const obstacleLane = shuffled[0];
      const isBarrier = Math.random() > 0.5;

      let obsMesh: THREE.Object3D;
      if (isBarrier) {
        // Red glowing cyber firewall cube
        const obsGeo = new THREE.BoxGeometry(2.4, 1.8, 1.2);
        const obsMat = new THREE.MeshStandardMaterial({
          color: 0xff0044,
          emissive: 0x880022,
          roughness: 0.2,
          metalness: 0.9,
        });
        obsMesh = new THREE.Mesh(obsGeo, obsMat);
        obsMesh.position.set(obstacleLane, 0.9, zDist);

        // Wireframe cage
        const wireGeo = new THREE.WireframeGeometry(obsGeo);
        const wireMat = new THREE.LineBasicMaterial({ color: 0xff3366, linewidth: 2 });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        obsMesh.add(wire);
      } else {
        // Spiked cyber pyramid
        const pyrGeo = new THREE.ConeGeometry(1.4, 2.6, 4);
        pyrGeo.rotateY(Math.PI / 4);
        const pyrMat = new THREE.MeshStandardMaterial({
          color: 0xff3300,
          emissive: 0x992200,
          roughness: 0.4,
        });
        obsMesh = new THREE.Mesh(pyrGeo, pyrMat);
        obsMesh.position.set(obstacleLane, 1.3, zDist);
      }

      scene.add(obsMesh);
      eng.items.push({
        mesh: obsMesh,
        type: "obstacle",
        z: zDist,
        x: obstacleLane,
        lane: obstacleLane,
      });

      // Spawn 1-2 Data Crystals in another lane
      const crystalLane = shuffled[1];
      const cryGeo = new THREE.IcosahedronGeometry(0.75, 0);
      const cryMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x0088cc,
        roughness: 0.1,
        metalness: 0.9,
      });
      const cryMesh = new THREE.Mesh(cryGeo, cryMat);
      cryMesh.position.set(crystalLane, 1.1, zDist);

      const cryWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(cryGeo),
        new THREE.LineBasicMaterial({ color: 0x77ffff })
      );
      cryMesh.add(cryWire);

      scene.add(cryMesh);
      eng.items.push({
        mesh: cryMesh,
        type: "crystal",
        z: zDist,
        x: crystalLane,
        lane: crystalLane,
        points: 100,
      });
    };

    // Main Game Render Loop
    let lastTime = performance.now();
    let spawnCounter = 0;

    const animate = () => {
      eng.animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Always animate starfield particles
      if (eng.particles) {
        const positions = eng.particles.geometry.attributes.position.array as Float32Array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += (eng.activeState === "PLAYING" ? eng.speed * 45 : 10) * delta;
          if (positions[i] > 10) {
            positions[i] = -180;
          }
        }
        eng.particles.geometry.attributes.position.needsUpdate = true;
      }

      // If Playing, update gameplay physics & track
      if (eng.activeState === "PLAYING") {
        // 1. Scrolling Grids
        const forwardMove = eng.speed * 40 * delta;
        eng.gridSegments.forEach((grid) => {
          grid.position.z += forwardMove;
          if (grid.position.z >= segmentLength) {
            grid.position.z -= segmentLength * 2;
          }
        });

        // 2. Smooth Steering & Banking Roll
        const dx = eng.targetX - eng.currentX;
        eng.currentX += dx * 10 * delta;
        if (eng.ship) {
          eng.ship.position.x = eng.currentX;
          eng.ship.rotation.z = -dx * 0.25; // Bank into turns
          eng.ship.rotation.y = -dx * 0.15;
          eng.ship.position.y = 0.4 + Math.sin(now * 0.006) * 0.08; // Hover bob
        }

        // 3. Spawn obstacles/crystals periodically
        spawnCounter += forwardMove;
        if (spawnCounter >= 22) {
          spawnCounter = 0;
          spawnItems(-140);
        }

        // 4. Update items & check collisions
        const shipX = eng.currentX;
        const shipZ = 0;

        for (let i = eng.items.length - 1; i >= 0; i--) {
          const item = eng.items[i];
          item.z += forwardMove;
          item.mesh.position.z = item.z;

          // Rotate crystals
          if (item.type === "crystal") {
            item.mesh.rotation.x += 1.8 * delta;
            item.mesh.rotation.y += 2.2 * delta;
          }

          // Collision Check
          const distZ = Math.abs(item.z - shipZ);
          const distX = Math.abs(item.x - shipX);

          if (distZ < 1.6 && distX < 1.4 && !item.collected) {
            item.collected = true;

            if (item.type === "crystal") {
              // Collected Data Crystal!
              playCrystalCollect();
              eng.combo += 1;
              const newMult = Math.min(8, Math.floor(eng.combo / 4) + 1);
              eng.multiplier = newMult;
              eng.score += (item.points || 100) * newMult;

              setScore(eng.score);
              setMultiplier(newMult);
              setComboCount(eng.combo);

              // Flash visual effect
              scene.remove(item.mesh);
              eng.items.splice(i, 1);
              continue;
            } else if (item.type === "obstacle") {
              // Hit Obstacle!
              playCrashSound();
              eng.combo = 0;
              eng.multiplier = 1;
              eng.shields -= 1;

              setShields(eng.shields);
              setMultiplier(1);
              setComboCount(0);

              // Screen camera shake
              if (camera) {
                camera.position.x = (Math.random() - 0.5) * 0.8;
                camera.position.y = 3.2 + (Math.random() - 0.5) * 0.8;
                setTimeout(() => {
                  camera.position.x = 0;
                  camera.position.y = 3.2;
                }, 120);
              }

              scene.remove(item.mesh);
              eng.items.splice(i, 1);

              // Check for Game Over
              if (eng.shields <= 0) {
                playGameOverSound();
                eng.activeState = "GAMEOVER";
                setGameState("GAMEOVER");

                if (eng.score > highScore) {
                  setHighScore(eng.score);
                  setNewHighScoreAlert(true);
                }
                continue;
              }
              continue;
            }
          }

          // Remove items that passed behind camera
          if (item.z > 15) {
            scene.remove(item.mesh);
            eng.items.splice(i, 1);
          }
        }

        // 5. Gradual Speed Ramp & Passive Score
        eng.baseSpeed = Math.min(2.4, eng.baseSpeed + 0.008 * delta);
        if (!eng.isBoosting) {
          eng.speed = eng.baseSpeed;
        }
        eng.score += Math.round(eng.speed * 10 * delta);
        setScore(eng.score);
        setCurrentSpeed(Math.round(eng.speed * 100));
      }

      // Render Three.js Scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (eng.animationFrameId) {
        cancelAnimationFrame(eng.animationFrameId);
      }
      resizeObserver.disconnect();

      // Clean up Three.js objects
      eng.items.forEach((item) => scene.remove(item.mesh));
      scene.clear();
      renderer.dispose();
    };
  }, [highScore, setHighScore]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none bg-black font-mono flex flex-col justify-between"
    >
      {/* 3D WebGL Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block z-0" />

      {/* Top Cyber Arcade HUD */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
        {/* Left Stats: Score & Multiplier */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Score</span>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow">
              {score.toLocaleString().padStart(6, "0")}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
              multiplier > 1
                ? `${themeConfig.bgSubtle} ${themeConfig.border} text-emerald-400 font-bold`
                : "bg-zinc-900/80 border-zinc-800 text-zinc-400"
            } text-xs`}
          >
            <Sparkles size={13} className={multiplier > 1 ? "animate-pulse" : ""} />
            <span>x{multiplier}</span>
            {comboCount > 0 && (
              <span className="text-[10px] text-zinc-500 font-normal">({comboCount})</span>
            )}
          </div>
        </div>

        {/* Center: Shield Bars */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase hidden sm:inline">Shields</span>
          <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-800">
            {[1, 2, 3].map((shieldIdx) => (
              <div
                key={shieldIdx}
                className={`h-3 w-6 rounded-sm transition-all duration-300 ${
                  shields >= shieldIdx
                    ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    : "bg-zinc-800/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Speed Gauge & Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <Gauge size={13} className="text-cyan-400" />
            <span>{currentSpeed} km/s</span>
          </div>

          <button
            onClick={() => {
              playUiClick();
              toggleSound();
            }}
            className="p-1.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {gameState === "PLAYING" && (
            <button
              onClick={pauseGame}
              className="p-1.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Pause (P)"
            >
              <Pause size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Center Modals: Start Screen, Pause Screen, Game Over Screen */}
      {gameState === "START" && (
        <div className="relative z-20 m-auto max-w-sm w-full p-6 rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-md text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <div
              className={`p-3 rounded-2xl ${themeConfig.bgSubtle} border ${themeConfig.border} ${themeConfig.text} shadow-lg`}
            >
              <Gamepad2 size={36} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">CYBER_RUNNER 3D</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Endless WebGL flight simulation. Dodge obstacles, collect neon data crystals.
            </p>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {(["normal", "nitro", "zen"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  playUiClick();
                  setDifficulty(d);
                }}
                className={`px-3 py-1 text-xs rounded-full border capitalize transition-all cursor-pointer ${
                  difficulty === d
                    ? `${themeConfig.bg} text-black font-bold border-transparent`
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                {d === "zen" ? "Zen (No Death)" : d}
              </button>
            ))}
          </div>

          {/* High Score Banner */}
          {highScore > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 py-1.5 px-3 rounded-lg">
              <Trophy size={14} />
              <span>Record: {highScore.toLocaleString()} PTS</span>
            </div>
          )}

          {/* Controls legend */}
          <div className="text-[11px] text-zinc-500 space-y-1 border-t border-zinc-800/80 pt-3">
            <p>Steer: [A] / [D] or [Left] / [Right]</p>
            <p>Hyper Boost: [Spacebar] or [W]</p>
          </div>

          <button
            onClick={() => startGame()}
            className={`w-full py-3 rounded-xl font-black text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${themeConfig.bg} text-black hover:opacity-90 ${themeConfig.shadow}`}
          >
            <Play size={16} fill="currentColor" />
            <span>Launch Flight</span>
          </button>
        </div>
      )}

      {gameState === "PAUSED" && (
        <div className="relative z-20 m-auto max-w-xs w-full p-6 rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-md text-center space-y-4 animate-in fade-in duration-150">
          <h3 className="text-lg font-black text-white tracking-widest uppercase">System Paused</h3>
          <p className="text-xs text-zinc-400">Simulation holding coordinates.</p>

          <div className="space-y-2 pt-2">
            <button
              onClick={pauseGame}
              className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${themeConfig.bg} text-black`}
            >
              <Play size={14} fill="currentColor" />
              <span>Resume Flight</span>
            </button>

            <button
              onClick={() => startGame()}
              className="w-full py-2.5 rounded-lg text-xs font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              <span>Restart Mission</span>
            </button>
          </div>
        </div>
      )}

      {gameState === "GAMEOVER" && (
        <div className="relative z-20 m-auto max-w-sm w-full p-6 rounded-2xl border border-red-900/60 bg-zinc-950/95 shadow-2xl backdrop-blur-md text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-md">
            <Shield size={32} />
          </div>

          <div>
            <h3 className="text-xl font-black text-red-400 tracking-tight">HULL CRITICAL // CRASHED</h3>
            <p className="text-xs text-zinc-400 mt-1">Energy shields fully depleted.</p>
          </div>

          {newHighScoreAlert && (
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-pulse">
              <Trophy size={14} />
              <span>NEW ALL-TIME HIGH SCORE!</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-left">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Mission Score</span>
              <p className="text-lg font-black text-white">{score.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Record High</span>
              <p className="text-lg font-black text-amber-400">{Math.max(score, highScore).toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={() => startGame()}
            className={`w-full py-3 rounded-xl font-black text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${themeConfig.bg} text-black hover:opacity-90 ${themeConfig.shadow}`}
          >
            <RotateCcw size={15} />
            <span>Reboot Flight Deck</span>
          </button>
        </div>
      )}

      {/* Bottom Mobile / Touch Steer Buttons */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={steerLeft}
            className="flex h-12 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-200 active:bg-emerald-500 active:text-black transition-colors cursor-pointer shadow-lg"
            title="Steer Left (A / Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={steerRight}
            className="flex h-12 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-200 active:bg-emerald-500 active:text-black transition-colors cursor-pointer shadow-lg"
            title="Steer Right (D / Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="text-[11px] text-zinc-500 hidden sm:block">
          Use Arrow Keys or A / D to steer • Spacebar to Boost
        </div>

        <button
          onClick={() => {
            const eng = engineRef.current;
            if (eng.activeState === "PLAYING") {
              eng.isBoosting = true;
              eng.speed = eng.baseSpeed * 1.6;
              playBoostSound();
              setTimeout(() => {
                eng.isBoosting = false;
                eng.speed = eng.baseSpeed;
              }, 400);
            }
          }}
          className={`flex h-12 px-4 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 ${themeConfig.text} active:bg-cyan-500 active:text-black transition-colors cursor-pointer font-bold text-xs shadow-lg`}
          title="Boost Thrusters (Spacebar)"
        >
          <Zap size={16} />
          <span>BOOST</span>
        </button>
      </div>
    </div>
  );
}
