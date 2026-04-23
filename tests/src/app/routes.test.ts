import { getNavigationRoutes } from "../../../src/app/routes";

describe("Routes tests", () => {
    test("getNavigationRoutes returns 3 top-level paths", () => {
        const routes = getNavigationRoutes();
        expect(routes.length).toEqual(3);
    });

    test("layout route has 3 nested children", () => {
        const routes = getNavigationRoutes();
        const layoutRoute = routes[1];
        expect(layoutRoute.children).toHaveLength(3);
    });

    test("auth route path is /auth", () => {
        const routes = getNavigationRoutes();
        expect(routes[0].path).toBe("/auth");
    });

    test("layout route path is /", () => {
        const routes = getNavigationRoutes();
        expect(routes[1].path).toBe("/");
    });
});
