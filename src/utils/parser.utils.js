import { getResultPerQuestion } from './chartbar.utils'
import { INDEX_FIRST_QUESTION } from './constants/constants'

const countDelimiter = (line, delimiter) => {
  let count = 0
  let quoted = false

  for (let index = 0; index < line.length; index++) {
    const char = line[index]
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        index++
      } else {
        quoted = !quoted
      }
    } else if (char === delimiter && !quoted) {
      count++
    }
  }

  return count
}

const detectDelimiter = (line) => {
  const candidates = [',', ';', '\t']
  return candidates.reduce((best, delimiter) =>
    countDelimiter(line, delimiter) > countDelimiter(line, best) ? delimiter : best
  )
}

const parseDelimitedLine = (line, delimiter) => {
  const cells = []
  let current = ''
  let quoted = false

  for (let index = 0; index < line.length; index++) {
    const char = line[index]

    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"'
        index++
      } else {
        quoted = !quoted
      }
    } else if (char === delimiter && !quoted) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

const parseCSV = (csvContent) => {
  if (!csvContent || typeof csvContent !== 'string') return []

  const lines = csvContent
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)

  if (lines.length === 0) return []

  const delimiter = detectDelimiter(lines[0])
  return lines.map((line) => parseDelimitedLine(line, delimiter))
}

const parseNumericValue = (value) => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return Number.NaN
  return value.trim() ? Number(value.trim().replace(',', '.')) : Number.NaN
}

const parseXY = (xyContent) => {
  const rows = parseCSV(xyContent)
  if (rows.length === 0) return []

  const dataRows = rows.slice()
  const firstX = parseNumericValue(dataRows[0]?.[0])
  const firstY = parseNumericValue(dataRows[0]?.[1])

  if (!Number.isFinite(firstX) || !Number.isFinite(firstY)) {
    dataRows.shift()
  }

  return dataRows
    .map((row) => [parseNumericValue(row[0]), parseNumericValue(row[1])])

}

const getColumnData = (index, formattedCSV) => {
  if (!Array.isArray(formattedCSV) || formattedCSV.length < 2) return []

  return formattedCSV
    .slice(1)
    .map((row) => row[index])
    .filter((cell) => cell !== undefined)
}

const getRawData = (index, formattedCSV) => formattedCSV?.[index]

const getCellData = (row, col, formattedCSV) => formattedCSV?.[row]?.[col]

const getColumnIndexByQuestionID = (questionID, formattedCSV) => {
  const header = formattedCSV?.[0]
  if (!Array.isArray(header)) return -1
  return header.findIndex((column) => column === questionID)
}

const getResponseByID = (questionID, formattedCSV) => {
  const columnIndex = getColumnIndexByQuestionID(questionID, formattedCSV)
  if (columnIndex === -1) return [0, 0, 0, 0, 0]
  return getResultPerQuestion(getColumnData(columnIndex, formattedCSV))
}

const getQuestionIDByCategory = (category, formattedCSV) => {
  const header = formattedCSV?.[0]
  if (!Array.isArray(header) || !category) return []
  return header.filter((column) => column.includes(category))
}

const categoryName = (column) =>
  column.replace(/[0-9]|T_R|A5|E[4-5]|_inversé/gi, '')

const getAllCategory = (formattedCSV) => {
  const header = formattedCSV?.[0]
  if (!Array.isArray(header)) return []

  const categories = []
  for (let colIndex = INDEX_FIRST_QUESTION; colIndex < header.length; colIndex++) {
    const category = categoryName(header[colIndex])
    if (!categories.includes(category) && category !== header[colIndex]) {
      categories.push(category)
    }
  }
  return categories
}

const getAllMeans = (formattedCSV) => {
  const header = formattedCSV?.[0]
  if (!Array.isArray(header)) return []

  const means = []
  for (let colIndex = INDEX_FIRST_QUESTION; colIndex < header.length; colIndex++) {
    const mean = categoryName(header[colIndex])
    if (!means.includes(mean) && mean === header[colIndex]) {
      means.push(mean)
    }
  }
  return means
}

export {
  parseCSV,
  parseXY,
  parseNumericValue,
  getRawData,
  getColumnData,
  getCellData,
  getColumnIndexByQuestionID,
  getResponseByID,
  getQuestionIDByCategory,
  getAllCategory,
  getAllMeans,
}
