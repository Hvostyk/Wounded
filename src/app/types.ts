import { JSX } from "react";

export interface NavigationRoute {
    path: string;
    element: JSX.Element;
    children?: { path?: string; index?: boolean; element: JSX.Element }[];
}

export type NavigationRoutes = NavigationRoute[];
