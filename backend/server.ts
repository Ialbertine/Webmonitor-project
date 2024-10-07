import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata"; // TypeORM metadata reflection
import express, { Request, Response } from 'express';
import path from 'path';
import { ApolloServer, gql, ApolloError } from 'apollo-server-express';
import axios from 'axios';
import cron from 'node-cron';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { Website } from './entities/Website'; // Assuming your Website entity is here

// Set up TypeORM DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // For Render's SSL
  },
  entities: [Website],
  synchronize: true, // Auto sync entities to DB (disable in production)
});

// Function to normalize URLs (add http/https if missing)
const normalizeUrl = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return 'http://' + url; // Default to http if protocol is not provided
  }
  return url;
};

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

// GraphQL resolvers using TypeORM
const resolvers = {
  Query: {
    websites: async () => {
      try {
        const websiteRepo = AppDataSource.getRepository(Website);
        return await websiteRepo.find();
      } catch (err) {
        throw new ApolloError(`Error fetching websites: ${err.message}`);
      }
    },
    getWebsiteStatus: async (_: unknown, { id }: { id: string }) => {
      try {
        const websiteRepo = AppDataSource.getRepository(Website);
        const website = await websiteRepo.findOneBy({ id });
        if (!website) throw new ApolloError('Website not found');
        return website;
      } catch (err) {
        throw new ApolloError(`Error fetching website status: ${err.message}`);
      }
    }
  },
  Mutation: {
    addWebsite: async (_: unknown, { name, url }: { name: string; url: string }) => {
      const normalizedUrl = normalizeUrl(url);
      try {
        const websiteRepo = AppDataSource.getRepository(Website);
        const newWebsite = websiteRepo.create({ name, url: normalizedUrl, status: 'Loading...' });
        const savedWebsite = await websiteRepo.save(newWebsite);

        // Trigger status check immediately after website is added
        await checkWebsiteStatusForOne(savedWebsite);

        return savedWebsite;
      } catch (err) {
        throw new ApolloError(`Error adding website: ${err.message}`);
      }
    },
    deleteWebsite: async (_: unknown, { id }: { id: string }) => {
      try {
        const websiteRepo = AppDataSource.getRepository(Website);
        const result = await websiteRepo.delete(id);
        return result.affected! > 0;
      } catch (err) {
        throw new ApolloError(`Error deleting website: ${err.message}`);
      }
    }
  }
};

// Function to check status for a single website
const checkWebsiteStatusForOne = async (website: Website) => {
  const websiteRepo = AppDataSource.getRepository(Website);
  try {
    const response = await axios.get(website.url);
    const status = response.status === 200 ? 'online' : 'offline';
    website.status = status;
    await websiteRepo.save(website);
  } catch (err) {
    website.status = 'offline';
    await websiteRepo.save(website);
  }
};

// Check website status periodically
const checkWebsiteStatus = async () => {
  try {
    const websiteRepo = AppDataSource.getRepository(Website);
    const websites = await websiteRepo.find();
    for (const website of websites) {
      await checkWebsiteStatusForOne(website);
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
  try {
    await AppDataSource.initialize(); // Initialize TypeORM DataSource
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    // Start the Express server
    app.listen({ port: 5000 }, () =>
      console.log(`🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`)
    );
  } catch (err) {
    console.error('Failed to start the server:', err);
  }
}

//  Allowing server to detect all routes from React Router
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Initialize the server
startServer();