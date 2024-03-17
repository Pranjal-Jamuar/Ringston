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
  loader.load("ring.glb", function (gltf) {
    ring = gltf.scene
    ring.position.set(0, 0, 0)
    ring.scale.set(0.5, 0.5, 0.5)
    scene.add(ring)

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "section.details",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      defaults: {
        ease: "power3.out",
        duration: 3,
      },
    })

    timeline.to(ring.position, {
      z: 3.5,
      y: -0.34,
    })
    timeline.to(
      ring.rotation,
      {
        z: 1,
      },
      "<"
    )

    function toggleWireframe(model, isWireframe, opacity) {
      model.traverse(function (child) {
        if (child.isMesh && child.material) {
          child.material.wireframe = isWireframe
          child.material.opacity = opacity
          child.material.transparent = true
        }
      })
    }

    const contactTl = gsap.timeline({
      scrollTrigger: {
        trigger: "section.contact",
        start: "top 80%",
        end: "bottom center",
        //toggleActions: 'play none none reverse',
        scrub: true,
        onEnter: () => {
          toggleWireframe(ring, true, 1)
          contactRotation = true
        },
        onEnterBack: () => {
          toggleWireframe(ring, true, 1)
          contactRotation = true
        },
        onLeaveBack: () => {
          toggleWireframe(ring, false, 1)
          //contactRotation = false
        },
        onLeave: () => {
          toggleWireframe(ring, false, 1)
          //contactRotation = false
        },
      },
    })

    contactTl.to(ring.position, {
      z: 0.3,
      x: 0.4,
      y: -0.23,
    })

    const directionalLight = new THREE.DirectionalLight("lightblue", 10)
    directionalLight.position.z = 8
    scene.add(directionalLight)
  })

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

function animateWords() {
  const words = ["Romance", "Rings", "Relationships"]
  let currentIndex = 0
  let split = null
  const textElem = document.querySelector(".primary-h1 span")

  const updateText = () => {
    textElem.textContent = words[currentIndex]
    split = new SplitType(textElem, { type: "chars" })
    animateChars(split.chars)
    currentIndex = (currentIndex + 1) % words.length
  }

  const animateChars = chars => {
    gsap.from(chars, {
      yPercent: 100,
      stagger: 0.03,
      duration: 1.5,
      ease: "power4.out",
      onComplete: () => {
        if (split) {
          split.revert()
        }
      },
    })
  }

  setInterval(updateText, 3000)
}

const inspectParallax = () => {
  const inspectionTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".inspection",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  })
  inspectionTl
    .to(".inspection h2", {
      y: -100,
    })
    .to(
      ".ring-bg",
      {
        y: -50,
        height: 300,
      },
      "<"
    )

  gsap.to(".marquee h3", {
    scrollTrigger: {
      trigger: ".marquee h3",
      start: "top 80%",
      end: "bottom top",
      scrub: true,
    },
    x: 200,
  })
}

const horizontalSlider = () => {
  let mm = gsap.matchMedia()
  mm.add("(min-width: 768px", () => {
    let slider = document.querySelector(".slider")
    let sliderSections = gsap.utils.toArray(".slide")

    let sliderTl = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        trigger: slider,
        pin: true,
        scrub: 1,
        end: () => "+=" + slider.offsetWidth,
      },
    })
    sliderTl
      .to(
        slider,
        {
          xPercent: -66,
        },
        "<"
      )
      .to(
        ".progress",
        {
          width: "100%",
        },
        "<"
      )

    sliderSections.forEach((stop, index) => {
      const slideText = new SplitType(stop.querySelector(".slide-p"), {
        types: "chars",
      })

      sliderTl.from(slideText.chars, {
        opacity: 0,
        y: 10,
        stagger: 0.03,
        scrollTrigger: {
          trigger: stop.querySelector(".slide-p"),
          start: "top bottom",
          end: "bottom center",
          containerAnimation: sliderTl,
          scrub: true,
        },
      })
    })
  })
}

const contactSection = () => {
  gsap.set("h4, .inner-contact span", {
    yPercent: 100,
  })
  gsap.set(".inner-contact p", {
    opacity: 0,
  })

  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".inner-contact",
      start: "-20% center",
      end: "10%  40%",
      scrub: true,
    },
  })

  contactTl
    .to(".line-top, .line-bottom", {
      width: "100%",
    })
    .to("h4, .inner-contact span", {
      yPercent: 0,
    })
    .to(".inner-contact p", {
      opacity: 1,
    })
}

function initRenderLoop() {
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    if (ring) {
      if (!contactRotation) {
        ring.rotation.y = 0.5 * elapsedTime
        ring.rotation.x = 0
        ring.rotation.z = 0
      } else {
        ring.rotation.y = 0
        ring.rotation.x = 0.2 * elapsedTime
        ring.rotation.z = 0.2 * elapsedTime
      }
    }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
}

const smoothScrollSetup = () => {
  const lenis = new Lenis()
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

document.addEventListener("DOMContentLoaded", () => {
  initThreeJS()
  initRenderLoop()

  animateWords()
  inspectParallax()
  horizontalSlider()
  contactSection()
  smoothScrollSetup()
})
