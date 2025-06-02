import { useTheme } from "@/hooks/use-theme";

import { Bell, ChevronsLeft, LogOut, Moon, Search, Sun, User2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

import profileImg from "@/assets/profile-image.jpg";

import PropTypes from "prop-types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { USER_API_END_POINT } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { logout, setUser } from "@/redux/authSlice";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
      const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  console.log(user)

const logOutHandler = async () => {
    try {
        const res = await axios.get(`${USER_API_END_POINT}/logout`, { 
            withCredentials: true 
        });

        if (res.data.success) {
            // Clear all auth storage
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            
            // Dispatch logout action
            dispatch(logout());
            
            // Navigate to login
            navigate("/login");
            toast.success(res.data.message);
        }
    } catch (error) {
        console.error("Logout error:", error);
        toast.error(error.response?.data?.message || "Logout failed");
    }
};

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
               
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
      <Popover>
  <PopoverTrigger asChild>
    <Avatar className="cursor-pointer">
      <AvatarImage
        src={user?.profile?.profilePhoto || profileImg}
        alt="Profile"
      />
    </Avatar>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="flex gap-4 mb-4 dark:text-blue-600">
      <Avatar>
        <AvatarImage
          src={user?.profile?.profilePhoto || profileImg}
          alt="Profile"
        />
      </Avatar>
      <div>
        <h4 className="font-medium dark:text-blue-600">{user?.fullname || "Guest"}</h4>
        <p className="text-sm text-muted-foreground">
          {user?.email || "No bio available"}
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-1 text-gray-600">
      {/* <div className="flex items-center gap-2">
        <User2 size={18} />
        <Button variant="link" asChild>
          <Link to="/profile">View Profile</Link>
        </Button>
      </div> */}
      <div className="flex items-center gap-2">
        <LogOut size={18} />
        <Button variant="link" onClick={logOutHandler}>Logout</Button>
      </div>
    </div>
  </PopoverContent>
</Popover>


            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
