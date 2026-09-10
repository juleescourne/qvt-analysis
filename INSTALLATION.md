# Installation

## Voir la démonstration sans rien installer

L'application est déployée sur GitHub Pages :

**<https://juleescourne.github.io/qvt-analysis/>**

Cliquez sur « Voir la démo avec le jeu d'exemple » : les données synthétiques se
chargent et les 32 graphiques s'affichent. Rien à téléverser.

---

## Installation locale

### Prérequis

| Outil | Version | Vérifier |
| --- | --- | --- |
| Node.js | 18 ou supérieur | `node --version` |
| npm | fourni avec Node | `npm --version` |

### Étapes

```bash
git clone https://github.com/juleescourne/qvt-analysis.git
cd qvt-analysis

npm ci
npm run serve
```

Ouvrez l'URL affichée par Vue CLI, généralement <http://localhost:8080>.

> `npm ci` installe exactement les versions du `package-lock.json`. Préférez-le à
> `npm install`, qui peut résoudre des versions différentes.

---

## Vérifier l'installation

```bash
npm run lint -- --no-fix     # analyse statique, sans correction automatique
npm run build                # build de production
```

Les deux doivent réussir. C'est exactement ce qu'exécute l'intégration continue.

> L'option `--no-fix` est importante : `vue-cli-service lint` **corrige
> silencieusement** par défaut. Sans elle, vous ne savez pas si le code passe ou
> s'il a été réécrit pour passer.

---

## Build de production

```bash
npm run build
```

Le résultat est écrit dans `dist/`. Le `publicPath` est réglé sur
`/qvt-analysis/` en production, pour correspondre au sous-chemin GitHub Pages.

Pour un déploiement à la racine d'un domaine, modifiez `vue.config.js` :

```js
publicPath: process.env.NODE_ENV === 'production' ? '/' : '/'
```

Le déploiement est automatique : `.github/workflows/deploy-pages.yml` lint, build et
publie à chaque push sur `main`.

---

## Problèmes courants

**`Parsing error: Unexpected token <` au lint**
La configuration ESLint est absente. Elle doit exister à la racine
(`.eslintrc.js`) : sans elle, ESLint retombe sur ses valeurs par défaut
(ECMAScript 5, aucun parseur Vue) et rejette aussi bien `import` que la balise
`<template>`.

**`Browserslist: caniuse-lite is outdated`**
Avertissement sans conséquence sur le build. Pour le faire taire :
`npx update-browserslist-db@latest` — cela modifie `package-lock.json`.

**Les graphiques ne s'affichent pas après chargement d'un CSV**
Vérifiez la structure du fichier : 16 colonnes de métadonnées, puis les colonnes de
questions nommées `PREFIXE1`, `PREFIXE2`… Comparez avec
`public/examples/survey_sample.csv`.

**Page blanche après déploiement**
Le `publicPath` ne correspond pas au chemin de publication. Les fichiers sont
demandés à la racine alors qu'ils sont dans un sous-répertoire.
