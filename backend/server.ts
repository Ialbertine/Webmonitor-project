import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import { Pool } from 'pg';
import axios from 'axios';
import cron from 'node-cron';
import cors from 'cors';

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false, // Added this to include Render's SSL
  },
});

// GraphQL schema definition
const typeDefs = gql`
  type Website {
    id: ID!
    name: String!
    url: String!
    status: String!
  }

  type Query {
    websites: [Website]
    getWebsiteStatus(id: ID!): Website
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
        console.error('Error fetching websites:', err);
        throw new Error(`Error fetching websites: ${err.message}`);
      }
    },
    getWebsiteStatus: async (_: unknown, { id }: { id: string }) => {
      try {
        const res = await pool.query('SELECT * FROM websites WHERE id = $1', [id]);
        if (res.rows.length === 0) throw new Error('Website not found');
        return res.rows[0];
      } catch (err) {
        console.error(`Error fetching website status for ID ${id}:`, err);
        throw new Error(`Error fetching website status: ${err.message}`);
      }
    }
  },
  Mutation: {
    addWebsite: async (_: unknown, { name, url }: { name: string; url: string }) => {
      try {
        const res = await pool.query(
          'INSERT INTO websites (name, url, status) VALUES ($1, $2, $3) RETURNING *',
          [name, url, 'unknown']
        );
        return res.rows[0];
      } catch (err) {
        console.error('Error adding website:', err);
        throw new Error(`Error adding website: ${err.message}`);
      }
    },
    deleteWebsite: async (_: unknown, { id }: { id: string }) => {
      try {
        const res = await pool.query('DELETE FROM websites WHERE id = $1 RETURNING *', [id]);
        return res.rowCount > 0;
      } catch (err) {
        console.error(`Error deleting website with ID ${id}:`, err);
        throw new Error(`Error deleting website: ${err.message}`);
      }
    }
  }
};

// Check website status periodically
const checkWebsiteStatus = async () => {
  try {
    const websites = await pool.query('SELECT * FROM websites');
    for (const website of websites.rows) {
      try {
        const response = await axios.get(website.url);
        const status = response.status === 200 ? 'online' : 'offline';
        await pool.query('UPDATE websites SET status = $1 WHERE id = $2', [status, website.id]);
      } catch (err) {
        await pool.query('UPDATE websites SET status = $1 WHERE id = $2', ['offline', website.id]);
      }
    }
  } catch (err) {
    console.error('Error checking website status:', err);
  }
};

// cron job to run the status check every minute
cron.schedule('* * * * *', checkWebsiteStatus);

// Create an Apollo Server with GraphQL schema and resolvers
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true, // Enable GraphQL Playground
});

// Create an Express application
const app = express();

// Using CORS
app.use(cors({}));

// Serve static files from the React app (make sure to build your React app)
app.use(express.static(path.join(__dirname, 'client/build')));

// Root route for the server
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Web Monitor API. Visit /graphql for the GraphQL interface.');
});

// Start the Apollo Server and apply the middleware to Express
async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Start the Express server
  app.listen({ port: 5000 }, () =>
    console.log(`🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`)
  );
}

//  Allowing server to detect all routes from React Router
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Initialize the server
startServer().catch((err) => {
  console.error('Failed to start the server:', err);
});