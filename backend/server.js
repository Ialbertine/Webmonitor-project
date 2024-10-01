const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Pool } = require('pg');

// PostgreSQL connection pool setup
const pool = new Pool({
  user: 'webmon',            
  host: 'db',                
  database: 'WebmonDB',      
  password: 'safedb12!',    
  port: 5432,                
});

// Sample GraphQL schema definition
const typeDefs = gql`
  type Website {
    id: ID!
    name: String!
    url: String!
    status: String!
  }

  type Query {
    websites: [Website]
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    websites: async () => {
      try {
        // Query data from PostgreSQL
        const res = await pool.query('SELECT * FROM websites'); // Assuming 'websites' is a table in your DB
        return res.rows;  // Return data in rows
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching websites');
      }
    }
  }
};

// Create an Express application
const app = express();

// Create an Apollo Server with GraphQL schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the Apollo Server and apply the middleware to Express
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Start the Express server
  app.listen({ port: 5000 }, () =>
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
  );
}

// Initialize the server
startServer().catch((err) => {
  console.error('Failed to start the server:', err);
});