<template>
  <div class="selector selector-eyes">
    <label for="eyes">Eyes</label>
    <select id="eyes" v-model="selectedEyes" @change="emitIndex('eyes', selectedEyes)">
      <option disabled value="">Choose metric</option>
      <option v-for="category in listName" :key="`eyes-${category}`" :value="category">{{ category }}</option>
    </select>
  </div>

  <div class="selector selector-form">
    <label for="form">Shape</label>
    <select id="form" v-model="selectedForm" @change="emitIndex('forme', selectedForm)">
      <option disabled value="">Choose metric</option>
      <option v-for="category in listName" :key="`form-${category}`" :value="category">{{ category }}</option>
    </select>
  </div>

  <div class="selector selector-color">
    <label for="color">Color</label>
    <select id="color" v-model="selectedColor" @change="emitIndex('color', selectedColor)">
      <option disabled value="">Choose metric</option>
      <option v-for="category in listName" :key="`color-${category}`" :value="category">{{ category }}</option>
    </select>
  </div>

  <div class="selector selector-mouth">
    <label for="mouth">Mouth</label>
    <select id="mouth" v-model="selectedMouth" @change="emitIndex('mouth', selectedMouth)">
      <option disabled value="">Choose metric</option>
      <option v-for="category in listName" :key="`mouth-${category}`" :value="category">{{ category }}</option>
    </select>
  </div>

  <div class="head-container">
    <img class="head" :src="headImage" alt="Chernoff face feature selector" />
  </div>
</template>

<script>
import { useDataStore } from '@/store/datastore'
import headImage from '@/assets/head.png'

export default {
  name: 'ChernoffHead',
  emits: ['eyes', 'mouth', 'forme', 'color'],
  data() {
    return {
      listName: [],
      selectedColor: '',
      selectedForm: '',
      selectedMouth: '',
      selectedEyes: '',
      store: useDataStore(),
      headImage,
    }
  },
  mounted() {
    this.listName = this.store.getAllCategory()
  },
  methods: {
    emitIndex(feature, category) {
      const questionIDs = this.store.getQuestionIDByCategory(category)
      const meanID = questionIDs.find((id) => id.includes('MOY'))
      if (!meanID) return

      const columnIndex = this.store.getColumnIndexByQuestionID(meanID)
      if (columnIndex >= 0) this.$emit(feature, columnIndex)
    },
  },
}
</script>

<style scoped>
.head-container {
  position: absolute;
  top: 14%;
  left: 20%;
  max-width: 60%;
}

.head {
  max-width: 100%;
  height: auto;
}

.selector {
  position: absolute;
  z-index: 2;
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  text-align: left;
}

.selector select {
  max-width: 100%;
}

.selector-eyes {
  left: 3%;
  top: 8%;
}

.selector-mouth {
  right: 3%;
  top: 65%;
}

.selector-color {
  right: 3%;
  top: 8%;
}

.selector-form {
  left: 3%;
  top: 65%;
}
</style>
