<template>
  <div id="magic"></div>
</template>

<script>
import embed from 'vega-embed'
import { generateChernov } from '@/utils/tchernov.utils'
import { useDataStore } from '@/store/datastore'

export default {
  name: 'ChernoffGraph',
  props: {
    eyesIndex: Number,
    mouthIndex: Number,
    formeIndex: Number,
    colorIndex: Number,
  },
  watch: {
    eyesIndex: 'renderGraph',
    mouthIndex: 'renderGraph',
    formeIndex: 'renderGraph',
    colorIndex: 'renderGraph',
  },
  mounted() {
    this.renderGraph()
  },
  methods: {
    async renderGraph() {
      const indices = [this.colorIndex, this.formeIndex, this.mouthIndex, this.eyesIndex]
      if (!indices.every((index) => Number.isInteger(index))) return

      const store = useDataStore()
      const surveyData = store.getCSVData
      const projectionData = store.getCSVDatabis
      if (surveyData.length < 2 || projectionData.length === 0) return

      const specification = generateChernov(surveyData, projectionData, ...indices)
      await this.$nextTick()
      embed('#magic', specification, { actions: false })
    },
  },
}
</script>
