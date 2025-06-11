import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TaskTabs = () => {
    return (
        <div>
            <Tabs
                defaultValue="all"
                className="w-full"
            >
                <TabsList className="mb-8 grid grid-cols-2 gap-2 sm:flex sm:justify-start lg:mb-0">
                    <TabsTrigger value="all">
                        <div className="flex items-center gap-2">
                            All
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">5</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        <div className="flex items-center gap-2">
                            Pending
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">3</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="in-progress">
                        <div className="flex items-center gap-2">
                            In Progress
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">3</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        <div className="flex items-center gap-2">
                            Completed
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">3</span>
                        </div>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default TaskTabs;
