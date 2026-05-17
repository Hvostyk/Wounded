import themeReducer, { themeMode } from "../../../src/app/themeSlice";

describe("themeSlice", () => {
    it("toggles theme from light to dark and back", () => {
        const afterFirstToggle = themeReducer({ value: "light" }, themeMode());
        expect(afterFirstToggle.value).toBe("dark");

        const afterSecondToggle = themeReducer(afterFirstToggle, themeMode());
        expect(afterSecondToggle.value).toBe("light");
    });
});
