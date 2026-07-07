import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { badRequest, created, serverError } from '../common/http.js'
import { newId } from '../common/ids.js'

const tableName = process.env.LOTS_TABLE

const defaultCustomerFields = {
  firstName: true,
  lastName: true,
  phone: false,
  licensePlate: true,
  spotNumber: false,
  notes: false,
}

export const handler = async (event) => {
  try {
    const companyId = event.pathParameters?.companyId
    const payload = JSON.parse(event.body || '{}')

    if (!companyId || !payload.name || !payload.address) {
      return badRequest('companyId, name, and address are required')
    }

    const lot = {
      lotId: newId('lot'),
      companyId,
      name: payload.name.trim(),
      address: payload.address.trim(),
      allowDurationParking: payload.allowDurationParking ?? true,
      requireSpotNumber: payload.requireSpotNumber ?? false,
      customerFields: {
        ...defaultCustomerFields,
        ...(payload.customerFields || {}),
      },
      pricing: {
        hourlyRate: payload.pricing?.hourlyRate ?? 5,
        allDayRate: payload.pricing?.allDayRate ?? 20,
        allDayEnabled: payload.pricing?.allDayEnabled ?? true,
      },
      createdAt: new Date().toISOString(),
    }

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: lot,
      }),
    )

    return created(lot)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
