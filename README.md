# Website Monitoring Application

This is a Full-stack web application that allows users to add websites to monitoring list and track their status whether they are Online or Offline.

## Features

- Homepage: Display a list of monitored websites with their current status (online/offline).

- Add Website: A form that allows users to add new websites to the monitoring list by providing the website name and URL.
- Monitored Websites: Each website shows its name, URL, and current status which is online only.
- Delete Website: Users can remove websites from the monitoring list.
- Responsive Design: The frontend is responsive and works on both desktop and mobile devices.
- Dockerized: The application is fully containerized using Docker for easy setup and deployment.

## The application is build using the following technologies:

### Frontend:

- React.js with TypeScript
- Material-UI for User Interface
- Apollo Client for GraphQL API consumption

### Backend:

- Node.js + Express.js for Server Setup
- GraphQL with Apollo Server for API
- PostgreSQL for the Database
- Cron job to check the status of websites periodically

## Architecture

- Frontend: The user interacts with a react js based on interface which uses apollo client to communicate with the graphQl backend.

- Backend: Node js with apollo server handles the GraphQL Apis for adding, removing, retrieving and checking website status and also the backend communicates with the PostgreeSQL Database to store website data and a cron job for checking the status of each website and update the database.

## How to Access The App

### Here is the Link to the deployed version:

https://fullstackwebmoniter.vercel.app/

## Authors:

- Benitha Uwituze.
- Albertine Ingabire.
