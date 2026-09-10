const { defineConfig } = require('@vue/cli-service')

// Le site est publié sur GitHub Pages à l'adresse
// https://juleescourne.github.io/qvt-analysis/ : les assets doivent donc être
// résolus depuis ce sous-chemin, et non depuis la racine du domaine.
// En développement, publicPath reste '/'.
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/qvt-analysis/' : '/'
})
