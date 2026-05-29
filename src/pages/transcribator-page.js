import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { initPaymentModal } from "../scripts/modules/forms/payment-modal.js";

Dropzone.autoDiscover = false;

function initAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.querySelectorAll("._anim-items").forEach((el) => {
      el.classList.add("_active");
    });
    return;
  }

  const animItems = document.querySelectorAll("._anim-items");

  if (!animItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("_active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animItems.forEach((item) => observer.observe(item));
}

function getPriceByDuration(duration) {
  if (duration <= 3600) return 50000;
  if (duration <= 7200) return 65000;
  return 80000;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

function showAlert(message) {
  const alertInfo = document.getElementById("alert-info");
  if (!alertInfo) return;

  alertInfo.style.display = "block";
  alertInfo.innerHTML = `<div class="alert alert-danger">${message}</div>`;

  setTimeout(() => {
    alertInfo.style.display = "none";
  }, 3000);
}

function getUploadUrl() {
  const currentPath = window.location.pathname;
  const isInSubfolder = currentPath.includes("/transcribator-page");

  if (isInSubfolder) {
    return "../upload.php";
  }
  return "./upload.php";
}

let uploadedFiles = [];
let totalDuration = 0;
let isProcessing = false;

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initPaymentModal();

  const uploadButton = document.getElementById("upload-button");
  const addButton = document.getElementById("button-add");
  const processButton = document.getElementById("button-proccess");
  const priceInfo = document.getElementById("price-info");

  const supportedFormats = [
    "mp3",
    "mp4",
    "wav",
    "mov",
    "m4a",
    "ogg",
    "webm",
    "mkv",
  ];

  function updateTotalPrice() {
    if (!priceInfo) return;

    if (totalDuration > 0) {
      const price = getPriceByDuration(totalDuration);
      priceInfo.style.display = "flex";
      priceInfo.textContent = `Общая стоимость: ${(price / 100).toLocaleString("ru-RU")} ₽`;
    } else {
      priceInfo.style.display = "none";
    }
  }

  const uploadUrl = getUploadUrl();
  console.log("URL для загрузки:", uploadUrl);

  const myDropzone = new Dropzone("#my-dropzone", {
    url: uploadUrl,
    autoProcessQueue: false,
    uploadMultiple: false,
    parallelUploads: 5,
    maxFiles: 5,
    maxFilesize: 1024,
    acceptedFiles: supportedFormats.map((ext) => `.${ext}`).join(","),
    dictDefaultMessage: "Перетащите файлы сюда",
    clickable: [".trancrib__form"],

    init: function () {
      this.on("addedfile", function (file) {
        if (this.files.length > 5) {
          this.removeFile(file);
          showAlert("Вы можете загрузить не более 5 файлов");
          return;
        }

        uploadButton?.classList.add("hidden");
        addButton?.classList.add("show");
        processButton?.classList.add("show");

        const durationInfo = document.createElement("div");
        durationInfo.className = "duration-info";
        durationInfo.textContent = "Определение длительности...";
        file.previewElement.appendChild(durationInfo);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "dz-remove";
        removeButton.textContent = "Удалить файл";
        removeButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.removeFile(file);
        });
        file.previewElement.appendChild(removeButton);

        const videoElement = document.createElement("video");
        const objectUrl = URL.createObjectURL(file);
        videoElement.src = objectUrl;
        videoElement.preload = "metadata";
        videoElement.hidden = true;
        file.previewElement.appendChild(videoElement);

        let metadataLoaded = false;

        const handleLoadedmetadata = () => {
          if (metadataLoaded) return;
          metadataLoaded = true;

          const duration = videoElement.duration;
          URL.revokeObjectURL(objectUrl);
          videoElement.removeEventListener("loadedmetadata", handleLoadedmetadata);
          videoElement.removeEventListener("error", handleError);

          if (!Number.isFinite(duration)) {
            durationInfo.textContent = "Не удалось определить длительность";
            return;
          }

          file.duration = duration;
          durationInfo.textContent = `Длительность: ${formatDuration(duration)}`;

          totalDuration = 0;
          this.files.forEach((f) => {
            totalDuration += f.duration || 0;
          });

          updateTotalPrice();
        };

        const handleError = () => {
          if (metadataLoaded) return;
          metadataLoaded = true;

          URL.revokeObjectURL(objectUrl);
          videoElement.removeEventListener("loadedmetadata", handleLoadedmetadata);
          videoElement.removeEventListener("error", handleError);
          durationInfo.textContent = "Ошибка: не удалось загрузить файл";
        };

        videoElement.addEventListener("loadedmetadata", handleLoadedmetadata);
        videoElement.addEventListener("error", handleError);

        setTimeout(() => {
          if (!metadataLoaded) {
            metadataLoaded = true;
            URL.revokeObjectURL(objectUrl);
            videoElement.removeEventListener("loadedmetadata", handleLoadedmetadata);
            videoElement.removeEventListener("error", handleError);
            durationInfo.textContent = "Таймаут загрузки метаданных";
          }
        }, 5000);

        const progressElement = document.createElement("div");
        progressElement.className = "upload-progress";
        progressElement.textContent = "Загрузка: 0%";
        file.previewElement.appendChild(progressElement);
      });

      this.on("uploadprogress", (file, progress) => {
        const progressEl = file.previewElement.querySelector(".upload-progress");
        if (progressEl) {
          progressEl.textContent = `Загрузка: ${Math.round(progress)}%`;
        }
      });

      this.on("success", (file, response) => {
        try {
          if (typeof response === "string") {
            response = JSON.parse(response);
          }

          if (response.status === "success" && response.uuid) {
            uploadedFiles.push(response.uuid);
            file.serverId = response.uuid;
          } else {
            throw new Error(response.message || "Unknown error");
          }
        } catch (error) {
          console.error("Ошибка ответа сервера", error);
          showAlert("Ошибка загрузки файла");
          file.status = Dropzone.ERROR;
        }
      });

      this.on("removedfile", function (file) {
        if (file.serverId) {
          uploadedFiles = uploadedFiles.filter((f) => f !== file.serverId);
        }

        totalDuration = 0;
        this.files.forEach((f) => {
          totalDuration += f.duration || 0;
        });

        updateTotalPrice();

        if (!this.files.length) {
          uploadButton?.classList.remove("hidden");
          addButton?.classList.remove("show");
          processButton?.classList.remove("show");
        }
      });

      this.on("error", (file, errorMessage, xhr) => {
        console.error("Ошибка загрузки файла:", file.name);
        console.error("Сообщение:", errorMessage);
        console.error("XHR Status:", xhr?.status);
        console.error("XHR Response:", xhr?.responseText);

        const progressEl = file.previewElement.querySelector(".upload-progress");
        if (progressEl) {
          if (xhr && xhr.status === 404) {
            progressEl.textContent = "Ошибка: upload.php не найден (404)";
          } else if (xhr && xhr.status === 413) {
            progressEl.textContent = "Файл слишком большой";
          } else if (xhr && xhr.status === 400) {
            progressEl.textContent = "Неверный тип файла";
          } else if (xhr && xhr.status === 500) {
            progressEl.textContent = "Ошибка сервера";
          } else {
            progressEl.textContent = `Ошибка: ${errorMessage}`;
          }
        }
        file.status = Dropzone.ERROR;
      });
    },
  });

  uploadButton?.addEventListener("click", () => {
    myDropzone.hiddenFileInput.click();
  });

  addButton?.addEventListener("click", () => {
    myDropzone.hiddenFileInput.click();
  });

  document.querySelector(".trancrib__form")?.addEventListener("click", (e) => {
    if (e.target.closest(".trancrib__img") || e.target.closest(".trancrib__text")) {
      myDropzone.hiddenFileInput.click();
    }
  });

  processButton?.addEventListener("click", async () => {
    if (isProcessing) return;

    if (!myDropzone.files.length) {
      showAlert("Сначала загрузите файл");
      return;
    }

    isProcessing = true;
    processButton.disabled = true;

    try {
      const queuedFiles = myDropzone.getQueuedFiles();

      if (queuedFiles.length > 0) {
        await new Promise((resolve, reject) => {
          let successCount = 0;
          let errorCount = 0;
          const totalFiles = queuedFiles.length;

          const onError = () => {
            errorCount++;
          };

          const onSuccess = () => {
            successCount++;
          };

          const onQueueComplete = () => {
            myDropzone.off("error", onError);
            myDropzone.off("success", onSuccess);
            myDropzone.off("queuecomplete", onQueueComplete);

            console.log(`Загрузка завершена: успех ${successCount}/${totalFiles}, ошибок ${errorCount}`);

            if (errorCount > 0) {
              reject(new Error(`Не удалось загрузить ${errorCount} файл(ов). Проверьте консоль для деталей.`));
            } else {
              resolve();
            }
          };

          myDropzone.on("error", onError);
          myDropzone.on("success", onSuccess);
          myDropzone.on("queuecomplete", onQueueComplete);
          myDropzone.processQueue();
        });
      }

      const price = getPriceByDuration(totalDuration);

      if (!window.$ || !$.fancybox) {
        showAlert("Fancybox не подключен");
        return;
      }

      $.fancybox.open({
        src: "#payment",
        type: "inline",
      });

      setTimeout(() => {
        const paymentModal = document.querySelector("#payment");

        if (!paymentModal) {
          console.error("Модалка #payment не найдена");
          return;
        }

        const title = paymentModal.querySelector("#payment-title");
        const sumInput = paymentModal.querySelector("#sum");
        const serviceInput = paymentModal.querySelector("#service_name");
        const orderInput = paymentModal.querySelector("#orderid");
        const amount = paymentModal.querySelector("#payment-amount");

        if (title) {
          title.textContent = "Транскрибация видео-аудио контента";
        }

        if (sumInput) {
          sumInput.value = price;
        }

        if (serviceInput) {
          serviceInput.value = "Транскрибация";
        }

        if (orderInput) {
          orderInput.value = "transcribe-" + Date.now();
        }

        if (amount) {
          amount.textContent = (price / 100).toLocaleString("ru-RU");
        }
      }, 100);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      showAlert(error.message || "Ошибка при загрузке файлов");
    } finally {
      isProcessing = false;
      processButton.disabled = false;
    }
  });

  document.addEventListener("payment-success", () => {
    uploadedFiles = [];
    totalDuration = 0;
    updateTotalPrice();
    myDropzone.removeAllFiles(true);
  });
});