import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { badRequest, notFound, ok, serverError } from '../common/http.js'

const tableName = process.env.RESERVATIONS_TABLE
const allowedStatuses = new Set(['PARKED', 'EXPIRED', 'TOWED'])

export const handler = async (event) => {
  try {
    const reservationId = event.pathParameters?.reservationId
    const payload = JSON.parse(event.body || '{}')
    const status = payload.status

    if (!allowedStatuses.has(status)) {
      return badRequest('status must be PARKED, EXPIRED, or TOWED')
    }

    const existing = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { reservationId },
      }),
    )

    if (!existing.Item) {
      return notFound('Reservation not found')
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { reservationId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ok(result.Attributes)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
