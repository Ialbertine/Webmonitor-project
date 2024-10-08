import React, { useState } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_WEBSITE, GET_ALL_WEBSITES } from "../graphql/graphqlQueries";

interface CreateProps {
  onSubmit: (newData: { name: string; url: string }) => void;
  onCancel: () => void;
}

const CreateWebsite: React.FC<CreateProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Apollo useMutation hook to create a new website
  const [addWebsite, { loading, error }] = useMutation(ADD_WEBSITE, {
    refetchQueries: [{ query: GET_ALL_WEBSITES }], // this line will refetch and retrieve all websites
  });

  const handleSubmit = async () => {
    if (!name || !url) {
      console.error("Please enter a name and URL");
      return;
    }
  
    try {
      console.log("Submitting with variables:", { name, url });
  
      const result = await addWebsite({ variables: { name, url } });
  
      if (result?.data) {
        console.log("Website added successfully:", result.data);
        onSubmit(result.data.addWebsite);
  
        // Show success message
        setSuccessMessage("Website added successfully");
        setTimeout(() => setSuccessMessage(null), 5000);
  
        // Reset form fields
        setName("");
        setUrl("");
      } else {
        // Handle case when the result has no data
        throw new Error("No data returned from the server. Please try again.");
      }
    } catch (err: any) {
      console.error("Error adding website:", err.message || "Unknown error occurred");
    }
  };
  
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        padding: { xs: 2, sm: 4 }, // Responsive padding
        width: "100%",
        maxWidth: { xs: "90%", sm: "600px" }, 
        margin: "5rem auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
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
