import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { notFound, ok, serverError } from '../common/http.js'

const tableName = process.env.LOTS_TABLE

export const handler = async (event) => {
  try {
    const lotId = event.pathParameters?.lotId
    const patch = JSON.parse(event.body || '{}')

    const existing = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { lotId },
      }),
    )

    if (!existing.Item) {
      return notFound('Lot not found')
    }

    const updatedLot = {
      ...existing.Item,
      ...patch,
      customerFields: {
        ...(existing.Item.customerFields || {}),
        ...(patch.customerFields || {}),
      },
      pricing: {
        ...(existing.Item.pricing || {}),
        ...(patch.pricing || {}),
      },
      updatedAt: new Date().toISOString(),
    }

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: updatedLot,
      }),
    )

    return ok(updatedLot)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
