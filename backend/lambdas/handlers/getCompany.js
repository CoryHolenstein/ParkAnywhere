import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { notFound, ok, serverError } from '../common/http.js'

const tableName = process.env.COMPANIES_TABLE

export const handler = async (event) => {
  try {
    const companyId = event.pathParameters?.companyId

    const result = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { companyId },
      }),
    )

    if (!result.Item) {
      return notFound('Company not found')
    }

    return ok(result.Item)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
