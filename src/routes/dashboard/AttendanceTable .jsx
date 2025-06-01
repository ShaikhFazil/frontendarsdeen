import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateDuration, formatDateSafe } from "@/utils/data";
import { PencilLine, Trash } from "lucide-react";
import AddUpdateEmployee from "@/pages/AddUpdateEmployee";


const AttendanceTable = ({ attendanceRecords }) => {

 const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <Card className="mt-4">
            <CardContent className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                             <TableHead>Action</TableHead>
                             <TableHead>Employee ID</TableHead>
                            <TableHead>Employee Name</TableHead>
                             <TableHead>Employee Email</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Punch In</TableHead>
                            <TableHead>Punch Out</TableHead>
                            <TableHead>Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceRecords?.length ? (
                            attendanceRecords.map((record, index) => (
                                <TableRow key={index}>
                                      <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                          className="text-blue-500 dark:text-blue-600"
                          onClick={() => setSheetOpen(true)}
                        >
                          <PencilLine size={20} />
                        </button>
                                              
                                            </div>
                                        </td>
                                    <TableCell> {record.empId || "-"}</TableCell>
                                    <TableCell> {record.userId?.fullname || "Unknown"}</TableCell>
                                      <TableCell> {record.userId?.email || "Unknown"}</TableCell>
                                    <TableCell> {formatDateSafe(record.punchIn, "dd MMM yyyy")}</TableCell>
                                    <TableCell> {formatDateSafe(record.punchIn, "h:mm a")}</TableCell>
                                    <TableCell> {record.punchOut ? formatDateSafe(record.punchOut, "h:mm a") : "Not punched out"}</TableCell>
                                    <TableCell>{calculateDuration(record.punchIn, record.punchOut)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan="5"
                                    className="py-4 text-center text-gray-500"
                                >
                                    No attendance records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
              {/* Sheet component */}
      <AddUpdateEmployee open={sheetOpen} setOpen={setSheetOpen} />
        </Card>
    );
};

export default AttendanceTable;
