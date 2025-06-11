import React from "react";
import TaskTabs from "./TaskTabs";
import AssignTask from "../pages/AssignTask";

const Task = () => {
    return (
        <div className="py-8">
            <div className="card">
                <div className="card-body flex lg:flex-row lg:justify-between">
                    <h1 className="text-2xl font-semibold">All Tasks</h1>
                    <div className="">
                        <TaskTabs />
                    </div>
                </div>
                <div className="flex w-full justify-start bg-slate-100 p-4 transition-colors dark:bg-slate-950">
                    <AssignTask />
                </div>
            </div>
        </div>
    );
};

export default Task;
