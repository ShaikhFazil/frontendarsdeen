import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllAttendanceStart, getAllAttendanceSuccess, getAllAttendanceFailure } from "../redux/attendanceSlice";
import axios from "axios";
import { toast } from "sonner";
import { ATTENDANCE_API_END_POINT } from "@/constants/index";

const useGetAllAttendance = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        dispatch(getAllAttendanceStart());
        const res = await axios.get(`${ATTENDANCE_API_END_POINT}/all`, {
          withCredentials: true
        });
        dispatch(getAllAttendanceSuccess(res.data.attendance || res.data));
      } catch (error) {
        dispatch(getAllAttendanceFailure(error.response?.data?.message || error.message));
        toast.error(error.response?.data?.message || "Failed to load attendance records");
      }
    };
    fetchAllAttendance();
  }, [dispatch]);
};

export default useGetAllAttendance;