import { useDispatch } from "react-redux";
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

    const punchIn = async () => {
        try {
            dispatch(punchInStart());
            const res = await axios.post(`${ATTENDANCE_API_END_POINT}/punch-in`, {},  {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                }
              });
            dispatch(punchInSuccess(res.data));
            toast.success("Punched in successfully");
        } catch (error) {
            dispatch(punchInFailure(error.response?.data?.message || error.message));
            toast.error(error.response?.data?.message || "Failed to punch in");
        }
    };

    const punchOut = async () => {
        try {
            dispatch(punchOutStart());
            const res = await axios.post(`${ATTENDANCE_API_END_POINT}/punch-out`, {}, {
                withCredentials: true
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
            const res = await axios.get(`${ATTENDANCE_API_END_POINT}/user-all`, {
                withCredentials: true
            });
            dispatch(getMyAttendanceSuccess(res.data));
        } catch (error) {
            dispatch(getMyAttendanceFailure(error.response?.data?.message || error.message));
        }
    };

    return { punchIn, punchOut, getMyAttendance };
};

export default useAttendance;