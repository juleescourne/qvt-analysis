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
| Node.js | 24 LTS (version utilisée en CI) | `node --version` |
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

### Activer GitHub Pages une première fois

1. Ouvrez [Settings → Pages](https://github.com/juleescourne/qvt-analysis/settings/pages).
2. Dans **Build and deployment → Source**, sélectionnez **GitHub Actions**.
3. Le workflow existe déjà : inutile d'ajouter un modèle proposé par GitHub.
4. Dans [Actions → Build and deploy demo](https://github.com/juleescourne/qvt-analysis/actions/workflows/deploy-pages.yml),
   cliquez sur **Run workflow**, sélectionnez `main`, puis lancez le workflow.

Une fois Pages activé, `.github/workflows/deploy-pages.yml` vérifie la configuration,
exécute le lint et le build, puis publie automatiquement à chaque push sur `main`.
Les workflows utilisent Node.js 24 et des actions compatibles avec ce runtime.

---

## Problèmes courants

**`Get Pages site failed` / `Not Found` dans `actions/configure-pages`**
Vérifiez d'abord l'activation de Pages et la source **GitHub Actions**, comme indiqué
ci-dessus, puis lancez une nouvelle exécution sur `main`. Le workflow possède déjà
les permissions `pages: write` et `id-token: write` nécessaires au déploiement.
Ajouter seulement `enablement: true` ne suffit pas : l'activation automatique exige
un jeton distinct du `GITHUB_TOKEN`, avec des permissions supplémentaires. Aucun
jeton personnel n'est nécessaire avec l'activation manuelle dans les réglages.

**`Node 20 is being deprecated`**
C'est un avertissement sur le runtime des actions, distinct de l'erreur Pages 404.
Les workflows sont mis à jour pour Node 24 ; ne réactivez pas Node 20 avec
`ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION`. Lancez une nouvelle exécution sur `main`
pour utiliser la configuration mise à jour, plutôt que de relancer un ancien commit.

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
