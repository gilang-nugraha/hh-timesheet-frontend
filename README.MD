# hh-timesheet-frontend

Timesheet Management using Next.Js

[Demo Frontend](https://timesheet-demo.gilanglie.com)

[Demo Backend](https://api-timesheet-demo.gilanglie.com)

## Getting Started

For Fullstack Developer Take Home Test - Timesheet App

## Login account

**Frontend Admin:** admin@demo.com / Password123

**Frontend User:** testuser@gmail.com / Password123

**Backend Admin:** gilang.nugraha.h@gmail.com / Password123

## Tech Stack

**Language:** Typescript

**Client:** React, Next.js, Material UI, Tanstack Query, Refine

**Server:** Node, Strapi

**Deployment:** Vercel & AWS

## Feature

- [x] Login Admin / User
- [x] Access Control Middleware
- [x] Employee (User)
  - [x] CRUD Operation
- [x] Timesheet
  - [x] CRUD Operation
  - [x] Calculate work,overtime,total duration
  - [x] Calculate work,overtime,total income
  - [x] Recalculate if update on rate and %rate
  - [x] Filter by project
  - [x] Filter by date range
  - [x] Export to CSV, Excel & PDF
  - [ ] Import data
- [x] Setting
  - [x] Update Work Time
  - [x] Update overtime %rate
  - [x] Update password

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_API_URL= backend url or http://localhost:1337 or https://api-timesheet-demo.gilanglie.com`

### Running the development server.

Development is using Node.js v20.10.0, i recommend using same version or minimum 18^

```bash
    yarn dev
```

### Building for production.

```bash
    yarn build
```

### Running the production server.

```bash
    yarn start
```

## Feedback

If you have any feedback, please reach out to us at gilang.nugraha.h@gmail.com

## License

MIT
