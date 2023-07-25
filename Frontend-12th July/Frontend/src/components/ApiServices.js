import axios from "axios";
import moment from "moment";

const API_BASE_URL = "http://localhost:5000";

const getConfig = () => {
  const token = sessionStorage.getItem("token");
  //console.log("Retrieved token:", token); // Log the retrieved token

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  //console.log("Request headers:", config.headers); // Log the headers object

  return config;
};

const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/register`,
      userData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const bulkUpload = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/bulk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getConfig().headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const login = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      {
        usernameOrEmail,
        password,
      },
      getConfig()
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// User

const fetchProfile = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/profile`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const fetchUserProfile = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/profile/${id}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/update/${id}`,
      userData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/all`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const changeStatus = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/status/${id}`,
      "null",
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const changePassword = async (passwords) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/change_password`,
      passwords,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to change password: ${error.response?.data || error.message}`
    );
  }
};

export const getAllManagers = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/manager`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error("Unable to get managers");
  }
};

// Leave request

const ApplyLeave = async (LeaveeApply) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/leave/request`,
      LeaveeApply,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllLeaveRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leave/all`, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch leave requests: ${error.response?.data || error.message}`
    );
  }
};

export const getOneEmployeeLeaveRequests = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/leave/find/${id}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch employee leave requests: ${
        error.response?.data || error.message
      }`
    );
  }
};

export const approveLeaveRequest = async (leaveRequestId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/leave/request/${leaveRequestId}/approve`,
      "null",
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to approve leave request: ${
        error.response?.data || error.message
      }`
    );
  }
};

export const rejectLeaveRequest = async (leaveRequestId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/leave/request/${leaveRequestId}/reject`,
      "null",
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to reject leave request: ${error.response?.data || error.message}`
    );
  }
};

export const getPendingLeaveRequests = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/leave/pending`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch pending leave requests: ${
        error.response?.data || error.message
      }`
    );
  }
};

// Attendance

const markAttendance = async (attendance) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/attendance/mark`,
      attendance,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllAttendance = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/attendance/all`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch all attendance: ${error.response?.data || error.message}`
    );
  }
};

export const getOneEmployeeAttendance = async (employeeId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/attendance/find/${employeeId}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch employee attendance: ${
        error.response?.data || error.message
      }`
    );
  }
};

export const confirmAttendance = async (attendanceId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/attendance/${attendanceId}/confirm`,
      "null",
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to confirm attendance: ${error.response?.data || error.message}`
    );
  }
};

export const rejectAttendance = async (attendanceId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/attendance/${attendanceId}/reject`,
      "null",
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to reject attendance: ${error.response?.data || error.message}`
    );
  }
};

export const downloadAttendanceReport = async (month, year) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/attendance/report/${month}/${year}`,
      getConfig(),
      {
        responseType: "arraybuffer", // Set the response type to arraybuffer to receive the file data
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to download attendance report: ${
        error.response?.data || error.message
      }`
    );
  }
};

export const getPendingAttendanceRequests = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/attendance/pending`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch pending attendance requests: ${
        error.response?.data || error.message
      }`
    );
  }
};

const markMultipleAttendance = async (attendanceList) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/attendance/multiple`,
      attendanceList,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Leave balance

export const getCurrentUserLeaveBalance = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/balance/${userId}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Leave balance not found for the current user.");
    } else {
      throw new Error(
        `Failed to fetch current user leave balance: ${
          error.response?.data || error.message
        }`
      );
    }
  }
};

export const reset = async (userId, type) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/balance/reset/${userId}/${type}`,
      "null",
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to reset leave balance: ${error.message}`);
  }
};

// Department

const addDepartment = async (department) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/department/add`,
      department,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to add department: ${error.response?.data || error.message}`
    );
  }
};

const getAllDepartments = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/department/all`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to retrieve departments: ${error.response?.data || error.message}`
    );
  }
};

// Holiday

const addHoliday = async (publicHoliday) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/holiday/add`,
      publicHoliday,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to add holiday: ${error.response?.data || error.message}`
    );
  }
};

const addBulkHolidays = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_BASE_URL}/holiday/add-bulk`,
      formData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to add bulk holidays: ${error.response?.data || error.message}`
    );
  }
};

const getAllHolidays = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/holiday/all`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch public holidays: ${
        error.response?.data || error.message
      }`
    );
  }
};

export const deleteHoliday = async (holidayId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/holiday/${holidayId}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to delete holiday: ${error.response?.data || error.message}`
    );
  }
};

// Roster

export const getCurrentUserRoster = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/roster/view`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch roster: ${error.response?.data || error.message}`
    );
  }
};

export const getHybridEmployees = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/roster/employee`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch employees: ${error.response?.data || error.message}`
    );
  }
};

export const generateCustomRosterForEmployees = async (
  employeeIds,
  wfoDates
) => {
  try {
    const formattedDates = wfoDates.map((date) =>
      moment(date).format("YYYY-MM-DD")
    );
    const requestBody = {
      employeeIds: employeeIds,
      wfoDates: formattedDates,
    };
    console.log("API-SERVICE ----- " + formattedDates);
    const response = await axios.post(
      `${API_BASE_URL}/roster/upload`,
      requestBody,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to upload roster: ${error.response?.data || error.message}`
    );
  }
};

// Documents

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_BASE_URL}/files/upload`,
      formData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to upload file: ${error.response?.data || error.message}`
    );
  }
};

export const getFileById = async (fileId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/files/${fileId}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      `Failed to retrieve file: ${error.response?.data || error.message}`
    );
  }
};

export const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/files/${fileId}/download`,
      getConfig(),
      {
        ...getConfig(),
        responseType: "blob", // Set the response type to "blob"
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to download file: ${error.response?.data || error.message}`
    );
  }
};

export const getAllFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/all`, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to retrieve files: ${error.response?.data || error.message}`
    );
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/files/${fileId}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      `Failed to delete file: ${error.response?.data || error.message}`
    );
  }
};

export {
  login,
  register,
  bulkUpload,
  fetchProfile,
  markAttendance,
  markMultipleAttendance,
  updateUser,
  fetchUserProfile,
  getAllEmployees,
  changeStatus,
  ApplyLeave,
  getAllDepartments,
  addDepartment,
  changePassword,
  getAllHolidays,
  addHoliday,
  addBulkHolidays,
};