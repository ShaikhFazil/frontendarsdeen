import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    punchInStart,
    punchInSuccess,
    punchInFailure,
    punchOutStart,
    punchOutSuccess,
    punchOutFailure,
    getMyAttendanceStart,
    getMyAttendanceSuccess,
    getMyAttendanceFailure
} from "../redux/attendanceSlice";
import axios from "axios";
import { ATTENDANCE_API_END_POINT } from "@/constants/index";

const useAttendance = () => {
    const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

   const punchIn = async () => {
    try {
      dispatch(punchInStart());
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.post(`${ATTENDANCE_API_END_POINT}/punch-in`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      dispatch(punchInSuccess(res.data));
      toast.success("Punched in successfully");
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      dispatch(punchInFailure(errorMsg));
      toast.error(errorMsg);
      throw error;
    }
  };

  const punchOut = async () => {
        try {
            dispatch(punchOutStart());
            // const token = localStorage.getItem("token");
            const res = await axios.post(`${ATTENDANCE_API_END_POINT}/punch-out`, {}, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            dispatch(punchOutSuccess(res.data));
            toast.success("Punched out successfully");
        } catch (error) {
            dispatch(punchOutFailure(error.response?.data?.message || error.message));
            toast.error(error.response?.data?.message || "Failed to punch out");
        }
    };

       const getMyAttendance = async () => {
        try {
            dispatch(getMyAttendanceStart());
            // const token = localStorage.getItem("token");
            const res = await axios.get(`${ATTENDANCE_API_END_POINT}/user-all`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            dispatch(getMyAttendanceSuccess(res.data));
        } catch (error) {
            dispatch(getMyAttendanceFailure(error.response?.data?.message || error.message));
        }
    };

    return { punchIn, punchOut, getMyAttendance };
};

export default useAttendance;