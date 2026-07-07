import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../common/dynamo.js'
import { badRequest, created, serverError } from '../common/http.js'
import { newId } from '../common/ids.js'

const tableName = process.env.COMPANIES_TABLE

export const handler = async (event) => {
  try {
    const payload = JSON.parse(event.body || '{}')
    const name = payload.name?.trim()

    if (!name) {
      return badRequest('name is required')
    }

    const company = {
      companyId: newId('cmp'),
      name,
      admins: Array.isArray(payload.admins) ? payload.admins : [],
      enforcers: Array.isArray(payload.enforcers) ? payload.enforcers : [],
      createdAt: new Date().toISOString(),
    }

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: company,
      }),
    )

    return created(company)
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
