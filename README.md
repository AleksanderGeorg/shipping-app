# Shipping App

This is a Dockerized app. To run the app, you need to have Docker installed on your machine. To run the app, follow the steps below:

1. Clone the repository
2. Navigate to the root directory of the repository
3. Run the following command: `docker-compose up`
4. Open your browser and navigate to `http://localhost:80`

The app should be up and running. You can now use the app to create and view parcels.

Note: The web app simulates time to run API calls to display loading states and spinners.

# If you don't have Docker

You can still run the app without Docker. To do this, you need to have Node.js and PostgreSQL installed on your machine. Follow the steps below:

## Back-end setup

1. Clone the repository
2. Navigate to shipping-backend directory
3. Create a .env file and add the following environment variables:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER={your postgres username}
DATABASE_PASSWORD={your postgres password}
DATABASE_NAME=shipping
```

4. Run the following command: `npm install`
5. Create a database in PostgreSQL with the name `shipping`
6. Run the following command: `npm run start`

## Front-end setup

7. Navigate to shipping-frontend directory
8. Run the following command: `npm install`
9. Run the following command: `npm run start`
10. Open your browser and navigate to `http://localhost:4200`
