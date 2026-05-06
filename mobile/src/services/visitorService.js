import api from './api'

const visitorService = {

  getMine: async () => {
    const response = await api.get('/visitors/my')
    return response.data.visitors
  },

  submit: async (visitorData) => {
    const response = await api.post('/visitors', visitorData)
    return response.data.visitor
  },

  search: async (idNumber) => {
    const response = await api.get('/visitors/search', {
      params: { id_number: idNumber }
    })
    return response.data.visitors
  },

  checkIn: async (visitorId, notes) => {
    const response = await api.post('/visitors/checkin', {
      visitor_id: visitorId,
      notes
    })
    return response.data
  },

  checkOut: async (visitorId) => {
    const response = await api.post('/visitors/checkout', {
      visitor_id: visitorId
    })
    return response.data
  },

  getBuildings: async () => {
    const response = await api.get('/settings/buildings')
    return response.data.buildings
  },

  getVisitorTypes: async () => {
    const response = await api.get('/settings/visitor-types')
    return response.data.visitorTypes
  }

}

export default visitorService