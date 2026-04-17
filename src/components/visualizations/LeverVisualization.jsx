import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

// 杠杆原理3D可视化
function LeverViz({ simParams }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const frameRef = useRef(null)
  const objectsRef = useRef({})

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 400

    // 清理旧实例
    if (rendererRef.current) {
      rendererRef.current.dispose()
      if (container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement)
      }
    }

    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1A1A2E)
    sceneRef.current = scene

    // 相机
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 4, 10)
    camera.lookAt(0, 0, 0)

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 10, 7)
    dirLight.castShadow = true
    scene.add(dirLight)

    const goldLight = new THREE.PointLight(0xC9A227, 0.6, 25)
    goldLight.position.set(-3, 5, 3)
    scene.add(goldLight)

    // 地面网格
    const gridHelper = new THREE.GridHelper(20, 20, 0x333366, 0x222244)
    gridHelper.position.y = -2
    scene.add(gridHelper)

    // 杠杆
    const leverGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 16)
    const leverMat = new THREE.MeshStandardMaterial({
      color: 0xC9A227,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0xC9A227,
      emissiveIntensity: 0.1
    })
    const lever = new THREE.Mesh(leverGeo, leverMat)
    lever.rotation.z = Math.PI / 2
    lever.castShadow = true
    scene.add(lever)
    objectsRef.current.lever = lever

    // 支点（三角形支架）
    const supportGeo = new THREE.ConeGeometry(0.4, 1, 3)
    const supportMat = new THREE.MeshStandardMaterial({
      color: 0x8B8B8B,
      metalness: 0.6,
      roughness: 0.4
    })
    const support = new THREE.Mesh(supportGeo, supportMat)
    support.position.y = -1.5
    support.castShadow = true
    scene.add(support)
    objectsRef.current.support = support

    // 支点球
    const pivotGeo = new THREE.SphereGeometry(0.2, 16, 16)
    const pivotMat = new THREE.MeshStandardMaterial({
      color: 0xC9A227,
      emissive: 0xC9A227,
      emissiveIntensity: 0.5
    })
    const pivot = new THREE.Mesh(pivotGeo, pivotMat)
    pivot.position.y = 0
    scene.add(pivot)
    objectsRef.current.pivot = pivot

    // 左侧重物组
    const weightGroup = new THREE.Group()
    const weightGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8)
    const weightMat = new THREE.MeshStandardMaterial({
      color: 0xE94560,
      metalness: 0.4,
      roughness: 0.6
    })
    const leftWeight = new THREE.Mesh(weightGeo, weightMat)
    leftWeight.castShadow = true
    weightGroup.add(leftWeight)
    scene.add(weightGroup)
    objectsRef.current.leftWeight = leftWeight
    objectsRef.current.leftGroup = weightGroup

    // 右侧重物组
    const rightWeightGroup = new THREE.Group()
    const rightWeight = new THREE.Mesh(weightGeo.clone(), weightMat.clone())
    rightWeight.castShadow = true
    rightWeightGroup.add(rightWeight)
    scene.add(rightWeightGroup)
    objectsRef.current.rightWeight = rightWeight
    objectsRef.current.rightGroup = rightWeightGroup

    // 绳子
    const ropeGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 8)
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F0 })
    const leftRope = new THREE.Mesh(ropeGeo, ropeMat)
    scene.add(leftRope)
    objectsRef.current.leftRope = leftRope

    const rightRope = new THREE.Mesh(ropeGeo.clone(), ropeMat.clone())
    scene.add(rightRope)
    objectsRef.current.rightRope = rightRope

    // 更新位置的函数
    const updatePositions = () => {
      const pivotPos = simParams['支点位置'] ?? 0.5
      const powerArm = simParams['动力臂长度'] ?? 1.5
      const resistanceArm = simParams['阻力臂长度'] ?? 1.5
      const power = parseInt(simParams['动力大小']) || 5
      const resistance = (parseInt(simParams['阻力物质量']) || 5) * 9.8 / 100

      const pivotX = (pivotPos - 0.5) * 8
      const leftArmEnd = pivotX - powerArm
      const rightArmEnd = pivotX + resistanceArm

      // 杠杆倾斜
      const leftTorque = power * powerArm
      const rightTorque = resistance * resistanceArm
      const diff = leftTorque - rightTorque
      const tiltAngle = Math.max(-0.25, Math.min(0.25, diff * 0.003))

      lever.position.x = pivotX
      lever.rotation.z = Math.PI / 2 + tiltAngle
      pivot.position.x = pivotX
      support.position.x = pivotX

      // 重物位置
      leftWeight.position.x = leftArmEnd
      leftWeight.position.y = 0.5 - Math.sin(Math.abs(tiltAngle)) * powerArm * 0.5
      leftRope.position.x = leftArmEnd
      leftRope.scale.y = 0.5

      rightWeight.position.x = rightArmEnd
      rightWeight.position.y = 0.5 + Math.sin(Math.abs(tiltAngle)) * resistanceArm * 0.5
      rightRope.position.x = rightArmEnd
      rightRope.scale.y = 0.5
    }

    updatePositions()

    // 动画循环
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      // 支点呼吸动画
      if (objectsRef.current.pivot) {
        objectsRef.current.pivot.position.y = Math.sin(time * 3) * 0.05
        objectsRef.current.pivot.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2
      }

      renderer.render(scene, camera)
    }
    animate()

    // 响应大小变化
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement)
        }
      }
      scene.clear()
    }
  }, [])

  // 更新参数变化
  useEffect(() => {
    if (!objectsRef.current.lever) return

    const pivotPos = simParams['支点位置'] ?? 0.5
    const powerArm = simParams['动力臂长度'] ?? 1.5
    const resistanceArm = simParams['阻力臂长度'] ?? 1.5
    const power = parseInt(simParams['动力大小']) || 5
    const resistance = (parseInt(simParams['阻力物质量']) || 5) * 9.8 / 100

    const pivotX = (pivotPos - 0.5) * 8
    const leftArmEnd = pivotX - powerArm
    const rightArmEnd = pivotX + resistanceArm

    const leftTorque = power * powerArm
    const rightTorque = resistance * resistanceArm
    const diff = leftTorque - rightTorque
    const tiltAngle = Math.max(-0.25, Math.min(0.25, diff * 0.003))

    const lever = objectsRef.current.lever
    lever.position.x = pivotX
    lever.rotation.z = Math.PI / 2 + tiltAngle

    const pivot = objectsRef.current.pivot
    if (pivot) pivot.position.x = pivotX

    const support = objectsRef.current.support
    if (support) support.position.x = pivotX

    const leftWeight = objectsRef.current.leftWeight
    if (leftWeight) {
      leftWeight.position.x = leftArmEnd
      leftWeight.position.y = 0.5 - Math.sin(Math.abs(tiltAngle)) * powerArm * 0.5
    }

    const rightWeight = objectsRef.current.rightWeight
    if (rightWeight) {
      rightWeight.position.x = rightArmEnd
      rightWeight.position.y = 0.5 + Math.sin(Math.abs(tiltAngle)) * resistanceArm * 0.5
    }

    const leftRope = objectsRef.current.leftRope
    if (leftRope) {
      leftRope.position.x = leftArmEnd
      leftRope.position.y = 0.25
    }

    const rightRope = objectsRef.current.rightRope
    if (rightRope) {
      rightRope.position.x = rightArmEnd
      rightRope.position.y = 0.25
    }
  }, [simParams])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  )
}

// 占位可视化（其他案例）
function PlaceholderViz({ caseId, title }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'var(--highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="var(--accent-gold)" strokeWidth="2" strokeDasharray="4 4"/>
          <path d="M14 20h12M20 14v12" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 style={{
        fontSize: '20px',
        fontFamily: 'var(--font-serif)',
        color: 'var(--text-primary)',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        maxWidth: '300px',
        lineHeight: '1.6'
      }}>
        此可视化模块正在开发中，敬请期待...
      </p>
      <div style={{
        marginTop: '24px',
        padding: '12px 24px',
        background: 'var(--highlight)',
        borderRadius: 'var(--radius-md)',
        fontSize: '13px',
        color: 'var(--accent-gold)'
      }}>
        Case ID: {caseId}
      </div>
    </div>
  )
}

export default function LeverVisualization({ caseId, simParams, isFullscreen }) {
  const [containerHeight, setContainerHeight] = useState(400)

  useEffect(() => {
    if (isFullscreen) {
      setContainerHeight(window.innerHeight)
    } else {
      setContainerHeight(500)
    }
  }, [isFullscreen])

  if (caseId !== 'lever') {
    return (
      <div style={{
        width: '100%',
        height: isFullscreen ? '100vh' : `${containerHeight}px`,
        padding: '20px'
      }}>
        <PlaceholderViz caseId={caseId} title={
          caseId === 'refraction' ? '光的折射' :
          caseId === 'equation' ? '二元一次方程组' :
          caseId === 'periodic' ? '元素周期表' : '可视化'
        } />
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: isFullscreen ? '100vh' : `${containerHeight}px`,
      position: 'relative'
    }}>
      <LeverViz simParams={simParams} />
    </div>
  )
}
