// visitorService.js
// All API calls related to visitors live here
// Components never call the API directly
// They always go through a service
//
// Why? If the API changes you fix it here
// not in 10 different components

import api from './api'

const visitorService = {

  // Get all visitors (admin)
  getAll: async () => {
    const response = await api.get('/visitors/all')
    return response.data.visitors
  },

  // Get my visitors (resident)
  getMine: async () => {
    const response = await api.get('/visitors/my')
    return response.data.visitors
  },

  // Submit a visitor (resident)
  submit: async (visitorData) => {
    const response = await api.post('/visitors', visitorData)
    return response.data.visitor
  },

  // Approve or reject (admin)
  updateStatus: async (id, status) => {
    const response = await api.put(`/visitors/${id}/status`, { status })
    return response.data.visitor
  },

  // Search visitor (guard)
  search: async (searchTerm) => {
    const response = await api.get('/visitors/search', {
      params: { id_number: searchTerm }
    })
    return response.data.visitors
  },

  // Check in (guard)
  checkIn: async (visitorId) => {
    const response = await api.post('/visitors/checkin', { 
      visitor_id: visitorId 
    })
    return response.data
  },

  // Check out (guard)
  checkOut: async (visitorId) => {
    const response = await api.post('/visitors/checkout', { 
      visitor_id: visitorId 
    })
    return response.data
  }

}

export default visitorService