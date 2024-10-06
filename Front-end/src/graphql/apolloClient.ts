import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://webmon-backend.onrender.com',
  cache: new InMemoryCache(),
});

export default client;
