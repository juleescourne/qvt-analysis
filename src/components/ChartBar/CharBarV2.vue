<template>
  <div v-if="!questionID.includes('NO_MOY')" :id="questionID"></div>
  <div v-else class="not-ready" title="No mean value available for this category"></div>
</template>

<script>
import embed from 'vega-embed'
import { convertToJson } from '@/utils/chartbar.utils'
import { useDataStore } from '@/store/datastore'

export default {
  name: 'CharBarV2',
  props: {
    questionID: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    async renderChart() {
      if (this.questionID.includes('NO_MOY')) return

      const store = useDataStore()
      const response = store.getResponseByID(this.questionID)
      const values = convertToJson(response, this.questionID)

      const specification = {
        data: { values },
        title: this.questionID.includes('MOY') ? this.questionID.replace(/^MOY_?/, '') : this.questionID,
        mark: 'bar',
        encoding: {
          y: {
            field: 'number of responses',
            type: 'quantitative',
            title: '',
          },
          x: {
            field: this.questionID,
            type: 'ordinal',
            title: '',
            axis: { labelAngle: 0 },
          },
        },
        width: 90,
        height: 90,
      }

      await this.$nextTick()
      embed(`#${this.questionID}`, specification, { actions: false })
    },
  },
}
</script>

<style scoped>
.not-ready {
  width: 114px;
  height: 124px;
  background: #f3f4f6;
}
</style>
