import React, { useEffect, useState } from "react";
import {
  uploadFile,
  getFileById,
  getAllFiles,
  deleteFile,
} from "../../components/ApiServices";
import { Box, Button, Heading, Text, useToast } from "@chakra-ui/react";

const API_BASE_URL = "http://localhost:5000";

const Documents = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const toast = useToast();
  const userRole = sessionStorage.getItem("role");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const fetchedFiles = await getAllFiles();
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) return;

      const uploadedFile = await uploadFile(selectedFile);
      setUploadedFile(uploadedFile);
      setSelectedFile(null);
      fetchFiles();

      // Show success toast
      toast({
        title: "File Uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error uploading file:", error);

      // Show error toast
      toast({
        title: "File Upload Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const fileData = await getFileById(fileId);
      // Convert the Base64 encoded string to plain text
      const decodedText = atob(fileData.fileData);

      if (fileData) {
        const fileBlob = new Blob([decodedText], {
          type: fileData.contentType,
        });
        const fileUrl = URL.createObjectURL(fileBlob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", fileData.fileName);
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
      } else {
        console.error("File not found");
      }

      // Show success toast
      toast({
        title: "File Downloaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error downloading file:", error);

      // Show error toast
      toast({
        title: "File Download Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOpen = async (fileId) => {
    try {
      const fileData = await getFileById(fileId);
      // Convert the Base64 encoded string to plain text
      const decodedText = atob(fileData.fileData);

      if (fileData) {
        const fileBlob = new Blob([decodedText], {
          type: fileData.contentType,
        });
        const fileUrl = URL.createObjectURL(fileBlob);

        // Open the file in a new tab/window
        window.open(fileUrl);

        // Cleanup
        URL.revokeObjectURL(fileUrl);
      } else {
        console.error("File not found");
      }

      // Show success toast
      toast({
        title: "File Opened",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error opening file:", error);

      // Show error toast
      toast({
        title: "File Open Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      fetchFiles();

      // Show success toast
      toast({
        title: "File Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting file:", error);

      // Show error toast
      toast({
        title: "File Deletion Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Document Management
      </Heading>

      {userRole === "HR" && (
        <Box mb={4}>
          <input type="file" onChange={handleFileChange} />
          <Button colorScheme="blue" onClick={handleUpload}>
            Upload
          </Button>
        </Box>
      )}

      {uploadedFile && (
        <Box mb={4}>
          <Text>Uploaded File:</Text>
          <Text>{uploadedFile.fileName}</Text>
        </Box>
      )}

      <Box mb={4}>
        <Heading as="h2" size="lg" mb={2}>
          Files
        </Heading>
        {files.map((file) => (
          <Box key={file.id} mb={2}>
            <Text>{file.fileName}</Text>
            <Button
              colorScheme="blue"
              size="sm"
              mr={2}
              onClick={() => handleDownload(file.id)}
            >
              Download
            </Button>
            <Button
              colorScheme="green"
              size="sm"
              mr={2}
              onClick={() => handleOpen(file.id)}
            >
              Open
            </Button>
            {userRole === "HR" && (
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => handleDelete(file.id)}
              >
                Delete
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Documents;
