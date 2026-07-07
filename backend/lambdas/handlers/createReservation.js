import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { badRequest, created, notFound, serverError } from '../common/http.js'
import { newId } from '../common/ids.js'

const lotsTable = process.env.LOTS_TABLE
const reservationsTable = process.env.RESERVATIONS_TABLE

export const handler = async (event) => {
  try {
    const lotId = event.pathParameters?.lotId
    const payload = JSON.parse(event.body || '{}')

    const lotResult = await docClient.send(
      new GetCommand({
        TableName: lotsTable,
        Key: { lotId },
      }),
    )

    const lot = lotResult.Item

    if (!lot) {
      return notFound('Lot not found')
    }

    if (!payload.firstName || !payload.licensePlate) {
      return badRequest('firstName and licensePlate are required')
    }

    if (lot.requireSpotNumber && !payload.spotNumber) {
      return badRequest('spotNumber is required for this lot')
    }

    const durationHours = Number(payload.durationHours || 1)
    const start = new Date()
    const expiresAt = new Date(start.getTime() + durationHours * 60 * 60 * 1000)

    const reservation = {
      reservationId: newId('resv'),
      lotId,
      companyId: lot.companyId,
      customerFirst: payload.firstName,
      customerLast: payload.lastName || '',
      licensePlate: String(payload.licensePlate).toUpperCase(),
      spotNumber: payload.spotNumber || '',
      durationHours,
      status: 'PARKED',
      paidAmount: Number(payload.paidAmount || 0),
      startedAt: start.toISOString(),
      expiresAt: expiresAt.toISOString(),
      createdAt: start.toISOString(),
    }

    await docClient.send(
      new PutCommand({
        TableName: reservationsTable,
        Item: reservation,
      }),
    )

    return created(reservation)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
