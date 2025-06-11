import { Badge } from "@/components/ui/badge";
import { PencilLine, Trash } from "lucide-react";
import { formatDateSafe, getBadgeBg, getDarkBorder, getLightBorder } from "@/utils/data";
import { useSelector } from "react-redux";

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
    const { id: userId, user } = useSelector((state) => state.auth);
    const lightBorder = getLightBorder(task.status);
    const darkBorder = getDarkBorder(task.status);
    const badgeColor = getBadgeBg(task.status);

    // Only show edit/delete if user is admin or task creator
    const canEdit = isAdmin || task.createdBy._id === userId;

    return (
        <div className={`w-full rounded-md border border-l-[5px] border-gray-300 px-2 ${lightBorder} dark:border-0 dark:border-gray-700`}>
            <div className={`flex flex-col gap-3 rounded-md dark:border dark:border-l-[5px] ${darkBorder}`}>
                <div className="pl-3">
                    <div className="py-2">
                        <div className="flex flex-row justify-between">
                            <div>
                                <Badge className={`${badgeColor} text-xs text-black dark:text-white`}>{task.status}</Badge>
                            </div>

                            <div className="flex flex-row items-center gap-4 px-3">
                                <button
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => onEdit?.(task)}
                                >
                                    <PencilLine size={20} /> 
                                </button>
                                <button
                                    className="cursor-pointer text-red-600 hover:text-red-700"
                                    title="Delete record"
                                    onClick={() => onDelete?.(task._id)}
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">
                        <span className="pr-1 text-xl font-medium text-blue-500">Title:</span>
                        {task.title}
                    </h1>
                    <h2 className="mb- font-semibold">
                        <span className="pr-1 text-xl font-medium text-blue-500">Description:</span>
                        {task.description}
                    </h2>
                    <div className="flex flex-row justify-between px-10 py-3">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-sm font-medium text-blue-500">Start Date</h1>
                            <h2>{formatDateSafe(task.startDate, "dd MMM yyyy")}</h2>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-sm font-medium text-blue-500">End Date</h1>
                            <h2>{formatDateSafe(task.endDate, "dd MMM yyyy")}</h2>
                        </div>
                    </div>
                    {user.role === "admin" && (
                        <div className="text-sm text-gray-500 mb-4">Created by: {task.createdBy.fullname || task.createdBy.email}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
