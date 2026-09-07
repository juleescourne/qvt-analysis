<template>
  <nav>
    <router-link to="/">Dashboard</router-link>
    <span aria-hidden="true">·</span>
    <router-link to="/chernov">Chernoff faces</router-link>
  </nav>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #fff;
}

#app {
  min-height: 100vh;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

nav a {
  color: #2c3e50;
  font-weight: 700;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
