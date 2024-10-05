import { gql } from '@apollo/client';

export const GET_ALL_WEBSITES = gql`
  query GetAllProducts {
    products {
      id
      name
      url
      status
    }
  }
`;


export const GET_WEBSITE_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      url
      status
    }
  }
`;

export const DELETE_WEBSITE = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
