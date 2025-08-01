import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

import { navbarLinks } from "@/constants";

import logoLight from "@/assets/white.png";
import logoDark from "@/assets/black.png";

import { cn } from "@/utils/cn";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import AdminRoute from "@/utils/AdminRoute";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex w-20 gap-x-3 p-3">
                <img
                    src={logoDark}
                    alt="Logoipsum"
                    className="w-24 dark:hidden"
                />
                <img
                    src={logoLight}
                    alt="Logoipsum"
                    className="hidden dark:block"
                />
                {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">ARSDEEN</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => {
                            if (link.path === "/task") {
                                return user?.role !== "admin" ? (
                                    <NavLink
                                        key={link.label}
                                        to={link.path}
                                        className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                                    >
                                        <link.icon
                                            size={22}
                                            className="flex-shrink-0"
                                        />
                                        {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                                    </NavLink>
                                ) : null;
                            }

                            if (link.path === "/employeetask" || link.path === "/rolebased") {
                                return user?.role === "employee" ? null : (
                                    <NavLink
                                        key={link.label}
                                        to={link.path}
                                        className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                                    >
                                        <link.icon
                                            size={22}
                                            className="flex-shrink-0"
                                        />
                                        {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                                    </NavLink>
                                );
                            }

                            return (
                                <NavLink
                                    key={link.label}
                                    to={link.path}
                                    className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                                >
                                    <link.icon
                                        size={22}
                                        className="flex-shrink-0"
                                    />
                                    {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                                </NavLink>
                            );
                        })}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
