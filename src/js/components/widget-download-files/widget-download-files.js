import "./widget-download-files.css";
import { dataFiles } from "../../data-files";

export default class WidgetDownloadFiles {
  constructor(parentEl) {
    this.parentEl = parentEl;

    this.countsAmountDownloaded = this.countsAmountDownloaded.bind(this);
  }

  static get markup() {
    return `<ul class="widget-download-files__files-container files-container">
              <span class="files-container__title">Available Files (without sms and registration):</span>
            </ul>
            <div class="widget-download-files__downloaded-title downloaded-title">You've already downloaded:
              <span class="downloaded-title__count">0</span>
              <span> Mb</span>
            </div>
           `;
  }

  static get containerSelector() {
    return ".files-container";
  }

  static get counterDownloadedSelector() {
    return ".downloaded-title__count";
  }

  bindToDOM() {
    this.parentEl.innerHTML = WidgetDownloadFiles.markup;

    this.fileContainer = this.parentEl.querySelector(
      WidgetDownloadFiles.containerSelector
    );
    this.counterDownloaded = this.fileContainer.querySelector(
      WidgetDownloadFiles.counterDownloadedSelector
    );
  }

  renderFiles() {
    dataFiles.forEach((file) => {
      const fileElement = `
       <li class="files-container__file file">
         <span class="file__name">${this.cutFileName(file.name)}</span>
         <span class="file__size">${this.converterSizeFile(file.size)}</span>
         <span class="file__data data">
           <a class="data__url" href="${file.dataURL}">Download</a>
         </span>
       </li>
     `;

      this.fileContainer.insertAdjacentHTML("beforeEnd", fileElement);
    });

    this.fileContainer.addEventListener("click", this.countsAmountDownloaded);
  }

  cutFileName(string) {
    return string.slice(0, -4);
  }

  converterSizeFile(size) {
    if (size >= 100000 && size < 1000000) {
      return (size = (size / 1000).toFixed() + " Kb");
    }
    if (size >= 1000000) {
      return (size = (size / 1000000).toFixed(1) + "Mb");
    }

    return (size = size + "byte");
  }

  countsAmountDownloaded(e) {
    e.preventDefault();

    if (e.target.classList.contains("data__url")) {
      const urlElement = e.target;
      const fileName = e.target.closest(".file").querySelector(".file__name");
      const counterElem = document.querySelector(".downloaded-title__count");

      fetch(urlElement.href)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.download = `${fileName.textContent}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();

          const counter = +counterElem.textContent + blob.size / 1000000;

          counterElem.textContent = counter.toFixed(1);

          setTimeout(() => URL.revokeObjectURL(url), 0);
        });
    }
  }
}
