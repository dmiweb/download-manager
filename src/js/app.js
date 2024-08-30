import WidgetDownloadFiles from "./components/widget-download-files/widget-download-files.js";

document.addEventListener("DOMContentLoaded", () => {
  const widgetElement = document.querySelector(".widget-download-files");

  const widgetDownloadFiles = new WidgetDownloadFiles(widgetElement);

  widgetDownloadFiles.bindToDOM();
  widgetDownloadFiles.renderFiles();
});
