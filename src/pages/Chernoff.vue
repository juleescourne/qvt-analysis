<template>
  <div class="chernoff-page">
    <section class="screen graph-panel">
      <ChernoffGraph
        :eyes-index="eyesInd"
        :mouth-index="mouthInd"
        :color-index="colorInd"
        :forme-index="formeInd"
      />
    </section>
    <section class="screen selector-panel">
      <ChernoffHead
        @eyes="eyesInd = $event"
        @mouth="mouthInd = $event"
        @color="colorInd = $event"
        @forme="formeInd = $event"
      />
    </section>
  </div>
</template>

<script>
import ChernoffHead from '@/components/Chernoff/ChernoffHead'
import ChernoffGraph from '@/components/Chernoff/ChernoffGraph'

export default {
  name: 'ChernoffPage',
  components: {
    ChernoffGraph,
    ChernoffHead,
  },
  data() {
    return {
      eyesInd: undefined,
      mouthInd: undefined,
      formeInd: undefined,
      colorInd: undefined,
    }
  },
}
</script>

<style scoped>
.chernoff-page {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 1rem;
  min-height: calc(100vh - 72px);
  padding: 1rem;
}

.screen {
  position: relative;
  min-height: 650px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  overflow: auto;
}

.graph-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1000px) {
  .chernoff-page {
    grid-template-columns: 1fr;
  }
}
</style>
