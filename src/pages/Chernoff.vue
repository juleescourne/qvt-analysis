<template>
  <main class="workspace">
    <header class="page-header"><p class="eyebrow">Lecture multivariée</p><h1>Quatre dimensions, un visage</h1><p>Chaque visage représente une personne. Choisissez les dimensions à comparer ; la population filtrée dans le dashboard est conservée.</p></header>
    <section v-if="!store.rows.length" class="panel"><p>Chargez d’abord le jeu d’exemple ou votre enquête.</p><router-link to="/">Ouvrir le dashboard →</router-link></section>
    <template v-else>
      <p class="notice" v-if="store.selectedRows.length !== store.rows.length">{{ store.selectedRows.length }} personnes sélectionnées sur {{ store.rows.length }}. <router-link to="/">Modifier les filtres</router-link></p>
      <div class="chernoff-grid">
        <section class="panel"><h2>Associer les variables</h2><p class="small">Les aperçus montrent exactement l’effet du score 1 à 5 sur chaque trait. Les autres traits restent au niveau 3.</p>
          <div v-for="(feature, index) in features" :key="feature.key" class="mapping-row">
            <label :for="feature.key"><strong>{{ index+1 }} · {{ feature.label }}</strong></label>
            <select :id="feature.key" v-model="mapping[index]" style="width:100%;margin:8px 0"><option v-for="id in means" :key="id" :value="id">{{ label(id) }}</option></select>
            <p class="small">{{ definition(mapping[index]) }}</p>
            <div class="face-scale"><figure v-for="level in 5" :key="level"><img :src="preview(index, level)" :alt="`${feature.label}, niveau ${level}`"><figcaption>{{ level }}</figcaption></figure></div>
          </div>
        </section>
        <section class="panel"><h2>Comparer les profils</h2><p>{{ validFaces.length }} profils complets · {{ store.selectedRows.length - validFaces.length }} exclus (valeur manquante ou hors échelle).</p>
          <div class="actions"><label>Vue <select v-model="mode"><option value="grid">Grille lisible</option><option v-if="store.getCSVDatabis.length === store.rows.length" value="projection">Projection XY</option></select></label></div>
          <p class="small">Moyennes 1–5, arrondies au plus proche pour choisir l’image. La forme ou la couleur ne représente ni une émotion ni un diagnostic. Un même visage peut masquer de petites différences de scores.</p>
          <template v-if="mode === 'grid'"><div class="face-list"><div v-for="face in pageFaces" :key="face.id" class="face-card"><img :src="face.img" :alt="face.description"><details><summary>{{ face.id }}</summary><p v-for="(value, i) in face.values" :key="i">{{ features[i].label }} · {{ label(mapping[i]) }} : {{ value.toFixed(2) }}</p></details></div></div><div class="actions" style="margin-top:16px"><button :disabled="page===0" @click="page--">Précédent</button><span>{{ validFaces.length ? page+1 : 0 }} / {{ Math.ceil(validFaces.length/48) }}</span><button :disabled="(page+1)*48>=validFaces.length" @click="page++">Suivant</button></div></template>
          <template v-else><p class="small">{{ store.projectionSynthetic ? 'Axes illustratifs : X = moyenne Conditions de travail − 3 ; Y = moyenne Engagement − 3. Un léger décalage déterministe sépare les ex æquo. Ce n’est pas une ACP.' : 'Coordonnées importées : leur méthode et leur signification dépendent du fichier source. Les lignes doivent correspondre à l’ordre des répondants.' }}</p><ChernoffGraph :faces="validFaces" :labels="mapping.map(label)" /></template>
        </section>
      </div>
      <section class="panel"><h2>Définir les métriques avant de conclure</h2><p>Pour l’exemple, chaque dimension est la moyenne de trois items positifs, calculée s’il reste au moins deux réponses valides. 1 = désaccord ; 5 = accord. Les libellés sont pédagogiques : le questionnaire synthétique n’est pas une échelle psychométrique validée.</p><p>La vue sert à repérer des profils à approfondir. Les traits n’ont pas la même saillance visuelle : confirmer les observations avec les distributions et les effectifs du dashboard.</p></section>
    </template>
  </main>
</template>
<script>
import { useDataStore } from '@/store/datastore'
import { getImages } from '@/utils/tchernov.utils'
import { DICTIONARY, categoryOf, numeric, rating } from '@/utils/survey'
import ChernoffGraph from '@/components/Chernoff/ChernoffGraph'
export default {
  name: 'ChernoffPage', components: { ChernoffGraph },
  data: () => ({ store: useDataStore(), mapping: [], page: 0, mode: 'grid', features: [{key:'color',label:'Couleur'},{key:'shape',label:'Forme du visage'},{key:'mouth',label:'Bouche'},{key:'eyes',label:'Yeux'}] }),
  computed: {
    means() { return this.store.header.filter(id => id.startsWith('MOY')) },
    validFaces() { if(this.mapping.length !== 4) return []; return this.store.selectedRows.map(row => { const values = this.mapping.map(id => numeric(row[this.store.header.indexOf(id)])); if(values.some(v => rating(v,true) === null)) return null; const rowIndex = this.store.rows.indexOf(row); return { id: `Profil ${rowIndex+1}`, values, img: getImages(...values.map(Math.round)), x: this.store.getCSVDatabis[rowIndex]?.[0], y: this.store.getCSVDatabis[rowIndex]?.[1], description: values.map((v,i) => `${this.features[i].label} : ${this.label(this.mapping[i])} ${v.toFixed(2)}`).join(', ') } }).filter(Boolean) },
    pageFaces() { return this.validFaces.slice(this.page*48,(this.page+1)*48) },
  },
  watch: { validFaces() { this.page = 0 } },
  created() { this.mapping = ['MOY_EVPVP','MOY_CONF','MOY_RECO','MOY_ENG'].map((id,i) => this.means.includes(id) ? id : this.means[i % this.means.length]) },
  methods: {
    label(id) { return this.store.synthetic ? DICTIONARY[categoryOf(id || '')]?.[0] || id : id },
    definition(id) { return this.store.synthetic ? DICTIONARY[categoryOf(id || '')]?.[1] || '' : 'Moyenne fournie par le fichier. Vérifier le sens de cette dimension dans votre questionnaire.' },
    preview(index, level) { const v = [3,3,3,3]; v[index] = level; return getImages(...v) },
  },
}
</script>
<style scoped>.mapping-row{padding:16px 0;border-top:1px solid var(--line)}</style>
