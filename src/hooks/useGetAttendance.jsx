import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getMyAttendanceStart,
    getMyAttendanceSuccess,
    getMyAttendanceFailure,
} from "../redux/attendanceSlice";
import axios from "axios";
import { toast } from "sonner";
import { ATTENDANCE_API_END_POINT } from "@/constants/index";

const useGetAttendance = () => {
    const dispatch = useDispatch();
    const { myAttendance, loading, error } = useSelector((state) => state.attendance);

    const refetch = useCallback(async () => {
        try {
            dispatch(getMyAttendanceStart());
            const res = await axios.get(`${ATTENDANCE_API_END_POINT}/user-all`, {
                withCredentials: true,
            });
            dispatch(getMyAttendanceSuccess(res.data));
            return res.data; // Return the data for immediate use
        } catch (error) {
            dispatch(
                getMyAttendanceFailure(error.response?.data?.message || error.message)
            );
            toast.error(error.response?.data?.message || "Failed to load attendance");
            throw error;
        }
    }, [dispatch]);

    useEffect(() => {
        refetch(); // Fetch on mount
    }, [refetch]);

    return { 
        refetch,
        data: myAttendance,
        loading,
        error 
    };
};

export default useGetAttendance;