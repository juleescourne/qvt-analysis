<template><div ref="host" style="width:100%;min-height:430px"></div></template>
<script>
import embed from 'vega-embed'
import { markRaw } from 'vue'
export default {
  name: 'ChernoffGraph', props: { faces: Array, labels: Array },
  data: () => ({ view: null, generation: 0, observer: null }),
  watch: { faces: {handler: 'renderGraph', deep: true} },
  mounted() { this.observer = new ResizeObserver(() => this.renderGraph()); this.observer.observe(this.$refs.host) },
  beforeUnmount() { this.generation++; this.observer?.disconnect(); this.view?.finalize() },
  methods: {
    async renderGraph() { const generation = ++this.generation; const host = this.$refs.host; if(!host) return; this.view?.finalize(); const values = this.faces.filter(f => Number.isFinite(f.x) && Number.isFinite(f.y)).map(f => ({...f,v0:f.values[0],v1:f.values[1],v2:f.values[2],v3:f.values[3]})); const spec = { width:Math.max(180,host.clientWidth-65), height:360, data:{values}, mark:{type:'image',width:30,height:30}, params:[{name:'zoom',select:'interval',bind:'scales'}], encoding:{x:{field:'x',type:'quantitative',title:'X · coordonnée fournie'},y:{field:'y',type:'quantitative',title:'Y · coordonnée fournie'},url:{field:'img'},tooltip:[{field:'id',title:'Profil'},...this.labels.map((label,i) => ({field:`v${i}`,type:'quantitative',title:label,format:'.2f'}))]}, config:{view:{stroke:null},axis:{gridColor:'#e9eee9',labelFont:'IBM Plex Sans',titleFont:'IBM Plex Sans'}} }; try { const result = await embed(host,spec,{actions:false}); if(generation !== this.generation) result.view.finalize(); else this.view = markRaw(result.view) } catch(e) { if(generation === this.generation) host.textContent = 'La projection ne peut pas être affichée. Utilisez la grille.' } },
  },
}
</script>
