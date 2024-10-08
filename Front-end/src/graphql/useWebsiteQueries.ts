import { useQuery, useMutation } from '@tanstack/react-query';
import { useApolloClient } from '@apollo/client';
import { GET_ALL_WEBSITES, ADD_WEBSITE, DELETE_WEBSITE, GET_WEBSITE_BY_ID } from './graphqlQueries';

// Fetch all websites
export const useFetchWebsites = () => {
  const client = useApolloClient();
  return useQuery({
    queryKey: ['websites'],
    queryFn: async () => {
      try {
        const { data } = await client.query({ query: GET_ALL_WEBSITES });
        return data.websites;
      } catch (error) {
        console.error("Error fetching websites:", error);
        throw error;
      }
    },
  });
};

// Fetch website by ID
export const useFetchWebsiteById = (id: string) => {
  const client = useApolloClient();
  return useQuery({
    queryKey: ['website', id],
    queryFn: async () => {
      try {
        const { data } = await client.query({
          query: GET_WEBSITE_BY_ID,
          variables: { id },
        });
        return data.website;
      } catch (error) {
        console.error("Error fetching website by ID:", error);
        throw error;
      }
    },
  });
};

// Add a new website
export const useAddWebsite = () => {
  const client = useApolloClient();
  return useMutation({
    mutationFn: async ({ name, url }: { name: string; url: string }) => {
      try {
        const { data } = await client.mutate({
          mutation: ADD_WEBSITE,
          variables: { name, url },
        });
        return data.addWebsite;
      } catch (error) {
        console.error("Error adding website:", error);
        throw error;
      }
    },
  });
};

// Delete a website
export const useDeleteWebsite = () => {
  const client = useApolloClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await client.mutate({
          mutation: DELETE_WEBSITE,
          variables: { id },
        });
        return data.deleteWebsite;
      } catch (error) {
        console.error("Error deleting website:", error);
        throw error;
      }
    },
  });
};