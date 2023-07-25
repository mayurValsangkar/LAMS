import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { login, forgotPassword } from "../ApiServices";

const Login = () => {
  const [show, setShow] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [role, setRole] = useState("");

  const toast = useToast();
  const history = useHistory();
  const handleClick = () => setShow(!show);

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordEmail("");
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmail) {
      toast({
        title: "Please enter the required fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the forgot password endpoint with the provided email
      const response = await fetch(`/api/auth/forgot/${forgotPasswordEmail}`, {
        method: "POST",
      });

      // Handle the response accordingly
      if (response.ok) {
        toast({
          title:
            "System-generated password has been created and sent to your email",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to send password reset email",
          description: errorData.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    setLoading(false);
    handleForgotPasswordClose();
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!usernameOrEmail || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await login(usernameOrEmail, password);

      if (response.success) {
        toast({
          title: "Login successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        // Store user info in local storage
        sessionStorage.setItem("token", response.accessToken);
        sessionStorage.setItem("login", true);
        sessionStorage.setItem("role", response.role);

        // Debugging statements
        console.log("Token:", sessionStorage.getItem("token"));
        console.log("Role:", sessionStorage.getItem("role"));

        history.push("/dashboard");
      } else {
        //alert("Please enter correct credentials");
        toast({
          title: "Login failed",
          description: "Please Enter Correct Credentials",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      //alert("Please enter correct credentials");
      toast({
        title: "Error occurred!",
        description: "Please Enter Correct Credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    setLoading(false);
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="usernameOrEmail" isRequired>
        <FormLabel>Username or Email Address</FormLabel>
        <Input
          type="text"
          value={usernameOrEmail}
          placeholder="Enter Your Username or Email Address"
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        colorScheme="red"
        variant="link"
        onClick={handleForgotPasswordOpen}
        isDisabled={loading} // Disable the button while loading
      >
        Forgot Password?
      </Button>

      {/* Forgot Password Dialog */}
      <AlertDialog
        isOpen={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Forgot Password
            </AlertDialogHeader>

            <AlertDialogCloseButton />

            <AlertDialogBody>
              <FormControl id="forgotPassword" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={forgotPasswordEmail}
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                onClick={handleForgotPasswordSubmit}
                isLoading={loading} // Show loading state while submitting
                loadingText="Submitting"
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={handleForgotPasswordClose}
                isDisabled={loading}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default Login;
