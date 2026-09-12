# QVTi — Analyse de la qualité de vie au travail

[![CI](https://github.com/juleescourne/qvt-analysis/actions/workflows/ci.yml/badge.svg)](https://github.com/juleescourne/qvt-analysis/actions/workflows/ci.yml)
[![Démo en ligne](https://img.shields.io/badge/démo-en%20ligne-brightgreen)](https://juleescourne.github.io/qvt-analysis/)
![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-lightgrey)](LICENSE)

Application web d'exploration d'enquêtes de qualité de vie au travail : ingestion
CSV côté client, distributions Likert par question, et encodage multidimensionnel
par **visages de Chernoff**.

**▶ [Essayer la démo](https://juleescourne.github.io/qvt-analysis/)** — un clic sur
« Voir la démo avec le jeu d'exemple », rien à téléverser.

> Projet issu de mon portfolio Data — [juleescourne.github.io/portfolio-data-analyst](https://juleescourne.github.io/portfolio-data-analyst/)

![Tableau de bord](docs/images/02-dashboard.webp)

---

## Le problème résolu

Une enquête de qualité de vie au travail produit des dizaines de questions sur
échelle de Likert, pour des centaines de répondants. Les restitutions classiques se
limitent à une moyenne par catégorie — ce qui masque précisément ce qui compte.

Une catégorie à 3,0 de moyenne peut correspondre à un consensus tiède **ou** à deux
groupes diamétralement opposés. Les deux situations n'appellent pas les mêmes
actions, et la moyenne ne les distingue pas.

L'application affiche donc les **distributions complètes**, puis propose une lecture
multidimensionnelle par visages de Chernoff pour repérer des profils de réponse.

---

## Ce que le projet démontre

| Domaine | Éléments concrets |
| --- | --- |
| Ingestion de données | parseur CSV écrit à la main : détection de séparateur hors guillemets, guillemets échappés, BOM, décimales à virgule |
| Qualité des données | réponses hors échelle écartées du comptage plutôt que comptées comme zéro |
| Visualisation | 32 graphiques Vega-Lite, encodage facial multidimensionnel |
| Confidentialité | traitement 100 % local, jeux d'origine retirés pour risque de ré-identification |
| Front-end | Vue 3, Pinia, Vue Router, build et déploiement automatisés |

---

## Les visages de Chernoff

![Visages de Chernoff](docs/images/03-chernoff.webp)

Chaque visage est un répondant. Quatre catégories d'enquête, choisies par
l'utilisateur, sont encodées dans les **yeux**, la **forme**, la **couleur** et la
**bouche**. La position vient d'une projection 2D fournie séparément.

L'idée repose sur un fait cognitif : l'œil compare des visages bien mieux que des
colonnes de chiffres.

**Sa limite, documentée plutôt que passée sous silence** : l'œil n'est pas également
sensible à tous les traits. Un changement de bouche saute aux yeux davantage qu'un
changement de forme, si bien que la variable placée sur la bouche paraîtra plus
déterminante qu'elle ne l'est. C'est une visualisation d'exploration, pas de
restitution — et au-delà d'une centaine de points, les visages se chevauchent et
elle cesse d'être lisible.

---

## Confidentialité

Les jeux de données d'enquête d'origine ont été **retirés du dépôt public**. Croisés,
leurs attributs démographiques et organisationnels permettaient une
ré-identification : dans un service de six personnes, la combinaison tranche d'âge ×
ancienneté × type de contrat suffit souvent à identifier quelqu'un.

Ils sont remplacés par deux fichiers synthétiques dans `public/examples/`.

Le traitement étant entièrement local, **aucune réponse ne quitte le navigateur** :
il n'y a ni serveur, ni envoi, ni stockage distant.

---

## Démarrage rapide

```bash
git clone https://github.com/juleescourne/qvt-analysis.git
cd qvt-analysis
npm ci
npm run serve
```

Détail et dépannage : [INSTALLATION.md](INSTALLATION.md).

---

## Documentation

| Document | Contenu |
| --- | --- |
| [INSTALLATION.md](INSTALLATION.md) | démo en ligne, installation locale, build, dépannage |
| [UTILISATION.md](UTILISATION.md) | format d'entrée, lecture des distributions, usage des visages |
| [ARCHITECTURE.md](ARCHITECTURE.md) | chaîne de traitement, parseur CSV, encodage facial, limites |

---

## Stack

`Vue 3` · `Pinia` · `Vue Router` · `Vega-Lite` · `PixiJS` · `Vue CLI 5`
· `ESLint` · `GitHub Actions` · `GitHub Pages`

---

## Format d'entrée

```text
[ 16 colonnes de métadonnées ] [ PGC1, PGC2, PGC3, MOY_PGC, EVPVP1, ... ]
```

Les questions sont groupées par préfixe de catégorie ; une colonne `MOY_*` est
reconnue comme moyenne de catégorie. Les réponses sont des entiers de 1 à 5.

Un second fichier facultatif fournit les coordonnées 2D (`x`, `y`) des répondants,
une ligne chacun, pour la vue Chernoff.

---

## Limites assumées

- **Le nombre de colonnes de métadonnées est une constante** (`INDEX_FIRST_QUESTION
  = 16`) : un export de structure différente décalerait la détection des catégories.
- **625 images PNG pré-générées** (7,5 Mo) pour couvrir les combinaisons de traits.
  Les générer en SVG diviserait le poids du dépôt par vingt.
- **Tests ciblés** : quatre tests couvrent les filtres croisés, les valeurs invalides
  et la cohérence du jeu synthétique. La couverture ne constitue pas une validation
  psychométrique du questionnaire.

Détail dans [ARCHITECTURE.md](ARCHITECTURE.md#7-limites-connues).

---

## Contexte

Projet développé initialement en équipe dans un cadre universitaire, autour de
l'analyse d'enquêtes de qualité de vie au travail. Republié ici comme projet de
portfolio, centré sur le traitement de données, la visualisation et l'ingénierie
front-end.

---

## Licence

[MIT](LICENSE) — Jules Courné

## Démo : lecture guidée

- Jeu reproductible de 240 profils fictifs, quatre services et 24 questions.
- Cliquer sur une barre applique un filtre partagé à tous les graphiques ; les filtres
  se combinent par intersection et survivent à la navigation vers les visages.
- Vert pétrole : distribution de la sélection ; gris : population complète. Les
  pourcentages utilisent uniquement les réponses valides de chaque question.
- Chernoff : quatre sélecteurs, aperçus 1–5, profils détaillés, grille paginée et
  projection optionnelle. Les axes du jeu d'exemple sont des scores centrés avec
  un léger décalage, pas une ACP.

Régénérer les données : `python scripts/generate_survey_demo.py`.
Vérifier la sélection : `node --test tests/survey.test.mjs`.
Les libellés et corrélations simulées sont pédagogiques ; ce questionnaire n'est
pas une échelle validée et ne décrit aucune organisation réelle.
