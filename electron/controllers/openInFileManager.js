import { shell } from "electron";

export default () => (_, action) => {
    const { filePath } = action;

    if (!filePath) return;

    shell.showItemInFolder(filePath);
}