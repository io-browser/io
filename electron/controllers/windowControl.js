export default (mainWindow) => (_, action) => {

    if (!mainWindow) return;

    switch (action) {
        case "minimize":
            mainWindow.minimize();
            break;
        case "maximize":
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
            break;
        case "close":
            mainWindow.close();
            break;
    }
}