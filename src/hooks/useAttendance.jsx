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
    getMyAttendanceFailure,
    deleteAttendanceStart,
    deleteAttendanceSuccess,
    deleteAttendanceFailure,
} from "../redux/attendanceSlice";
import axios from "axios";
import { ATTENDANCE_API_END_POINT } from "@/constants/index";
import axiosInstance from "@/utils/axiosConfig";

const useAttendance = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    // const getLocationName = async (lat, lng) => {
    //     const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
    //         headers: {
    //             "User-Agent": "my-attendance-app (fsayed620@gmail.com)",
    //         },
    //     });
    //     const data = await res.json();
    //     return data.display_name;
    // };
    const getLocationName = async (lat, lng) => {
        const apiKey = "72c1ae0c9cee44c99162d52ed007fdce";
        const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`);
        const data = await res.json();
        return data?.results?.[0]?.formatted || "Unknown location";
    };

    const punchIn = async () => {
        try {
            dispatch(punchInStart());

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude);

            const res = await axiosInstance.post(
                `${ATTENDANCE_API_END_POINT}/punch-in`,
                {
                    locationName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                },
            );

            dispatch(punchInSuccess(res.data));
            toast.success("Punched in successfully");
        } catch (error) {
            dispatch(punchInFailure(error.message));
            toast.error(error.message);
        }
    };

    const punchOut = async () => {
        try {
            dispatch(punchOutStart());

            // Get user's current geolocation
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;

            // Reverse geocode using Nominatim (OpenStreetMap)
            const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const locationData = await locationRes.json();
            const locationName = locationData.display_name || "Unknown location";

            // Send location to backend
            const res = await axiosInstance.post(
                `${ATTENDANCE_API_END_POINT}/punch-out`,
                {
                    locationName,
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

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
            const res = await axiosInstance.get(`${ATTENDANCE_API_END_POINT}/user-all`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(getMyAttendanceSuccess(res.data));
        } catch (error) {
            dispatch(getMyAttendanceFailure(error.response?.data?.message || error.message));
        }
    };

    const deleteAttendance = async (id) => {
        try {
            dispatch(deleteAttendanceStart());

            await axiosInstance.delete(`${ATTENDANCE_API_END_POINT}/delete/${id}`);

            dispatch(deleteAttendanceSuccess(id));
            toast.success("Attendance record deleted successfully");
            return true;
        } catch (error) {
            dispatch(deleteAttendanceFailure(error.response?.data?.message || error.message));
            toast.error(error.response?.data?.message || "Failed to delete attendance record");
            return false;
        }
    };

    return { punchIn, punchOut, getMyAttendance, deleteAttendance };
};

export default useAttendance;
