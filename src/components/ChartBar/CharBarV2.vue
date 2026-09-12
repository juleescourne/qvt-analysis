<template>
  <article class="question-chart">
    <h3>{{ questionID.startsWith('MOY') ? 'Moyenne de catégorie' : questionID }}</h3>
    <p class="small">{{ stats.n }} réponses valides · moyenne {{ stats.mean === null ? '—' : stats.mean.toFixed(2) + '/5' }}</p>
    <div class="bars" role="group" :aria-label="`Filtrer les personnes par ${questionID}`">
      <button v-for="(count, i) in stats.counts" :key="i" class="bar-button" :class="{ selected: store.filters[questionID] === i+1 }"
        :aria-pressed="store.filters[questionID] === i+1" :aria-label="`${questionID}, note ${i+1} : ${count} réponses. Filtrer tous les graphiques.`"
        @click="store.toggleFilter(questionID, i+1)">
        <span class="bar-value">{{ stats.n ? Math.round(count / stats.n * 100) : 0 }} %</span>
        <span class="bar-track"><span class="bar-reference" :style="{ height: `${baseline.n ? baseline.counts[i]/baseline.n*100 : 0}%` }"></span><span class="bar-fill" :style="{ height: `${stats.n ? count/stats.n*100 : 0}%` }"></span></span>
        <span>{{ i+1 }}</span>
      </button>
    </div>
    <p class="small">{{ stats.missing }} non-réponse(s){{ questionID.startsWith('MOY') ? ' · valeurs arrondies pour les barres' : '' }}</p>
  </article>
</template>
<script>
import { useDataStore } from '@/store/datastore'
import { distribution } from '@/utils/survey'
export default {
  name: 'CharBarV2', props: { questionID: { type: String, required: true } },
  data: () => ({ store: useDataStore() }),
  computed: {
    stats() { return distribution(this.store.selectedRows, this.store.header, this.questionID) },
    baseline() { return distribution(this.store.rows, this.store.header, this.questionID) },
  },
}
</script>
