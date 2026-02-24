import { getNavigationRoutes } from "../../../src/app/routes";

describe("Routes tests", () => {
    test("getNavgationRoutes should return correct number of paths", () => {
        const navgationRoutes = getNavigationRoutes();
        expect(navgationRoutes.length).toEqual(3);
    });
});
