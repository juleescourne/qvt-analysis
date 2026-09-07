<template>
  <div class="flex-container" :id="this.$props.category">
  <CharBarV2 v-for="questionId in questionIDArray" :key="questionId" :question-i-d="questionId" :csv="this.$props.csv"/>
</div>
</template>

<script>
import CharBarV2 from "@/components/ChartBar/CharBarV2";
import { getIndexResponseByCategory } from '@/utils/parser.utils'

export default {
  name: 'CharBarGroup',
  props: [ 'category', 'csv' ],
  components: {
    CharBarV2,
  },
  data() {
    return {
      questionIDArray: [],
    }
	},
  mounted () {
    if (typeof this.$props.category === 'object') {
      this.$props.category.forEach(category => {
        this.questionIDArray = this.questionIDArray.concat(getIndexResponseByCategory( category, this.$props.csv ))
      })
    } else {
      this.questionIDArray = getIndexResponseByCategory( this.$props.category, this.$props.csv )
      
    }
    const mean = this.questionIDArray.filter((id) => id.includes('MOY'))[0]
    if (mean) {
      const index = this.questionIDArray.findIndex((item) => { return item === mean})
      this.questionIDArray.splice(index, 1)
      this.questionIDArray.unshift(mean)
    } else {
      this.questionIDArray.unshift(this.questionIDArray[0] + "NO_MOY")  
    }

    if (this.$props.category.includes("ENG") || this.$props.category.includes("OCB")) {
      const container = document.getElementById(this.$props.category)
      container.style.minHeight = '261px';
    }
  }
}
</script>

<style>
.flex-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: solid black 1px;
  border-right: solid black 1px;
}
</style>