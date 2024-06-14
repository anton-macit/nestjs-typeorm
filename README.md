## About the project

This project gives multi-users CRUD API for to-do items.
The super-admin uses an endpoint to create users. Regular users manage their to-do items via other endpoints.

This project intends to show:
- using of Nest.js
- using of TypeORM with migrations
- way of exception processing
- using UUID as ID for entities
- 100% test coverage for controllers and services
- JWT

Todo:
- having input validation and types for input type on the back-end side
- context for every call
- logging approach
- using IaC to create infrastructure
- show deployed git commit on the `/status` endpoint

## Migrations

For details see https://typeorm.io/migrations

```shell
# create
yarn typeorm migration:create ./src/migrations/MigrationName
# run
DB_URL='...'  yarn typeorm migration:run -- -d ./src/config/typeorm.ts
```
