import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { notFound, ok, serverError } from '../common/http.js'

const tableName = process.env.LOTS_TABLE

export const handler = async (event) => {
  try {
    const lotId = event.pathParameters?.lotId

    const result = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { lotId },
      }),
    )

    if (!result.Item) {
      return notFound('Lot not found')
    }

    return ok(result.Item)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
