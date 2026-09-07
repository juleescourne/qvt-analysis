<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'ButtonCSV',
  components: { Icon },
  props: {
    identifiant: {
      type: String,
      required: true,
    },
    nom: {
      type: String,
      required: true,
    },
  },
  emits: ['file-selected'],
  methods: {
    openFileNav() {
      this.$refs.fileInput.click()
    },
    handleFile(event) {
      const file = event.target.files?.[0]
      if (file) this.$emit('file-selected', file)
    },
  },
}
</script>

<template>
  <button class="btn-upload" type="button" @click="openFileNav">
    <Icon class="btn-upload-icon" icon="ic:round-upload" color="white" :inline="true" />
    <span class="btn-upload-name">{{ nom }}</span>
    <input
      :id="identifiant"
      ref="fileInput"
      type="file"
      hidden
      accept=".csv,text/csv"
      @change="handleFile"
    />
  </button>
</template>

<style scoped>
.btn-upload {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: max-content;
  padding: 0.9rem 1.4rem;
  border: 0;
  border-radius: 24px;
  background: #300a44;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.btn-upload-name {
  color: #fff;
  font-family: 'Space Mono', monospace;
  font-size: 1rem;
  font-weight: 650;
}

.btn-upload-icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
