import { defineStore } from 'pinia'
import { parseCSV, getColumnIndexByQuestionID, getQuestionIDByCategory, getAllCategory, getAllMeans } from '@/utils/parser.utils'
import { filterRows } from '@/utils/survey'
export const useDataStore = defineStore('data', {
  state: () => ({ CSVdata: [], CSVDatabis: [], filters: {}, department: '', synthetic: false, projectionSynthetic: false }),
  getters: {
    getCSVData: state => state.CSVdata,
    getCSVDatabis: state => state.CSVDatabis,
    rows: state => state.CSVdata.slice(1),
    header: state => state.CSVdata[0] || [],
    selectedRows: state => filterRows(state.CSVdata.slice(1), state.CSVdata[0] || [], state.filters, state.department),
    getColumnIndexByQuestionID: state => id => getColumnIndexByQuestionID(id, state.CSVdata),
    getQuestionIDByCategory: state => category => getQuestionIDByCategory(category, state.CSVdata),
    getAllCategory: state => () => getAllCategory(state.CSVdata),
    getAllMeans: state => () => getAllMeans(state.CSVdata),
  },
  actions: {
    setCSVDataBis(data) { this.CSVDatabis = data; this.projectionSynthetic = false },
    initStore(text) { this.CSVdata = parseCSV(text); this.CSVDatabis = []; this.filters = {}; this.department = ''; this.synthetic = false; this.projectionSynthetic = false },
    toggleFilter(id, value) { if (this.filters[id] === value) delete this.filters[id]; else this.filters[id] = value },
    resetFilters() { this.filters = {}; this.department = '' },
  },
})
