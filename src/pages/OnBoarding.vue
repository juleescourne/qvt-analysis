<template>
  <div v-if="csv.length === 0">
    <section class="onboarding">
      <AnimationPixieVue />
      <h1 class="app-name">{{ APPNAME }}</h1>
      <p class="subtitle">
        Load a survey CSV to explore Likert-scale responses. The optional projection CSV is used by the Chernoff-face view.
      </p>
      <div class="upload-buttons">
        <ButtonCSV identifiant="survey-input" nom="Survey CSV" @file-selected="loadSurveyFile" />
        <ButtonCSV identifiant="projection-input" nom="Projection CSV" @file-selected="loadProjectionFile" />
      </div>
      <p class="sample-note">
        Synthetic examples are available in <code>public/examples/</code>.
      </p>
      <p v-if="statusMessage" class="status">{{ statusMessage }}</p>
    </section>

    <section class="organisation-cards">
      <Card v-for="(organisation, index) in ORGANISATIONS" :key="index" :orga="organisation" />
    </section>
  </div>

  <section v-else class="chart-panel">
    <div v-for="(group, groupIndex) in charGroups" :key="groupIndex" class="chart-column">
      <CharBarGroup v-for="category in group" :key="category" :category="category" :csv="csv" />
    </div>
  </section>
</template>

<script>
import { ORGANISATIONS, APPNAME } from '@/utils/constants/constants'
import { getAllCategory, getAllMeans, parseXY } from '@/utils/parser.utils'
import CharBarGroup from '@/components/CharBarGroup/CharBarGroup'
import { useDataStore } from '@/store/datastore'
import ButtonCSV from '@/components/button/ButtonCSV.vue'
import Card from '@/components/Card/Card.vue'
import AnimationPixieVue from '@/components/AnimationPixie.vue'

export default {
  name: 'OnBoarding',
  components: {
    CharBarGroup,
    ButtonCSV,
    Card,
    AnimationPixieVue,
  },
  data() {
    return {
      csv: [],
      categories: [],
      means: [],
      charGroups: [[], [], [], []],
      ORGANISATIONS,
      APPNAME,
      statusMessage: '',
    }
  },
  methods: {
    async loadSurveyFile(file) {
      const store = useDataStore()
      const text = await file.text()
      store.initStore(text)
      this.csv = store.getCSVData

      if (this.csv.length < 2) {
        this.csv = []
        this.statusMessage = 'The survey file does not contain usable rows.'
        return
      }

      this.categories = getAllCategory(this.csv)
      this.means = getAllMeans(this.csv)
      this.charGroups = [
        this.categories.slice(0, 8),
        this.categories.slice(8, 13),
        this.categories.slice(13, 20),
        this.categories.slice(20),
      ]
      this.statusMessage = `${this.csv.length - 1} survey rows loaded.`
    },

    async loadProjectionFile(file) {
      const store = useDataStore()
      const text = await file.text()
      const projection = parseXY(text)
      store.setCSVDataBis(projection)
      this.statusMessage = `${projection.length} projection coordinates loaded.`
    },
  },
}
</script>

<style scoped>
.onboarding {
  min-height: 52vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.app-name {
  margin: 0;
  color: #300a44;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
}

.subtitle,
.sample-note,
.status {
  max-width: 760px;
  margin: 0;
}

.subtitle {
  color: #54565a;
  font-size: 1.05rem;
}

.upload-buttons,
.organisation-cards,
.chart-panel {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.organisation-cards {
  align-items: flex-start;
  padding: 1rem 2rem 3rem;
}

.chart-panel {
  align-items: flex-start;
  padding: 1rem;
  overflow-x: auto;
}

.chart-column {
  min-width: 320px;
  flex: 1 1 320px;
}

.status {
  color: #374151;
  font-weight: 600;
}
</style>
