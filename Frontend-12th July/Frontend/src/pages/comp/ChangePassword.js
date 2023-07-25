import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { changePassword } from "../../components/ApiServices";

const ChangePassword = ({ email }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handlePasswordUpdate = async () => {
    setLoading(true);

    try {
      await changePassword({
        email,
        currentPassword,
        newPassword,
      });
      toast({
        title: "Password Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Box maxW="400px" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h2" size="lg" mb={4}>
        Change Password
      </Heading>
      <form onSubmit={handlePasswordUpdate}>
        <FormControl id="currentPassword" mb={4} isRequired>
          <FormLabel>Current Password</FormLabel>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="newPassword" mb={4} isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Updating Password"
          width="full"
          mt={4}
        >
          Update Password
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
