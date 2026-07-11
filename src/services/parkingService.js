import {
  companies as seedCompanies,
  parkingLots as seedLots,
  reservations as seedReservations,
} from '../data/mockData'
import { apiConfig, requestJson } from './apiClient'
import { getAuthToken } from '../auth/tokenStore'

const companies = [...seedCompanies]
const lots = [...seedLots]
const reservations = [...seedReservations]

const getProtectedToken = () => {
  return getAuthToken() || import.meta.env.VITE_OWNER_JWT || import.meta.env.VITE_ENFORCER_JWT || null
}

const withLatency = (result) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 200)
  })
}

const mapLotFromApi = (lot) => ({
  id: lot.lotId,
  companyId: lot.companyId,
  name: lot.name,
  address: lot.address,
  allowDurationParking: lot.allowDurationParking,
  requireSpotNumber: lot.requireSpotNumber,
  customerFields: lot.customerFields,
  pricing: lot.pricing,
})

const mapReservationFromApi = (reservation) => ({
  id: reservation.reservationId,
  lotId: reservation.lotId,
  companyId: reservation.companyId,
  customerFirst: reservation.customerFirst,
  customerLast: reservation.customerLast,
  licensePlate: reservation.licensePlate,
  spotNumber: reservation.spotNumber,
  durationHours: reservation.durationHours,
  status: reservation.status,
  paidAmount: reservation.paidAmount,
  startedAt: reservation.startedAt,
  expiresAt: reservation.expiresAt,
})

export const parkingService = {
  async getLandingSnapshot() {
    if (!apiConfig.useMock) {
      const [ownerLotsA, ownerLotsB] = await Promise.all([
        requestJson('/companies/34242/lots', { token: getProtectedToken() }),
        requestJson('/companies/48610/lots', { token: getProtectedToken() }),
      ])

      const remoteLots = [...(ownerLotsA.items || []), ...(ownerLotsB.items || [])].map(mapLotFromApi)

      return {
        companies,
        lots: remoteLots,
        activeReservationCount: 0,
      }
    }

    return withLatency({
      companies,
      lots,
      activeReservationCount: reservations.filter((r) => r.status === 'PARKED').length,
    })
  },

  async getLotById(lotId) {
    if (!apiConfig.useMock) {
      const lot = await requestJson(`/public/lots/${lotId}`)
      return mapLotFromApi(lot)
    }

    return withLatency(lots.find((lot) => lot.id === lotId) ?? null)
  },

  async searchReservations({ lotIds = [], query = '', status = '' }) {
    if (!apiConfig.useMock) {
      const lotId = lotIds[0]

      const params = new URLSearchParams()
      if (lotId) params.set('lotId', lotId)
      if (status) params.set('status', status)

      if (query) {
        params.set('licensePlate', query)
        params.set('spotNumber', query)
      }

      const result = await requestJson(`/enforcement/reservations?${params.toString()}`, {
        token: getProtectedToken(),
      })

      return (result.items || []).map(mapReservationFromApi)
    }

    const normalizedQuery = query.trim().toLowerCase()

    const filtered = reservations.filter((reservation) => {
      const matchesLots = lotIds.length === 0 || lotIds.includes(reservation.lotId)
      const matchesStatus = !status || reservation.status === status

      if (!normalizedQuery) {
        return matchesLots && matchesStatus
      }

      const haystack = [
        reservation.licensePlate,
        reservation.spotNumber,
        reservation.customerFirst,
        reservation.customerLast,
      ]
        .join(' ')
        .toLowerCase()

      return matchesLots && matchesStatus && haystack.includes(normalizedQuery)
    })

    return withLatency(filtered)
  },

  async createReservation(payload) {
    if (!apiConfig.useMock) {
      const reservation = await requestJson(`/public/lots/${payload.lotId}/reservations`, {
        method: 'POST',
        body: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          licensePlate: payload.licensePlate,
          spotNumber: payload.spotNumber,
          durationHours: payload.durationHours,
          paidAmount: payload.paidAmount,
          notes: payload.notes,
        },
      })

      return mapReservationFromApi(reservation)
    }

    const lot = lots.find((entry) => entry.id === payload.lotId)

    if (!lot) {
      throw new Error('Lot not found.')
    }

    const now = new Date()
    const startedAt = now.toISOString()
    const expiresAt = new Date(now.getTime() + payload.durationHours * 60 * 60 * 1000).toISOString()

    const reservation = {
      id: `resv-${Math.floor(Math.random() * 100000)}`,
      lotId: payload.lotId,
      companyId: lot.companyId,
      customerFirst: payload.firstName,
      customerLast: payload.lastName,
      licensePlate: payload.licensePlate.toUpperCase(),
      spotNumber: payload.spotNumber,
      durationHours: payload.durationHours,
      status: 'PARKED',
      paidAmount: payload.paidAmount,
      startedAt,
      expiresAt,
    }

    reservations.unshift(reservation)

    return withLatency(reservation)
  },

  async updateReservationStatus(reservationId, status) {
    if (!apiConfig.useMock) {
      const updated = await requestJson(`/enforcement/reservations/${reservationId}/status`, {
        method: 'PATCH',
        token: getProtectedToken(),
        body: { status },
      })

      return mapReservationFromApi(updated)
    }

    const reservation = reservations.find((entry) => entry.id === reservationId)

    if (!reservation) {
      throw new Error('Reservation not found.')
    }

    reservation.status = status

    return withLatency(reservation)
  },

  async getOwnerLots(companyId) {
    if (!apiConfig.useMock) {
      const result = await requestJson(`/companies/${companyId}/lots`, {
        token: getProtectedToken(),
      })

      return (result.items || []).map(mapLotFromApi)
    }

    return withLatency(lots.filter((lot) => lot.companyId === companyId))
  },

  async getCompanies() {
    return withLatency(companies)
  },

  async createLot(payload) {
    if (!apiConfig.useMock) {
      const lot = await requestJson(`/companies/${payload.companyId}/lots`, {
        method: 'POST',
        token: getProtectedToken(),
        body: {
          name: payload.name,
          address: payload.address,
          allowDurationParking: payload.allowDurationParking,
          requireSpotNumber: payload.requireSpotNumber,
          customerFields: payload.customerFields,
          pricing: payload.pricing,
        },
      })

      return mapLotFromApi(lot)
    }

    const newLot = {
      id: `${Math.floor(Math.random() * 9000000) + 1000000}`,
      companyId: payload.companyId,
      name: payload.name,
      address: payload.address,
      allowDurationParking: payload.allowDurationParking,
      requireSpotNumber: payload.requireSpotNumber,
      customerFields: payload.customerFields,
      pricing: payload.pricing,
    }

    lots.push(newLot)

    return withLatency(newLot)
  },

  async updateLotConfig(lotId, patch) {
    if (!apiConfig.useMock) {
      const lot = await requestJson(`/lots/${lotId}`, {
        method: 'PATCH',
        token: getProtectedToken(),
        body: patch,
      })

      return mapLotFromApi(lot)
    }

    const lot = lots.find((entry) => entry.id === lotId)

    if (!lot) {
      throw new Error('Lot not found.')
    }

    Object.assign(lot, patch)

    return withLatency(lot)
  },
}
