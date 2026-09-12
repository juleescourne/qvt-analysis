<template>
  <section class="panel category-panel">
    <div><p class="eyebrow">{{ category }}</p><h2>{{ title }}</h2><p class="small">{{ description }}</p></div>
    <div class="question-grid"><CharBarV2 v-for="id in ids" :key="id" :question-i-d="id" /></div>
  </section>
</template>
<script>
import CharBarV2 from '@/components/ChartBar/CharBarV2'
import { DICTIONARY, categoryOf } from '@/utils/survey'
import { useDataStore } from '@/store/datastore'
export default {
  name: 'CharBarGroup', props: ['category'], components: { CharBarV2 },
  data: () => ({ store: useDataStore() }),
  computed: {
    ids() { return this.store.header.slice(16).filter(id => categoryOf(id) === this.category).sort((a,b) => Number(b.startsWith('MOY')) - Number(a.startsWith('MOY'))) },
    title() { return this.store.synthetic ? DICTIONARY[this.category]?.[0] || this.category : this.category },
    description() { return this.store.synthetic ? (DICTIONARY[this.category]?.[1] || '') : 'Libellés issus du fichier importé : vérifier le sens et les items inversés dans votre questionnaire.' },
  },
}
</script>
