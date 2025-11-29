'use client'

import { useMemo, Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CanvasTexture, RepeatWrapping, Mesh, Vector3, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Line, LineBasicMaterial } from 'three'
import { OrbitControls, Stars } from '@react-three/drei'

// Create Earth texture with dark oceans and lighter landmasses
const createEarthTexture = () => {
  if (typeof document === 'undefined') {
    throw new Error('Document is not available')
  }
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Dark blue ocean base
  ctx.fillStyle = '#0a1a2a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Helper to draw continents
  const drawContinent = (points: number[][], color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      const next = points[i]
      const prev = points[i - 1]
      const midX = (prev[0] + next[0]) / 2
      const midY = (prev[1] + next[1]) / 2
      ctx.quadraticCurveTo(prev[0], prev[1], midX, midY)
    }
    ctx.closePath()
    ctx.fill()
  }

  // North America - light blue-green
  drawContinent([
    [180, 80], [280, 70], [400, 90], [500, 120], [550, 180],
    [540, 250], [520, 320], [480, 380], [420, 420], [350, 450],
    [280, 480], [220, 500], [180, 520], [140, 500], [110, 460],
    [90, 400], [80, 340], [90, 280], [110, 220], [140, 160]
  ], '#2a5a6a')

  // South America
  drawContinent([
    [500, 480], [550, 470], [600, 490], [620, 540], [610, 600],
    [590, 660], [560, 720], [530, 780], [500, 830], [470, 870],
    [440, 900], [410, 920], [380, 910], [400, 860], [430, 810],
    [450, 760], [470, 710], [480, 660], [490, 610], [500, 560]
  ], '#2a5a6a')

  // Europe
  drawContinent([
    [920, 180], [1020, 170], [1080, 190], [1120, 230], [1100, 280],
    [1070, 330], [1030, 370], [980, 390], [930, 380], [890, 350],
    [860, 310], [870, 260], [900, 220]
  ], '#2a5a6a')

  // Africa
  drawContinent([
    [980, 420], [1080, 410], [1140, 450], [1180, 520], [1170, 620],
    [1150, 720], [1120, 820], [1080, 890], [1040, 920], [1000, 910],
    [960, 850], [940, 800], [930, 720], [940, 640], [960, 570]
  ], '#2a5a6a')

  // Asia
  drawContinent([
    [1180, 80], [1380, 70], [1580, 90], [1700, 140], [1760, 210],
    [1800, 300], [1820, 400], [1800, 500], [1750, 580], [1680, 630],
    [1600, 650], [1520, 640], [1440, 610], [1360, 560], [1280, 500],
    [1220, 430], [1200, 350], [1180, 270], [1180, 180]
  ], '#2a5a6a')

  // Australia
  drawContinent([
    [1500, 700], [1620, 690], [1700, 710], [1740, 750], [1720, 800],
    [1680, 840], [1630, 860], [1580, 870], [1530, 860], [1500, 830],
    [1480, 790], [1470, 750], [1480, 720]
  ], '#2a5a6a')

  return canvas
}

// Generate connection points (cities/merchants)
const generateConnectionPoints = () => {
  const points: Vector3[] = []
  const connections: [Vector3, Vector3][] = []
  
  // Major cities/points on the globe
  const cityPositions = [
    // North America
    { lat: 40.7128, lon: -74.0060 }, // New York
    { lat: 34.0522, lon: -118.2437 }, // Los Angeles
    { lat: 41.8781, lon: -87.6298 }, // Chicago
    { lat: 29.7604, lon: -95.3698 }, // Houston
    { lat: 45.5017, lon: -73.5673 }, // Montreal
    { lat: 49.2827, lon: -123.1207 }, // Vancouver
    // Europe
    { lat: 51.5074, lon: -0.1278 }, // London
    { lat: 48.8566, lon: 2.3522 }, // Paris
    { lat: 52.5200, lon: 13.4050 }, // Berlin
    { lat: 40.4168, lon: -3.7038 }, // Madrid
    // Asia
    { lat: 35.6762, lon: 139.6503 }, // Tokyo
    { lat: 31.2304, lon: 121.4737 }, // Shanghai
    { lat: 22.3193, lon: 114.1694 }, // Hong Kong
    { lat: 1.3521, lon: 103.8198 }, // Singapore
    // Australia
    { lat: -33.8688, lon: 151.2093 }, // Sydney
    { lat: -37.8136, lon: 144.9631 }, // Melbourne
  ]

  // Convert lat/lon to 3D positions on sphere
  cityPositions.forEach(city => {
    const phi = (90 - city.lat) * (Math.PI / 180)
    const theta = (city.lon + 180) * (Math.PI / 180)
    const radius = 2.02
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    points.push(new Vector3(x, y, z))
  })

  // Create connections between nearby points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = points[i].distanceTo(points[j])
      // Connect if within reasonable distance
      if (distance < 1.5 && Math.random() > 0.5) {
        connections.push([points[i], points[j]])
      }
    }
  }

  return { points, connections }
}

function ConnectionLines({ connections }: { connections: [Vector3, Vector3][] }) {
  const lines = useMemo(() => {
    return connections.map(([start, end], index) => {
      const geometry = new BufferGeometry().setFromPoints([start, end])
      return (
        <primitive key={`line-${index}`} object={new Line(geometry, new LineBasicMaterial({ color: "#ffffff", opacity: 0.6, transparent: true }))} />
      )
    })
  }, [connections])

  return <>{lines}</>
}

function ConnectionPoints({ points }: { points: Vector3[] }) {
  const pointsObject = useMemo(() => {
    const geo = new BufferGeometry()
    const positions = new Float32Array(points.length * 3)
    points.forEach((point, i) => {
      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
    })
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    const material = new PointsMaterial({ size: 0.05, color: "#ffffff", sizeAttenuation: false })
    return new Points(geo, material)
  }, [points])

  return <primitive object={pointsObject} />
}

function SatelliteTrails() {
  const trails = useMemo(() => {
    const trailCount = 8
    const trailObjects = []
    for (let i = 0; i < trailCount; i++) {
      const radius = 2.5 + Math.random() * 0.5
      const angle = (i / trailCount) * Math.PI * 2
      const points: Vector3[] = []
      for (let j = 0; j < 20; j++) {
        const t = (j / 19) * Math.PI * 2
        const x = radius * Math.cos(angle + t * 0.1) * Math.cos(t)
        const y = radius * Math.sin(t)
        const z = radius * Math.cos(angle + t * 0.1) * Math.sin(t)
        points.push(new Vector3(x, y, z))
      }
      const geometry = new BufferGeometry().setFromPoints(points)
      const material = new LineBasicMaterial({ color: "#ffffff", opacity: 0.3, transparent: true })
      trailObjects.push(
        <primitive key={i} object={new Line(geometry, material)} />
      )
    }
    return trailObjects
  }, [])

  return <>{trails}</>
}

function Earth() {
  const meshRef = useRef<Mesh>(null)
  const texture = useMemo(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null
    
    try {
      const canvas = createEarthTexture()
      const canvasTexture = new CanvasTexture(canvas)
      canvasTexture.wrapS = RepeatWrapping
      canvasTexture.wrapT = RepeatWrapping
      canvasTexture.needsUpdate = true
      return canvasTexture
    } catch (error) {
      console.error('Error creating Earth texture:', error)
      return null
    }
  }, [])

  const { points, connections } = useMemo(() => generateConnectionPoints(), [])

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        {texture ? (
          <meshStandardMaterial 
            map={texture} 
            roughness={1}
            metalness={0}
            emissive="#001122"
            emissiveIntensity={0.1}
          />
        ) : (
          <meshStandardMaterial color="#0a1a2a" />
        )}
      </mesh>
      <ConnectionLines connections={connections} />
      <ConnectionPoints points={points} />
      <SatelliteTrails />
    </>
  )
}

function GlobeControls() {
  const controlsRef = useRef<any>(null)
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minDistance={3}
      maxDistance={8}
      autoRotate={false}
      rotateSpeed={1}
      enableDamping={true}
      dampingFactor={0.05}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
    />
  )
}

export default function EarthGlobe() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        height: '800px', 
        position: 'relative', 
        margin: '2rem auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0a0f1a', 
        borderRadius: '16px' 
      }}>
        <div style={{ color: '#fff', fontSize: '18px' }}>Loading globe...</div>
      </div>
    )
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px', 
      height: '800px', 
      position: 'relative', 
      margin: '3rem auto',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    }}>
      <Suspense fallback={
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#0a0f1a',
          color: '#fff' 
        }}>
          Loading...
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: '#0a0f1a' }}
          gl={{ antialias: true, alpha: false }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <Earth />
          <GlobeControls />
          <Stars radius={300} depth={60} count={5000} factor={4} fade speed={1} />
        </Canvas>
      </Suspense>
    </div>
  )
}
