import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineDownload } from "react-icons/ai";
import * as XLSX from "xlsx";
import {
  getAllAttendance,
  fetchUserProfile,
  fetchProfile,
} from "../../components/ApiServices";
import PendingAttendance from "./PendingAttendance";

const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [groupedAttendanceHistory, setGroupedAttendanceHistory] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchAttendanceHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await fetchProfile();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const groupAttendanceByUser = async () => {
      const groupedData = {};
      for (const attendance of attendanceHistory) {
        if (!groupedData[attendance.userId]) {
          groupedData[attendance.userId] = [];
        }
        const user = await fetchUserProfile(attendance.userId);
        const fullName = `${user.firstName} ${user.lastName}`;
        const attendanceWithFullName = { ...attendance, fullName };
        groupedData[attendance.userId].push(attendanceWithFullName);
      }
      setGroupedAttendanceHistory(groupedData);
    };

    groupAttendanceByUser();
  }, [attendanceHistory]);

  const fetchAttendanceHistory = async () => {
    try {
      const data = await getAllAttendance();
      setAttendanceHistory(data);
    } catch (error) {
      console.error("Failed to fetch attendance history:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const generateAttendanceData = (attendances) => {
    const attendanceData = {};
    for (const attendance of attendances) {
      if (attendance.status === "CONFIRMED") {
        const date = new Date(attendance.date);
        const month = date.getMonth() + 1; // Months are zero-based
        const day = date.getDate();
        const formattedDate = `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        attendanceData[formattedDate] = "present";
      }
    }
    return attendanceData;
  };

const downloadAttendanceExcel = (attendances) => {
  const attendanceData = generateAttendanceData(attendances);

  const allDates = Object.keys(attendanceData);
  const uniqueMonths = [...new Set(allDates.map((date) => date.slice(0, 7)))];

  const attendanceExcelData = uniqueMonths.map((month) => {
    const monthData = {
      Month: month,
    };

    const datesInMonth = getDatesInMonth(month);
    datesInMonth.forEach((date, index) => {
      const formattedDate = date.toString().padStart(2, "0"); // Format date with leading zero
      monthData[`Date${index + 1}`] = attendanceData[`${month}-${formattedDate}`] || "Absent";
    });

    return monthData;
  });
  const worksheet = XLSX.utils.json_to_sheet(attendanceExcelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelData = new Blob([excelBuffer], { type: "application/octet-stream" });
  const excelFileName = `${attendances[0].fullName}_Attendance.xlsx`;

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(excelData, excelFileName);
  } else {
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(excelData);
    downloadLink.download = excelFileName;
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }
};

// Helper function to get all the dates in a given month
const getDatesInMonth = (month) => {
  const [year, monthNumber] = month.split("-");
  const daysInMonth = new Date(year, parseInt(monthNumber), 0).getDate();
  const dates = [];

  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  return dates;
};

  const filteredAttendanceHistory = Object.entries(
    groupedAttendanceHistory
  ).filter(([userId, attendances]) => {
    const userFullName = attendances[0].fullName.toLowerCase();
    return userFullName.includes(searchTerm.toLowerCase());
  });

  const renderAttendanceHistory = () => {
    if (filteredAttendanceHistory.length === 0) {
      return <Text fontSize="lg">No attendance history found.</Text>;
    }

    return filteredAttendanceHistory.map(([userId, attendances]) => (
      <Accordion key={userId} allowToggle>
        <AccordionItem border="1px" borderRadius="md" p="4" mb="4">
          <h2>
            <AccordionButton _expanded={{ bg: "teal.500", color: "white" }}>
              <Box flex="1" textAlign="left">
                Name: {attendances[0].fullName}
              </Box>
              <IconButton
                icon={<AiOutlineDownload />}
                aria-label="Download Attendance"
                onClick={() => downloadAttendanceExcel(attendances)}
              />
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {attendances.map((attendance) => (
              <Box
                key={attendance.id}
                borderWidth="1px"
                borderRadius="md"
                p="4"
                mb="4"
              >
                <Text fontSize="lg" fontWeight="bold">
                  Attendance ID: {attendance.id}
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Date: {attendance.date}
                </Text>
                <Text fontSize="lg">Time: {attendance.time}</Text>
                <Text fontSize="lg" fontWeight="bold">
                  Type: {attendance.type}
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Status: {attendance.status}
                </Text>
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Tabs
        isFitted
        variant="enclosed"
        colorScheme="blue"
        onChange={handleTabChange}
        index={activeTab}
      >
        <TabList>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>
            Attendance Requests
          </Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>
            Attendance History
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p="4" bg="white" boxShadow="md" mb="4">
              <Text fontSize="xl">
                <PendingAttendance currentUser={currentUser} />
              </Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p="4" bg="white" boxShadow="md" mb="4">
              <Input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
                mb="4"
              />
              {renderAttendanceHistory()}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AttendanceManagement;
