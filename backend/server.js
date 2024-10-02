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

  type Mutation {
    addWebsite(name: String!, url: String!): Website
    deleteWebsite(id: ID!): Boolean
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    websites: async () => {
      try {
        const res = await pool.query('SELECT * FROM websites');
        return res.rows;
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching websites');
      }
    }
  },
  Mutation: {
    addWebsite: async (_, { name, url }) => {
      try {
        const res = await pool.query(
          'INSERT INTO websites (name, url, status) VALUES ($1, $2, $3) RETURNING *',
          [name, url, 'unknown']
        );
        return res.rows[0];
      } catch (err) {
        console.error(err);
        throw new Error('Error adding website');
      }
    },
    deleteWebsite: async (_, { id }) => {
      try {
        await pool.query('DELETE FROM websites WHERE id = $1', [id]);
        return true;
      } catch (err) {
        console.error(err);
        throw new Error('Error deleting website');
      }
    }
  }
};

// Create an Express application
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies

// Create an Apollo Server with GraphQL schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// REST API Endpoints

// GET /websites: Retrieve the list of websites
app.get('/websites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM websites');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching websites' });
  }
});

// POST /websites: Add a new website
app.post('/websites', async (req, res) => {
  const { name, url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO websites (name, url, status) VALUES ($1, $2, $3) RETURNING *',
      [name, url, 'unknown']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding website' });
  }
});

// DELETE /websites/:id: Remove a website
app.delete('/websites/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM websites WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting website' });
  }
});

// GET /websites/:id/status: Check the status of a specific website
app.get('/websites/:id/status', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT status FROM websites WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Website not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching website status' });
  }
});

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