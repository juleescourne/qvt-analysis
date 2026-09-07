import { parseNumericValue } from './parser.utils'

class Point {
  constructor(x, y, a, b, c, d) {
    this.x = x
    this.y = y
    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }
}

const normalizeFeature = (value) => {
  const numeric = parseNumericValue(value)
  if (!Number.isFinite(numeric)) return null
  return Math.min(5, Math.max(1, Math.round(numeric)))
}

const getImages = (a, b, c, d) => {
  const features = [a, b, c, d]
  if (!features.every((value) => Number.isInteger(value) && value >= 1 && value <= 5)) {
    return null
  }

  return require(`../assets/chernov/${a}${b}${c}${d}.png`)
}

/**
 * Build a Vega-Lite specification for a Chernoff-face scatter plot.
 * The survey table contains a header row, while projectionData contains only numeric x/y rows.
 */
const generateChernov = (maincsv, projectionData, dataIndex1, dataIndex2, dataIndex3, dataIndex4) => {
  const rowCount = Math.min(Math.max(maincsv.length - 1, 0), projectionData.length)
  const points = []

  for (let index = 0; index < rowCount; index++) {
    const row = maincsv[index + 1]
    const coordinates = projectionData[index]
    const x = parseNumericValue(coordinates?.[0])
    const y = parseNumericValue(coordinates?.[1])
    const features = [
      normalizeFeature(row?.[dataIndex1]),
      normalizeFeature(row?.[dataIndex2]),
      normalizeFeature(row?.[dataIndex3]),
      normalizeFeature(row?.[dataIndex4]),
    ]

    if (!Number.isFinite(x) || !Number.isFinite(y) || features.includes(null)) continue
    points.push(new Point(x, y, ...features))
  }

  const values = points.map((point) => ({
    x: point.x,
    y: point.y,
    a: point.a,
    b: point.b,
    c: point.c,
    d: point.d,
    img: getImages(point.a, point.b, point.c, point.d),
  }))

  return {
    data: { values },
    mark: { type: 'image', width: 50, height: 50 },
    encoding: {
      x: { field: 'x', type: 'quantitative', title: 'Projection X' },
      y: { field: 'y', type: 'quantitative', title: 'Projection Y' },
      url: { field: 'img', type: 'nominal' },
      tooltip: [
        { field: 'x', type: 'quantitative', title: 'X' },
        { field: 'y', type: 'quantitative', title: 'Y' },
        { field: 'a', type: 'quantitative', title: 'Feature A' },
        { field: 'b', type: 'quantitative', title: 'Feature B' },
        { field: 'c', type: 'quantitative', title: 'Feature C' },
        { field: 'd', type: 'quantitative', title: 'Feature D' },
      ],
    },
    width: 850,
    height: 550,
  }
}

export { getImages, generateChernov, Point }
