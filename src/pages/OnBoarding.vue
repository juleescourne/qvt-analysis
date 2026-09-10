<template>
  <div v-if="csv.length === 0">
    <section class="onboarding">
      <AnimationPixieVue />
      <h1 class="app-name">{{ APPNAME }}</h1>
      <p class="subtitle">
        Load a survey CSV to explore Likert-scale responses. The optional projection CSV is used by the Chernoff-face view.
      </p>
      <div class="upload-buttons">
        <button class="btn-sample" type="button" :disabled="loadingSample" @click="loadSampleData">
          {{ loadingSample ? 'Chargement…' : 'Voir la démo avec le jeu d’exemple' }}
        </button>
      </div>
      <p class="sample-note">
        Le jeu d’exemple est synthétique&nbsp;: il ne contient aucune réponse réelle.
        Vous pouvez aussi charger vos propres fichiers.
      </p>
      <div class="upload-buttons upload-buttons--secondary">
        <ButtonCSV identifiant="survey-input" nom="Survey CSV" @file-selected="loadSurveyFile" />
        <ButtonCSV identifiant="projection-input" nom="Projection CSV" @file-selected="loadProjectionFile" />
      </div>
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
      loadingSample: false,
    }
  },
  methods: {
    /**
     * Charge les deux fichiers d'exemple servis par l'application.
     * Sans cela une démonstration impose de trouver puis téléverser un CSV,
     * ce que personne ne fait sur un portfolio.
     */
    async loadSampleData() {
      this.loadingSample = true
      this.statusMessage = ''
      const base = process.env.BASE_URL || '/'

      try {
        const [survey, projection] = await Promise.all([
          fetch(`${base}examples/survey_sample.csv`),
          fetch(`${base}examples/projection_sample.csv`),
        ])
        if (!survey.ok) throw new Error(`survey_sample.csv (HTTP ${survey.status})`)

        this.applySurvey(await survey.text())

        if (projection.ok) {
          const store = useDataStore()
          store.setCSVDataBis(parseXY(await projection.text()))
        }
      } catch (error) {
        this.statusMessage = `Impossible de charger le jeu d’exemple : ${error.message}`
      } finally {
        this.loadingSample = false
      }
    },

    /** Alimente le store et construit les colonnes de graphiques. */
    applySurvey(text) {
      const store = useDataStore()
      store.initStore(text)
      this.csv = store.getCSVData

      if (this.csv.length < 2) {
        this.csv = []
        this.statusMessage = 'The survey file does not contain usable rows.'
        return
      }

      this.categories = getAllCategory(this.csv)
      this.means = getAllMeans(this.csv)
      this.charGroups = this.buildColumns(this.categories)
      this.statusMessage = `${this.csv.length - 1} réponses chargées · ${this.categories.length} catégories`
    },

    /**
     * Répartit les catégories en colonnes équilibrées.
     * Les bornes étaient auparavant codées en dur (0-8, 8-13, 13-20, 20+), ce qui
     * entassait toutes les catégories dans la première colonne dès que l'enquête
     * en comptait moins de neuf, et laissait les trois autres vides.
     */
    buildColumns(categories) {
      const columnCount = Math.min(4, Math.max(1, Math.ceil(categories.length / 3)))
      const columns = Array.from({ length: columnCount }, () => [])
      categories.forEach((category, index) => {
        columns[index % columnCount].push(category)
      })
      return columns
    },

    async loadSurveyFile(file) {
      this.applySurvey(await file.text())
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

.btn-sample {
  padding: 1rem 1.9rem;
  border: 0;
  border-radius: 24px;
  background: #300a44;
  color: #fff;
  font-family: 'Space Mono', monospace;
  font-size: 1.05rem;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(48, 10, 68, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-sample:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(48, 10, 68, 0.32);
}

.btn-sample:focus-visible {
  outline: 3px solid #b07cc6;
  outline-offset: 3px;
}

.btn-sample:disabled {
  opacity: 0.6;
  cursor: progress;
}

.upload-buttons--secondary {
  margin-top: -0.25rem;
}

/* Boutons secondaires : même identité, simplement plus discrets que le bouton
   de démonstration. L'icône de ButtonCSV est blanche en dur, on garde donc
   le fond sombre. */
.upload-buttons--secondary :deep(.btn-upload) {
  padding: 0.55rem 1.05rem;
  opacity: 0.72;
}

.upload-buttons--secondary :deep(.btn-upload-name) {
  font-size: 0.85rem;
}

.upload-buttons--secondary :deep(.btn-upload-icon) {
  width: 1.1rem;
  height: 1.1rem;
}

@media (prefers-reduced-motion: reduce) {
  .btn-sample {
    transition: none;
  }
}
</style>
