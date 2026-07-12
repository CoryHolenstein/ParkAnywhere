<<<<<<< HEAD
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
=======
const STORAGE_KEY = 'park-anywhere-db-v1'

const defaultCustomerFields = {
  firstName: true,
  lastName: true,
  phone: false,
  licensePlate: true,
  spotNumber: false,
  notes: false,
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

function addHours(dateInput, hours) {
  const date = new Date(dateInput)
  date.setHours(date.getHours() + Number(hours || 0))
  return date.toISOString()
}

function normalizeLotId(value) {
  return String(value || '').trim().toUpperCase()
}

function createSeedData() {
  const now = new Date()

  return {
    companies: [
      { id: 'C001', name: 'ParkAnywhere Holdings' },
      { id: 'C002', name: 'Downtown Mobility Group' },
    ],
    lots: [
      {
        id: '8989898',
        companyId: 'C001',
        name: 'Riverfront Garage',
        address: '101 Riverfront Ave, Nashville, TN',
        allowDurationParking: true,
        requireSpotNumber: false,
        customerFields: { ...defaultCustomerFields },
        pricing: {
          hourlyRate: 6,
          allDayRate: 22,
          allDayEnabled: true,
        },
      },
      {
        id: '4455667',
        companyId: 'C001',
        name: 'Broadway Lot B',
        address: '220 Broadway St, Nashville, TN',
        allowDurationParking: true,
        requireSpotNumber: true,
        customerFields: {
          ...defaultCustomerFields,
          spotNumber: true,
          phone: true,
        },
        pricing: {
          hourlyRate: 8,
          allDayRate: 28,
          allDayEnabled: true,
        },
      },
      {
        id: '7722110',
        companyId: 'C002',
        name: 'East Market Surface Lot',
        address: '34 Market Ln, Nashville, TN',
        allowDurationParking: true,
        requireSpotNumber: false,
        customerFields: {
          ...defaultCustomerFields,
          notes: true,
        },
        pricing: {
          hourlyRate: 5,
          allDayRate: 18,
          allDayEnabled: false,
        },
      },
    ],
    reservations: [
      {
        id: 'R-1001',
        lotId: '8989898',
        customerFirst: 'Avery',
        customerLast: 'Johnson',
        phone: '',
        licensePlate: 'TNX-2481',
        spotNumber: '14',
        notes: '',
        durationHours: 3,
        paidAmount: 18,
        status: 'PARKED',
        createdAt: now.toISOString(),
        expiresAt: addHours(now, 3),
      },
      {
        id: 'R-1002',
        lotId: '4455667',
        customerFirst: 'Chris',
        customerLast: 'Garcia',
        phone: '615-555-0172',
        licensePlate: 'NASH-77',
        spotNumber: 'A-11',
        notes: '',
        durationHours: 2,
        paidAmount: 16,
        status: 'PARKED',
        createdAt: now.toISOString(),
        expiresAt: addHours(now, 2),
      },
    ],
  }
}

function readDb() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    const seed = createSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }

  try {
    return JSON.parse(raw)
  } catch {
    const seed = createSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
}

function writeDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function withDb(mutator) {
  const db = readDb()
  const result = mutator(db)
  writeDb(db)
  return result
}

function applyExpiryStatus(db) {
  const now = Date.now()

  db.reservations = db.reservations.map((reservation) => {
    if (reservation.status === 'PARKED' && new Date(reservation.expiresAt).getTime() < now) {
      return { ...reservation, status: 'EXPIRED' }
    }

    return reservation
  })
}

function buildReservationId(db) {
  const value = 1000 + db.reservations.length + 1
  return `R-${value}`
}

function buildLotId(db) {
  const base = 8000000 + db.lots.length * 37 + 11
  let next = String(base)

  while (db.lots.some((lot) => lot.id === next)) {
    next = String(Number(next) + 1)
  }

  return next
}

export const parkingService = {
  async getLandingSnapshot() {
    return withDb((db) => {
      applyExpiryStatus(db)
      const activeReservationCount = db.reservations.filter((r) => r.status === 'PARKED').length

      return deepClone({
        companies: db.companies,
        lots: db.lots,
        activeReservationCount,
      })
>>>>>>> master
    })
  },

  async getLotById(lotId) {
<<<<<<< HEAD
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
=======
    const normalized = normalizeLotId(lotId)

    return withDb((db) => {
      const lot = db.lots.find((candidate) => normalizeLotId(candidate.id) === normalized)
      return lot ? deepClone(lot) : null
    })
  },

  async createReservation(payload) {
    return withDb((db) => {
      const lotId = normalizeLotId(payload.lotId)
      const lot = db.lots.find((candidate) => normalizeLotId(candidate.id) === lotId)

      if (!lot) {
        throw new Error('Lot not found for reservation.')
      }

      const durationHours = Number(payload.durationHours || 0)
      const createdAt = new Date().toISOString()
      const reservation = {
        id: buildReservationId(db),
        lotId,
        customerFirst: String(payload.firstName || '').trim(),
        customerLast: String(payload.lastName || '').trim(),
        phone: String(payload.phone || '').trim(),
        licensePlate: String(payload.licensePlate || '').trim().toUpperCase(),
        spotNumber: String(payload.spotNumber || '').trim(),
        notes: String(payload.notes || '').trim(),
        durationHours,
        paidAmount: Number(payload.paidAmount || 0),
        status: 'PARKED',
        createdAt,
        expiresAt: addHours(createdAt, durationHours || 24),
      }

      db.reservations.unshift(reservation)
      return deepClone(reservation)
    })
  },

  async searchReservations({ lotIds = [], query = '', status = '' } = {}) {
    return withDb((db) => {
      applyExpiryStatus(db)

      const normalizedLotIds = lotIds.map((id) => normalizeLotId(id)).filter(Boolean)
      const normalizedQuery = String(query || '').trim().toLowerCase()
      const normalizedStatus = String(status || '').trim().toUpperCase()

      const rows = db.reservations.filter((reservation) => {
        if (normalizedLotIds.length > 0 && !normalizedLotIds.includes(normalizeLotId(reservation.lotId))) {
          return false
        }

        if (normalizedStatus && reservation.status !== normalizedStatus) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const target = [
          reservation.licensePlate,
          reservation.spotNumber,
          reservation.customerFirst,
          reservation.customerLast,
          reservation.lotId,
        ]
          .join(' ')
          .toLowerCase()

        return target.includes(normalizedQuery)
      })

      rows.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())
      return deepClone(rows)
    })
  },

  async updateReservationStatus(reservationId, nextStatus) {
    return withDb((db) => {
      const normalized = String(nextStatus || '').trim().toUpperCase()
      const index = db.reservations.findIndex((row) => row.id === reservationId)

      if (index < 0) {
        throw new Error('Reservation not found.')
      }

      db.reservations[index] = {
        ...db.reservations[index],
        status: normalized,
      }

      return deepClone(db.reservations[index])
    })
  },

  async getCompanies() {
    return withDb((db) => deepClone(db.companies))
  },

  async getOwnerLots(companyId) {
    const normalizedCompanyId = String(companyId || '').trim()

    return withDb((db) => {
      const rows = db.lots.filter((lot) => lot.companyId === normalizedCompanyId)
      return deepClone(rows)
    })
  },

  async updateLotConfig(lotId, patch) {
    const normalizedLotId = normalizeLotId(lotId)

    return withDb((db) => {
      const index = db.lots.findIndex((lot) => normalizeLotId(lot.id) === normalizedLotId)

      if (index < 0) {
        throw new Error('Lot not found.')
      }

      const existing = db.lots[index]
      const next = {
        ...existing,
        ...patch,
        customerFields: {
          ...existing.customerFields,
          ...(patch.customerFields || {}),
        },
        pricing: {
          ...existing.pricing,
          ...(patch.pricing || {}),
        },
      }

      db.lots[index] = next
      return deepClone(next)
    })
  },

  async createLot(payload) {
    return withDb((db) => {
      const companyExists = db.companies.some((company) => company.id === payload.companyId)

      if (!companyExists) {
        throw new Error('Company not found for new lot.')
      }

      const lot = {
        id: buildLotId(db),
        companyId: String(payload.companyId || '').trim(),
        name: String(payload.name || '').trim(),
        address: String(payload.address || '').trim(),
        allowDurationParking: Boolean(payload.allowDurationParking),
        requireSpotNumber: Boolean(payload.requireSpotNumber),
        customerFields: {
          ...defaultCustomerFields,
          ...(payload.customerFields || {}),
        },
        pricing: {
          hourlyRate: Number(payload.pricing?.hourlyRate || 0),
          allDayRate: Number(payload.pricing?.allDayRate || 0),
          allDayEnabled: Boolean(payload.pricing?.allDayEnabled),
        },
      }

      db.lots.push(lot)
      return deepClone(lot)
    })
>>>>>>> master
  },
}
