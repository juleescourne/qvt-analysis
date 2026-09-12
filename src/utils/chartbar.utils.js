const getResultPerQuestion = (column) => {
  const counts = [0, 0, 0, 0, 0]

  for (const cell of column) {
    const response = Number(String(cell).trim().replace(',', '.'))
    if (Number.isInteger(response) && response >= 1 && response <= 5) {
      counts[response - 1]++
    }
  }

  return counts
}

const convertToJson = (data, title) =>
  data.map((count, index) => ({
    [title]: (index + 1).toString(),
    'number of responses': count,
  }))

export { getResultPerQuestion, convertToJson }
