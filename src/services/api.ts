import axios from 'axios'

export const brasilApi = axios.create({
  baseURL: 'http://brasilapi.simplescontrole.com.br',
})
