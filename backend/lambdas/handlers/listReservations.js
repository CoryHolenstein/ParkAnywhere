import { QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { ok, serverError } from '../common/http.js'

const tableName = process.env.RESERVATIONS_TABLE

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters || {}
    const lotId = query.lotId
    const status = query.status
    const licensePlate = query.licensePlate
    const spotNumber = query.spotNumber

    let items = []

    if (lotId) {
      const result = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: 'lotId-startedAt-index',
          KeyConditionExpression: 'lotId = :lotId',
          ExpressionAttributeValues: {
            ':lotId': lotId,
          },
          ScanIndexForward: false,
        }),
      )

      items = result.Items || []
    } else {
      const result = await docClient.send(
        new ScanCommand({
          TableName: tableName,
        }),
      )

      items = result.Items || []
    }

    if (status) {
      items = items.filter((item) => item.status === status)
    }

    if (licensePlate) {
      const normalizedPlate = licensePlate.trim().toUpperCase()
      items = items.filter((item) => item.licensePlate?.toUpperCase().includes(normalizedPlate))
    }

    if (spotNumber) {
      const normalizedSpot = spotNumber.trim().toLowerCase()
      items = items.filter((item) => item.spotNumber?.toLowerCase().includes(normalizedSpot))
    }

    return ok({ items })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
