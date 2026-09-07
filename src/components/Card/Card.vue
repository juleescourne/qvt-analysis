<template>
  <div class="card">
    <img :src="orga.imgSource" :alt="orga.nomOrganisation" />
    <span>{{ orga.nomOrganisation }}</span>
    <div class="card-description">{{ orga.description }}</div>
  </div>
</template>

<script>
export default {
  name: 'CardOrg',
  props: {
    orga: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.card {
  width: min(360px, 90vw);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
}

.card img {
  max-width: 220px;
  max-height: 100px;
  object-fit: contain;
  margin: 1rem;
}

.card span {
  color: #300a44;
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.card-description {
  color: #54565a;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.5;
}
</style>
