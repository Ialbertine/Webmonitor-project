import React, { useState } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_WEBSITE, GET_ALL_WEBSITES } from "../graphql/queries"; // Import the mutation and the query for refetch

interface CreateProps {
  onSubmit: (newData: { name: string; url: string }) => void;
  onCancel: () => void;
}

const CreateWebsite: React.FC<CreateProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  // Apollo useMutation hook
  const [addWebsite, { loading, error }] = useMutation(ADD_WEBSITE, {
    refetchQueries: [{ query: GET_ALL_WEBSITES }], // Refetch website list after adding a new one
  });

  const handleSubmit = async () => {
    if (name && url) {
      try {
        // Trigger the mutation to add the website
        const result = await addWebsite({ variables: { name, url } });

        if (result.data) {
          // Notify the parent component after successful submission
          onSubmit(result.data.addWebsite);
        }
        // Reset the form fields after submission
        setName("");
        setUrl("");
      } catch (err) {
        console.error("Error adding website:", err);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        padding: 4,
        width: "100%",
        maxWidth: "600px",
        margin: "20px auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-center text-2xl text-[#2d7bc9] font-semibold">
        Add New Website
      </h2>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <TextField
          label="Website Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </Stack>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </Box>
  );
};

export default CreateWebsite;
