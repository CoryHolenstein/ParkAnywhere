import crypto from 'node:crypto'

export const newId = (prefix) => `${prefix}_${crypto.randomUUID()}`
