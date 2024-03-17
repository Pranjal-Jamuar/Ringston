import "./styles.css"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import SplitType from "split-type"
import * as dat from "dat.gui"
import * as THREE from "three"
import Lenis from "@studio-freight/lenis"

gsap.registerPlugin(TextPlugin)
gsap.registerPlugin(ScrollTrigger)

const loader = new GLTFLoader()
let ring = null
let contactRotation = false
let renderer, scene, camera

function initThreeJS() {
  // Debug
  const gui = new dat.GUI()
  dat.GUI.toggleHide()

  // Canvas
  const canvas = document.querySelector("canvas.webgl")

  // Scene
  scene = new THREE.Scene()

  // Middle stuff

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  /**
   * Camera
   */
  // Base camera
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 2
  scene.add(camera)

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

document.addEventListener("DOMContentLoaded", () => {
  initThreeJS()
})
