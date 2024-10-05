import { gql } from "@apollo/client";

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

export const GET_WEBSITE_BY_ID = gql`
  query GetWebsiteById($id: ID!) {
    getWebsiteStatus(id: $id) {
      id
      name
      url
      status
    }
  }
`;

export const ADD_WEBSITE = gql`
  mutation AddWebsite($name: String!, $url: String!) {
    addWebsite(name: $name, url: $url) {
      id
      name
      url
      status
    }
  }
`;

export const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($id: ID!) {
    deleteWebsite(id: $id)
  }
`;