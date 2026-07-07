import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { ok, serverError } from '../common/http.js'

const tableName = process.env.LOTS_TABLE

export const handler = async (event) => {
  try {
    const companyId = event.pathParameters?.companyId

    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: 'companyId-index',
        KeyConditionExpression: 'companyId = :companyId',
        ExpressionAttributeValues: {
          ':companyId': companyId,
        },
      }),
    )

    return ok({ items: result.Items || [] })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
