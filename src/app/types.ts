import { JSX } from "react";

export interface NavigationRoute {
    path: string;
    element: JSX.Element
}

export type NavigationRoutes = NavigationRoute[];