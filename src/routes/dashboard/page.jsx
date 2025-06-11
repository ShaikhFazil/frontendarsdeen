import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import AttendanceTable from "./AttendanceTable ";
import useGetAllAttendance from "@/hooks/useGetAllAttendance";
import useGetAttendance from "@/hooks/useGetAttendance";
import { useSelector } from "react-redux";
import EmployeeAttendanceTable from "./EmployeeAttendanceTable";
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAttendance from "@/hooks/useAttendance";
import { formatDateSafe, calculateDuration } from "@/utils/data";

const DashboardPage = () => {
    const { theme } = useTheme();
    const { allAttendance, loading: allLoading, error: allError, todayAttendance } = useSelector((state) => state.attendance);

    const { user } = useSelector((state) => state.auth);

    const { data: userAttendance, loading: userLoading, error: userError, refetch } = useGetAttendance();

    const { punchIn, punchOut, loading: attendanceActionLoading } = useAttendance();

    useGetAllAttendance();

    // Process attendance data
    const attendanceRecords = Array.isArray(allAttendance) ? allAttendance : allAttendance?.attendance || [];

    const userAttendanceRecords = Array.isArray(userAttendance) ? userAttendance : userAttendance?.attendance || [];

    // Calculate today's working hours if punched out
    // const todayHours = todayAttendance?.punchOut
    //     ? calculateDuration(todayAttendance.punchIn, todayAttendance.punchOut)
    //     : "0h 0m";

    // Handle punch actions
    const handlePunchIn = async () => {
        await punchIn();
        await refetch();
    };

    const handlePunchOut = async () => {
        await punchOut();
        await refetch();
    };

    const formatDateSafe = (date, formatStr = "h:mm a") => {
        if (!date) return "N/A";
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return "Invalid Date";

            // Use Intl.DateTimeFormat for more reliable formatting
            return new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).format(dateObj);
        } catch (e) {
            return "Invalid Date";
        }
    };

    const calculateDuration = (start, end) => {
        if (!start) return "0h 0m";

        try {
            const startDate = new Date(start);
            const endDate = end ? new Date(end) : new Date();

            if (isNaN(startDate.getTime()) || (end && isNaN(endDate.getTime()))) {
                return "Invalid Date";
            }

            const diffMs = endDate - startDate;
            const diffMins = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;

            return `${hours}h ${minutes}m`;
        } catch (e) {
            return "Error";
        }
    };

    // Loading and error states
    if (user?.role !== "admin" && userLoading) return <div className="py-8 text-center">Loading your attendance data...</div>;
    if (user?.role === "admin" && allLoading) return <div className="py-8 text-center">Loading all attendance data...</div>;
    if (user?.role !== "admin" && userError) return <div className="py-8 text-center text-red-500">Error: {userError}</div>;
    if (user?.role === "admin" && allError) return <div className="py-8 text-center text-red-500">Error: {allError}</div>;

    const safeTodayAttendance = todayAttendance || {};

    // Calculate today's working hours if punched out
    const todayHours =
        safeTodayAttendance.punchOut && safeTodayAttendance.punchIn
            ? calculateDuration(safeTodayAttendance.punchIn, safeTodayAttendance.punchOut)
            : "0h 0m";

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-1 lg:items-center lg:justify-between">
                <h1 className="title">Dashboard</h1>
                <h1>
                    {user?.role !== "admin" && (
                        <>
                            Employee Code:- <span className="font-semibold">{user?.empId}</span>
                        </>
                    )}
                </h1>
            </div>

            <div className="card-header">
                <p className="card-title text-lg font-medium">
                    {user?.role === "admin" ? (
                        <>
                            Welcome <span className="font-semibold text-primary">Admin {user?.fullname}</span>
                            <span className="font-semibold text-muted-foreground">, Employee Attendance Overview</span>
                        </>
                    ) : (
                        <>
                            Welcome <span className="font-semibold text-primary">{user?.fullname}</span>
                            <span className="font-semibold text-muted-foreground">, Your Attendance Dashboard</span>
                        </>
                    )}
                </p>
            </div>

            {/* Attendance Cards - Only for employees */}
            {user?.role !== "admin" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Today's Status Card */}
                    <div className="card">
                        <div className="card-header">
                            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Clock size={26} />
                            </div>
                            <p className="card-title">Today's Status</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                                {safeTodayAttendance.punchIn ? (safeTodayAttendance.punchOut ? "Completed" : "Active") : "Not Started"}
                            </p>
                            <span className="mt-2 flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                {todayHours}
                            </span>
                        </div>
                    </div>

                    {/* Punch Action Card */}
                    <div className="card">
                        <div className="card-header">
                            <div
                                className={`w-fit rounded-lg p-2 transition-colors ${
                                    !todayAttendance
                                        ? "bg-green-500/20 text-green-500 dark:bg-green-600/20 dark:text-green-600"
                                        : todayAttendance.punchOut
                                          ? "bg-purple-500/20 text-purple-500 dark:bg-purple-600/20 dark:text-purple-600"
                                          : "bg-red-500/20 text-red-500 dark:bg-red-600/20 dark:text-red-600"
                                }`}
                            >
                                {!todayAttendance ? (
                                    <CheckCircle size={26} />
                                ) : todayAttendance.punchOut ? (
                                    <CheckCircle size={26} />
                                ) : (
                                    <XCircle size={26} />
                                )}
                            </div>
                            <p className="card-title">Attendance Action</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            {!todayAttendance ? (
                                <>
                                    <Button
                                        onClick={handlePunchIn}
                                        disabled={attendanceActionLoading}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        Punch In
                                    </Button>
                                    <p className="mt-2 text-center text-sm text-muted-foreground">Start your work day</p>
                                </>
                            ) : !todayAttendance.punchOut ? (
                                <>
                                    <Button
                                        onClick={handlePunchOut}
                                        disabled={attendanceActionLoading}
                                        className="w-full bg-red-600 hover:bg-red-700"
                                    >
                                        Punch Out
                                    </Button>
                                    <p className="mt-2 text-center text-sm text-muted-foreground">
                                        Working since {formatDateSafe(todayAttendance.punchIn)}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-center text-lg font-medium">You've completed today's work</p>
                                    <p className="mt-1 text-center text-sm text-muted-foreground">
                                        {formatDateSafe(todayAttendance.punchIn)} - {formatDateSafe(todayAttendance.punchOut)}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Today's Summary Card */}
                    <div className="card">
                        <div className="card-header">
                            <div className="w-fit rounded-lg bg-amber-500/20 p-2 text-amber-500 transition-colors dark:bg-amber-600/20 dark:text-amber-600">
                                <TrendingUp size={26} />
                            </div>
                            <p className="card-title">Today's Summary</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            {todayAttendance ? (
                                <>
                                    <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{todayHours}</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <p>In: {formatDateSafe(todayAttendance.punchIn)}</p>
                                        <p>Out: {todayAttendance.punchOut ? formatDateSafe(todayAttendance.punchOut) : "Not punched out yet"}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="py-4 text-center text-lg font-medium">No attendance recorded today</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Table */}
            <div className="card">
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        {user?.role === "admin" ? (
                            <AttendanceTable attendanceRecords={attendanceRecords || []} />
                        ) : (
                            <EmployeeAttendanceTable
                                attendanceRecords={userAttendanceRecords}
                                refetch={refetch}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
