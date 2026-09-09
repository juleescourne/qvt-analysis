// Configuration ESLint du projet.
//
// Elle avait disparu lors de la préparation du dépôt public, ce qui faisait
// échouer `npm run lint` : sans config, ESLint retombe sur ses valeurs par
// défaut (ecmaVersion 5, pas de parseur Vue) et rejette aussi bien `import`
// que la balise `<template>` des fichiers .vue.
module.exports = {
  root: true,
  env: {
    node: true,     // module.exports dans vue.config.js / babel.config.js
    browser: true,  // window, document, FileReader… utilisés par l'app
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
