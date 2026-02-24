import { configureStore } from "@reduxjs/toolkit";
import themeReducer, { themeMode } from "../../../src/app/themeSlice";
describe("Redux store tests", () => {
    describe("Redux store интеграционные тесты", () => {
        const createTestStore = () => {
            return configureStore({
                reducer: {
                    theme: themeReducer,
                },
            });
        };

        test("default value must be light", () => {
            const store = createTestStore();
            expect(store.getState().theme.value).toBe("light");
        });

        test("duspatch must change state", () => {
            const store = createTestStore();

            store.dispatch(themeMode());
            expect(store.getState().theme.value).toBe("dark");

            store.dispatch(themeMode());
            expect(store.getState().theme.value).toBe("light");
        });
    });
});
