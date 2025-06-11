import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateDuration, formatDateSafe } from "@/utils/data";
import { PencilLine, Trash } from "lucide-react";
import AddUpdateEmployee from "@/pages/AddUpdateEmployee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePickerWithRange from "@/components/DatePickerWithRange";
import useAttendance from "@/hooks/useAttendance";
import { toast } from "sonner";

const AttendanceTable = ({ attendanceRecords }) => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [filters, setFilters] = useState({
        empId: "",
        fullname: "",
        dateRange: undefined,
    });
    const [filteredRecords, setFilteredRecords] = useState(attendanceRecords || []);

    const { deleteAttendance, getMyAttendance } = useAttendance();

    useEffect(() => {
        setFilteredRecords(attendanceRecords || []);
        applyFilters();
    }, [attendanceRecords]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateRangeChange = (range) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: range,
        }));
    };

    const applyFilters = () => {
        let result = [...(attendanceRecords || [])]; 

        if (filters.empId) {
            result = result.filter((record) => 
                record.userId?.empId?.toString().toLowerCase().includes(filters.empId.toLowerCase())
            );
        }

        if (filters.fullname) {
            result = result.filter((record) => 
                record.userId?.fullname?.toLowerCase().includes(filters.fullname.toLowerCase())
            );
        }

        if (filters.dateRange?.from && filters.dateRange?.to) {
            const start = new Date(filters.dateRange.from).setHours(0, 0, 0, 0);
            const end = new Date(filters.dateRange.to).setHours(23, 59, 59, 999);

            result = result.filter((record) => {
                const recordDate = new Date(record.punchIn).getTime();
                return recordDate >= start && recordDate <= end;
            });
        }

        setFilteredRecords(result);
    };

    const resetFilters = () => {
        const resetState = {
            empId: "",
            fullname: "",
            dateRange: undefined,
        };
        setFilters(resetState);
        setFilteredRecords(attendanceRecords || []);
    };

    const openEditModal = (record) => {
        setSelectedRecord(record);
        setSheetOpen(true);
    };

const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
        return;
    }
    try {
        const success = await deleteAttendance(id);
        if (success) {
            // Update the local state immediately for better UX
            setFilteredRecords(prevRecords => 
                (prevRecords || []).filter(record => record._id !== id)
            );
            // Then refetch to ensure data consistency
            await getMyAttendance();
        }
    } catch (error) {
        toast.error("Failed to delete attendance record");
        console.error("Delete error:", error);
    }
};


    return (
        <div>
            <Card className="mb-4 mt-4">
                <CardContent className="space-y-4 p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="w-full md:w-1/4">
                            <Input
                                placeholder="Filter by Employee ID"
                                name="empId"
                                value={filters.empId}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <Input
                                placeholder="Filter by Employee Name"
                                name="fullname"
                                value={filters.fullname}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <DatePickerWithRange
                                selected={filters.dateRange}
                                onSelect={handleDateRangeChange}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={applyFilters}>Apply Filters</Button>
                            <Button
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Employee Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Punch In</TableHead>
                                <TableHead>Punch-In Location</TableHead>
                                <TableHead>Punch Out</TableHead>
                                <TableHead>Punch-out Location</TableHead>
                                <TableHead>Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(filteredRecords || []).length ? (
                                filteredRecords.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="text-blue-500 dark:text-blue-600"
                                                    onClick={() => openEditModal(record)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                {/* <button
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(record._id)}
                                                    title="Delete record"
                                                >
                                                    <Trash size={20} />
                                                </button> */}
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.userId?.empId || "-"}</TableCell>
                                        <TableCell>{record.userId?.fullname || "Unknown"}</TableCell>

                                        <TableCell>{formatDateSafe(record.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell className="font-semibold text-green-500">
                                            {record.punchIn ? formatDateSafe(record.punchIn, "h:mm a") : "Not punched in"}
                                        </TableCell>

                                        <TableCell>{record.punchInLocationName}</TableCell>
                                        <TableCell className={`font-semibold ${record.punchOut ? "text-red-500" : "text-black dark:text-white"}`}>
                                            {record.punchOut ? formatDateSafe(record.punchOut, "h:mm a") : "Not punched out"}
                                        </TableCell>

                                        <TableCell>{record.punchOutLocationName}</TableCell>
                                        <TableCell
                                            className={`font-semibold ${!record.punchIn || !record.punchOut ? "dark:text-white" : "text-blue-500"}`}
                                        >
                                            {calculateDuration(record.punchIn, record.punchOut)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan="8"
                                        className="py-4 text-center text-gray-500"
                                    >
                                        No attendance records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddUpdateEmployee
                open={sheetOpen}
                setOpen={setSheetOpen}
                record={selectedRecord}
                onUpdate={(updatedRecord) => {
                    setFilteredRecords((prev) => 
                        prev.map((r) => (r._id === updatedRecord._id ? updatedRecord : r))
                    );
                }}
            />
        </div>
    );
};

export default AttendanceTable;