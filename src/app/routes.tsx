import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AuthPage, HomePage, LibraryPage, PlaylistsPage } from "../pages";
import { AppLayout } from "../shared/HvostykUI/AppLayout";
import { useAppSelector } from "./hooks";
import { NavigationRoutes } from "./types";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

export const getNavigationRoutes = (): NavigationRoutes => [
    { path: "/auth", element: <AuthPage /> },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <HomePage /> },
            { path: "library", element: <LibraryPage /> },
            { path: "playlists", element: <PlaylistsPage /> },
        ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
];

export const AppRoutes = () => {
    const routes = getNavigationRoutes();
    return (
        <Routes>
            {routes.map(route => (
                <Route key={route.path} path={route.path} element={route.element}>
                    {route.children?.map((child, i) =>
                        child.index ? <Route key={i} index element={child.element} /> : <Route key={child.path} path={child.path} element={child.element} />,
                    )}
                </Route>
            ))}
        </Routes>
    );
};
