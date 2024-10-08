// src/graphqlQueries.ts
import { gql } from '@apollo/client';

// Get all websites
export const GET_ALL_WEBSITES = gql`
  query GetAllWebsites {
    websites {
      id
      name
      url
      status
    }
  }
`;


// Get website by ID
export const GET_WEBSITE_BY_ID = gql`
  query GetWebsiteById($id: ID!) {
    website(id: $id) {
      id
      name
      url
      status
    }
  }
`;

// Add new website
export const ADD_WEBSITE = gql`
  mutation AddWebsite($name: String!, $url: String! ) {
    addWebsite(name: $name, url: $url ) {
      id
      name
      url
    }
  }
`;


// Delete website
export const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($id: ID!) {
    deleteWebsite(id: $id)
  }
`;