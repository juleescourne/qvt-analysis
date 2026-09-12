<template>
  <main class="workspace">
    <header class="page-header"><p class="eyebrow">Enquête · exploration collective</p><h1>Comprendre les écarts derrière une moyenne</h1>
      <p>Repérez une population dans une distribution, puis comparez ses réponses sur toutes les dimensions du travail.</p></header>
    <section v-if="!store.rows.length" class="panel onboarding">
      <h2>Un cas à explorer en deux minutes</h2>
      <p>Une organisation fictive de 240 personnes, quatre services et huit dimensions. L’objectif : repérer les sujets à approfondir avant de proposer un plan d’action.</p>
      <button class="primary" :disabled="loadingSample" @click="loadSampleData">{{ loadingSample ? 'Chargement…' : 'Voir la démo avec le jeu d’exemple' }}</button>
      <p class="small">Données synthétiques reproductibles. Aucun diagnostic individuel ; aucun effet d’une intervention n’est mesuré.</p>
      <div class="actions"><ButtonCSV identifiant="survey-input" nom="Importer une enquête CSV" @file-selected="loadSurveyFile" /></div>
    </section>
    <template v-else>
      <section class="kpis" aria-live="polite">
        <div class="panel"><strong>{{ store.selectedRows.length }} / {{ store.rows.length }}</strong><span>personnes sélectionnées</span></div>
        <div class="panel"><strong>{{ categories.length }}</strong><span>dimensions observées</span></div>
        <div class="panel"><strong>{{ quality }} %</strong><span>réponses valides aux questions, sélection</span></div>
      </section>
      <section class="panel filter-panel">
        <div class="actions"><label v-if="departments.length">Service <select v-model="store.department"><option value="">Tous les services</option><option v-for="d in departments" :key="d">{{ d }}</option></select></label><button @click="store.resetFilters">Réinitialiser les filtres</button><router-link to="/chernov">Explorer les visages →</router-link></div>
        <p>Cliquez sur une barre : <strong>tous les graphiques portent sur les mêmes personnes</strong>. Les filtres s’intersectent (ET). Recliquez pour retirer un filtre.</p>
        <div class="actions"><button v-for="(value, id) in store.filters" :key="id" class="chip" @click="store.toggleFilter(id, value)">{{ id }} = {{ value }} ×</button></div>
        <p class="small"><span class="legend-swatch"></span> Sélection · gris : population complète. Hauteur = part des réponses valides, sur une échelle fixe de 0 à 100 %. 1 = désaccord, 3 = neutre, 5 = accord pour le jeu d’exemple.</p>
        <p v-if="store.selectedRows.length < 10" class="notice">{{ store.selectedRows.length ? 'Petit effectif : les pourcentages sont instables, ne généralisez pas.' : 'Aucune personne ne correspond à ces filtres. Retirez un filtre pour poursuivre.' }}</p>
      </section>
      <section class="panel"><h2>Question de décision</h2><p>Les personnes qui évaluent peu favorablement la reconnaissance décrivent-elles aussi un engagement plus faible ? Sélectionnez 1 ou 2 sur RECO1, observez ENG, puis retirez le filtre et comparez. Une association sert à préparer des entretiens ; elle ne prouve pas une cause.</p></section>
      <div class="category-grid"><CharBarGroup v-for="category in categories" :key="category" :category="category" /></div>
      <details class="panel"><summary>Données, définitions et imports</summary><p>{{ store.synthetic ? 'Jeu synthétique : 240 répondants, 24 items, environ 2 % de valeurs manquantes. Les différences de services sont simulées, elles ne décrivent aucune organisation réelle.' : 'Fichier importé : interpréter les codes avec votre dictionnaire de questionnaire.' }}</p><p>Une moyenne est calculée sur les réponses valides (1–5). Les moyennes de catégorie viennent des colonnes MOY du fichier ; leur histogramme utilise l’arrondi au plus proche. La complétude exclut ces moyennes et compte les questions individuelles. Aucune mesure d’impact causal ni de représentativité n’est disponible.</p><div class="actions"><ButtonCSV identifiant="replace-survey" nom="Remplacer l’enquête" @file-selected="loadSurveyFile" /><ButtonCSV identifiant="projection-input" nom="Importer une projection XY" @file-selected="loadProjectionFile" /><button @click="loadSampleData">Recharger l’exemple</button></div></details>
    </template>
    <p v-if="statusMessage" role="status">{{ statusMessage }}</p>
  </main>
</template>
<script>
import { useDataStore } from '@/store/datastore'
import { parseXY } from '@/utils/parser.utils'
import { categoryOf, questionColumns, rating } from '@/utils/survey'
import CharBarGroup from '@/components/CharBarGroup/CharBarGroup'
import ButtonCSV from '@/components/button/ButtonCSV'
export default {
  name: 'OnBoarding', components: { CharBarGroup, ButtonCSV },
  data: () => ({ store: useDataStore(), loadingSample: false, statusMessage: '' }),
  computed: {
    categories() { return [...new Set(questionColumns(this.store.header).map(categoryOf))] },
    departments() { const i = this.store.header.indexOf('department'); return i < 0 ? [] : [...new Set(this.store.rows.map(r => r[i]))].filter(Boolean).sort() },
    quality() { const ids = questionColumns(this.store.header); const rows = this.store.selectedRows; const n = rows.length*ids.length; if (!n) return 0; return Math.round(100*rows.reduce((sum,row) => sum+ids.filter(id => rating(row[this.store.header.indexOf(id)]) !== null).length,0)/n) },
  },
  methods: {
    applySurvey(text) { this.store.initStore(text); if (this.store.rows.length === 0 || !questionColumns(this.store.header).length) { this.store.$reset(); throw new Error('Fichier sans questions utilisables après les 16 colonnes de métadonnées.') } },
    async loadSampleData() { this.loadingSample = true; this.statusMessage = ''; try { const base = process.env.BASE_URL || '/'; const [survey,xy] = await Promise.all([fetch(`${base}examples/survey_sample.csv`),fetch(`${base}examples/projection_sample.csv`)]); if (!survey.ok || !xy.ok) throw new Error('Fichiers d’exemple indisponibles'); this.applySurvey(await survey.text()); this.store.synthetic = true; this.store.setCSVDataBis(parseXY(await xy.text())); this.store.projectionSynthetic = true } catch(e) { this.statusMessage = e.message } finally { this.loadingSample = false } },
    async loadSurveyFile(file) { try { this.applySurvey(await file.text()); this.statusMessage = 'Enquête chargée. Les anciens filtres et coordonnées ont été effacés.' } catch(e) { this.statusMessage = e.message } },
    async loadProjectionFile(file) { try { const xy = parseXY(await file.text()); if (xy.length !== this.store.rows.length) throw new Error('La projection doit avoir une ligne par répondant, dans le même ordre.'); if (xy.some(row => row.some(value => !Number.isFinite(value)))) throw new Error('Chaque ligne de projection doit contenir deux coordonnées numériques valides.'); this.store.setCSVDataBis(xy); this.statusMessage = 'Projection chargée.' } catch(e) { this.statusMessage = e.message } },
  },
}
</script>
