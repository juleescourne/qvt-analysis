<template>
  <div class="stage"></div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { COULEURS } from '@/utils/constants/constants'

export default {
  name: 'AnimationPixie',
  data() {
    return {
      app: null,
      colors: COULEURS,
      numMaxParticle: 150,
      particles: [],
    }
  },
  mounted() {
    this.app = new PIXI.Application({
      transparent: true,
      antialias: true,
      background: 'white',
    })

    this.$el.appendChild(this.app.view)
    this.app.renderer.view.style.display = 'block'
    this.resizeCanvas()
    window.addEventListener('resize', this.resizeCanvas)
    this.app.ticker.add(this.update)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCanvas)
    if (this.app) {
      this.app.ticker.remove(this.update)
      this.app.destroy(true, { children: true })
    }
  },
  methods: {
    resizeCanvas() {
      if (this.app) this.app.renderer.resize(window.innerWidth, window.innerHeight)
    },
    update() {
      this.particles.forEach((particle) => {
        if (
          particle.x < 0 ||
          particle.x > this.app.view.width ||
          particle.y < 0 ||
          particle.y > this.app.view.height
        ) {
          particle.x = Math.random() * this.app.view.width
          particle.y = Math.random() * this.app.view.height
          particle.v = {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5,
          }
        } else {
          particle.x += particle.v.x
          particle.y += particle.v.y
        }
      })

      if (this.particles.length < this.numMaxParticle) {
        const particle = new PIXI.Graphics()
        const color = this.colors[Math.floor(Math.random() * this.colors.length)]
        particle.beginFill(`0x${color}`)
        particle.drawCircle(0, 0, 1 + Math.random() * 6)
        particle.endFill()
        particle.x = Math.random() * this.app.view.width
        particle.y = Math.random() * this.app.view.height
        particle.v = {
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
        }
        this.particles.push(particle)
        this.app.stage.addChild(particle)
      }
    },
  },
}
</script>

<style scoped>
.stage {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
</style>
