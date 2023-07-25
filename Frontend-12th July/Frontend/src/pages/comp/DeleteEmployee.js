import React from "react";
import { changeStatus } from "../../components/ApiServices";
import { Button, useToast } from "@chakra-ui/react";

const DeleteEmployee = ({ employeeId }) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await changeStatus(employeeId);
      toast({
        title: "Employee Status Changed to Inactive",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error changing status of the employee:", error);
      toast({
        title: "Error",
        description:
          "Failed to change the status of the employee. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button colorScheme="red" variant="outline" onClick={handleDelete}>
      Chnage Status
    </Button>
  );
};

export default DeleteEmployee;
