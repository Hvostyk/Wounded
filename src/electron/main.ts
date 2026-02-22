import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util";

const DEV_SERVER_PORT = process.env.PORT ?? 3000;

app.on("ready", () => {
    const mainWindow = new BrowserWindow({});

    if (isDev()) {
        mainWindow.loadURL(`http://localhost:${DEV_SERVER_PORT}`);
    } else {
        const htmlPath = path.join(app.getAppPath(), "dist-react", "index.html");
        mainWindow.loadFile(htmlPath);
    }
});
