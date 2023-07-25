import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import Details from "./comp/Details";
import Header from "./comp/Header"; // Import the Header component

const Dashpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [selectedOption, setSelectedOption] = useState("My Profile");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ width: "100%" }}>
      <Header /> {/* Display the Header component at the top */}
      <Box
        display="flex"
        width="100%"
        height="100vh"
      >
        <Details
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          handleOptionClick={handleOptionClick}
        />
      </Box>
    </div>
  );
};

export default Dashpage;
