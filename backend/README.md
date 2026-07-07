# ParkAnywhere Backend Scaffold

This folder contains a starter serverless backend for API Gateway + Lambda + DynamoDB.

## Recommended DynamoDB tables

1. CompaniesTable
- Partition key: companyId (S)
- Stores company profile, billing settings, owner/admin users, allowed enforcers.

2. ParkingLotsTable
- Partition key: lotId (S)
- GSI1: companyId-index (PK: companyId, SK: lotId)
- Stores lot metadata and lot config used by customer forms.

3. ReservationsTable
- Partition key: reservationId (S)
- GSI1: lotId-startedAt-index (PK: lotId, SK: startedAt)
- GSI2: lotId-licensePlate-index (PK: lotId, SK: licensePlate)
- GSI3: companyId-status-index (PK: companyId, SK: status)
- Stores parking sessions and enforcement status.

## API Gateway routes

Public routes (no auth):
- GET /public/lots/{lotId}
- POST /public/lots/{lotId}/reservations

Owner routes (Cognito JWT, owner/admin group):
- POST /companies
- GET /companies/{companyId}
- GET /companies/{companyId}/lots
- POST /companies/{companyId}/lots
- PATCH /lots/{lotId}

Enforcer routes (Cognito JWT, enforcer group):
- GET /enforcement/reservations
- PATCH /enforcement/reservations/{reservationId}/status

## Lambda handlers included

- createCompany
- getCompany
- listCompanyLots
- createLot
- getPublicLot
- updateLotConfig
- createReservation
- listReservations
- updateReservationStatus

## Auth notes

- Use one Cognito User Pool per environment.
- Use API Gateway JWT authorizer against the pool.
- Put users in groups: owner, admin, enforcer.
- Store companyId in custom claim or resolve via a user mapping table if needed.

## Frontend integration env vars

Set these in your Vite app `.env` when switching from mock mode to real API:

- VITE_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/v1
- VITE_USE_MOCK=false
- VITE_OWNER_JWT=<owner-or-admin-id-token>
- VITE_ENFORCER_JWT=<enforcer-id-token>

If `VITE_API_BASE_URL` is missing or `VITE_USE_MOCK=true`, the frontend service keeps using local mock data.

## Local structure

- infrastructure/template.yaml: SAM template with tables, functions, routes.
- lambdas/common: shared Lambda helpers.
- lambdas/handlers: endpoint handlers.
