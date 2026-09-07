import { defineStore } from 'pinia'
import {
  parseCSV,
  getColumnData as selectColumnData,
  getColumnIndexByQuestionID as findQuestionColumnIndex,
  getResponseByID as selectResponseByID,
  getQuestionIDByCategory as selectQuestionIDsByCategory,
  getAllCategory as selectAllCategories,
  getAllMeans as selectAllMeans,
} from '@/utils/parser.utils'

export const useDataStore = defineStore('data', {
  state: () => ({
    CSVdata: [],
    stockIds: [],
    CSVDatabis: [],
  }),

  getters: {
    getCSVDatabis: (state) => state.CSVDatabis,
    getCSVData: (state) => state.CSVdata,
    getstockIds: (state) => state.stockIds,

    getColumnData: (state) => (index) => selectColumnData(index, state.CSVdata),

    getRawData: (state) => (index) => state.CSVdata[index],

    getCellData: (state) => (row, col) => state.CSVdata[row]?.[col],

    getColumnIndexByQuestionID: (state) => (questionID) =>
      findQuestionColumnIndex(questionID, state.CSVdata),

    getResponseByID: (state) => (questionID) =>
      selectResponseByID(questionID, state.CSVdata),

    getQuestionIDByCategory: (state) => (category) =>
      selectQuestionIDsByCategory(category, state.CSVdata),

    getAllCategory: (state) => () => selectAllCategories(state.CSVdata),

    getAllMeans: (state) => () => selectAllMeans(state.CSVdata),
  },

  actions: {
    setCSVDataBis(data) {
      this.CSVDatabis = data
    },
    setUpData(data) {
      this.CSVdata = data
    },
    addIdinList(id) {
      this.stockIds.push(id)
    },
    initStore(data) {
      this.setUpData(parseCSV(data))
    },
  },
})
