// The demo dictionary describes the synthetic questionnaire, not a validated scale.
export const DICTIONARY = {
  PGC: ['Conditions de travail', 'Moyens, organisation et environnement de travail.'],
  EVPVP: ['Équilibre des temps de vie', 'Compatibilité entre travail et vie personnelle.'],
  RECO: ['Reconnaissance', 'Reconnaissance du travail et des efforts fournis.'],
  COM: ['Communication', 'Clarté et circulation des informations.'],
  JUST: ['Équité', 'Perception de la justice des décisions.'],
  ENG: ['Engagement', 'Envie de contribuer et intérêt pour le travail.'],
  CONF: ['Confiance', 'Confiance envers le collectif et le management.'],
  EQUI: ['Coopération', 'Entraide et soutien au sein de l’équipe.'],
}
export const numeric = value => {
  if (value === null || value === undefined || String(value).trim() === '') return NaN
  return Number(String(value).trim().replace(',', '.'))
}
export const rating = (value, mean = false) => {
  const n = numeric(value)
  return Number.isFinite(n) && n >= 1 && n <= 5 && (mean || Number.isInteger(n)) ? (mean ? Math.round(n) : n) : null
}
export const categoryOf = id => id.replace(/^MOY_?/, '').replace(/\d.*$/, '').replace(/_$/, '')
export const questionColumns = header => header.slice(16).filter(id => !id.startsWith('MOY'))
export const distribution = (rows, header, id) => {
  const counts = [0, 0, 0, 0, 0], index = header.indexOf(id)
  const valid = []
  rows.forEach(row => { const bin = rating(row[index], id.startsWith('MOY')); if (bin !== null) { counts[bin - 1]++; valid.push(numeric(row[index])) } })
  return { counts, n: valid.length, missing: rows.length - valid.length, mean: valid.length ? valid.reduce((a,b) => a+b,0)/valid.length : null }
}
export const filterRows = (rows, header, filters, department = '') => rows.filter(row =>
  (!department || row[header.indexOf('department')] === department) && Object.entries(filters).every(([id, value]) => rating(row[header.indexOf(id)], id.startsWith('MOY')) === value))
