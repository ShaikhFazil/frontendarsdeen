import TaskCard from "./TaskCard";

const TaskGrid = ({ tasks, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {tasks.map((task) => (
                <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TaskGrid;
