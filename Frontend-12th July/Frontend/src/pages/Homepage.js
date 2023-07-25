import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Center,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Contactus from "../components/Contactus";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaLaptop } from "react-icons/fa";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Flex
        direction="column"
        alignItems="center"
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center"
        p={3}
      >
        <Flex alignItems="center" mb={1}>
          <FaLaptop style={{ fontSize: '24px', marginRight: '8px', marginLeft: '18px' }} />
          <Text fontSize="4xl" fontFamily="Work sans" color="black">
            LAMS
          </Text>
        </Flex>
        <Text fontSize="xl" fontFamily="Work sans" color="black">
          (Leave & Attendance Management System)
        </Text>
      </Flex>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Contact us</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Contactus />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
