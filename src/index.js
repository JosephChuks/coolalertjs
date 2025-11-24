import css from "./styles.css";

class CoolAlert {
  /**
   * @param {Object} [custom]  Optional overrides for the CSS variables.
   *
   */

  static dragData = {
    isDragging: false,
    startX: 0,
    startY: 0,
    modalStartX: 0,
    modalStartY: 0,
    currentModal: null,
  };

  static currentPromise = null;
  static isProcessingRequest = false;
  static lastProcessedRequest = null;

  static boundDrag = null;
  static boundStopDrag = null;

  static initializeStyles(custom = window.CoolAlertConfig || {}) {
    if (document.getElementById("cool-alert-styles")) return;

    const defaults = {
      overlay: "rgba(0, 0, 0, 0.3)",
      background: "#011627",
      primary: "#6c5ce7",
      secondary: "rgba(255, 255, 255, 0.1)",
      success: "#00b894",
      warning: "#ff8513",
      info: "#74b9ff",
      error: "#b00",
      question: "#d89f04",
      text: "rgba(255, 255, 255, 0.9)",
      title: "rgba(255, 255, 255, 0.9)",
      close: "rgba(255, 255, 255, 0.7)",
      toastBackground: "#1e1e1e",
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });

    const cfg = { ...defaults, ...custom };

    const vars = Object.entries(cfg)
      .map(([key, val]) => `--cool-alert-${key}: ${val};`)
      .join("\n");

    const style = document.createElement("style");
    style.id = "cool-alert-styles";
    style.textContent = `
        :root {
        ${vars}
        }
        ${css}
        `;
    document.head.appendChild(style);
  }

  static createToastContainer(position = "top-right") {
    let container = document.getElementById("cool-alert-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "cool-alert-toast-container";
      container.classList.add("cool-alert-toast-container-" + position);
      document.body.appendChild(container);
    }
    return container;
  }

  static showModal(data) {
    const closeBtn = data.showCloseIcon ?? false;
    const cancelBtn = data.showCancelButton !== false;
    const confirmBtn = data.showConfirmButton !== false;
    const denyBtn = data.showDenyButton ?? false;

    const div = document.createElement("div");
    div.classList.add("cool-alert-modal-overlay", "active");
    div.id = "cool-alert-" + data.icon;

    div.innerHTML = `
                    <div class="cool-alert-js cool-alert-modal cool-alert-${
                      data.icon
                    }">
                        <div class="cool-alert-modal-header"></div>
                        ${
                          !closeBtn
                            ? ""
                            : '<button class="cool-alert-close" data-action="dismiss">&times;</button>'
                        }
                        ${
                          data.html
                            ? ""
                            : `<div class="cool-alert-modal-icon">
                            ${this.getIcon(data.icon)}
                        </div>`
                        }
                        <h2 class="cool-alert-modal-title">${data.title}</h2>
                        <p class="cool-alert-modal-message">${data.text}</p>
                        ${
                          data.html
                            ? `<div class="cool-alert-modal-message">${data.html}</div>`
                            : ""
                        }
                        <div class="cool-alert-modal-buttons">
                            ${
                              !cancelBtn
                                ? ""
                                : `<button class="cool-alert-modal-btn cool-alert-secondary" style="${
                                    data.cancelButtonColor
                                      ? `background-color: ${data.cancelButtonColor}`
                                      : ""
                                  }" data-action="cancel">${
                                    data.cancelButtonText || "Cancel"
                                  }</button>`
                            }
                            ${
                              !denyBtn
                                ? ""
                                : `<button class="cool-alert-modal-btn cool-alert-danger" style="${
                                    data.denyButtonColor
                                      ? `background-color: ${data.denyButtonColor}`
                                      : ""
                                  }" data-action="deny">${
                                    data.denyButtonText || "Deny"
                                  }</button>`
                            }
                            ${
                              !confirmBtn
                                ? ""
                                : `<button class="cool-alert-modal-btn cool-alert-primary" style="${
                                    data.confirmButtonColor
                                      ? `background-color: ${data.confirmButtonColor}`
                                      : ""
                                  }" data-action="confirm">${
                                    data.confirmButtonText || "Continue"
                                  }</button>`
                            }
                        </div>
                    </div>
                `;

    // FIXED: Use direct button event listeners instead of event delegation
    div.addEventListener("click", (e) => {
      if (e.target === div) {
        this.handleModalAction("dismiss", data);
      }
    });

    // Attach button listeners directly after DOM insertion
    setTimeout(() => {
      document.body.appendChild(div);

      // FIXED: Attach event listeners directly to buttons to survive translation
      const modal = div.querySelector(".cool-alert-modal");

      modal.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = e.currentTarget.getAttribute("data-action");
          this.handleModalAction(action, data);
        });
      });

      if (data.draggable) this.initializeDrag();
      this.addRippleEffect();
    }, 100);
  }

  static showBasicModal(title, text = null, icon = null) {
    const div = document.createElement("div");
    div.classList.add("cool-alert-modal-overlay", "active");
    div.innerHTML = `
                    <div class="cool-alert-js cool-alert-modal cool-alert-${
                      icon === null ? "info" : icon.toLowerCase()
                    }">
                        <div class="cool-alert-modal-header"></div>
                        
                        ${
                          icon === null || icon === ""
                            ? ""
                            : `<div class="cool-alert-modal-icon">
                                  ${this.getIcon(icon.toLowerCase())}
                              </div>`
                        }
                        ${
                          title === null || title === ""
                            ? ""
                            : `<h2 class="cool-alert-modal-title">${title}</h2>`
                        }
                        ${
                          text === null || text === ""
                            ? ""
                            : `<p class="cool-alert-modal-message">${text}</p>`
                        }
                        <div class="cool-alert-modal-buttons" style="margin-top:20px">
                           <button class="cool-alert-modal-btn cool-alert-primary" data-action="confirm">OK</button>
                        </div>
                    </div>
                `;

    // FIXED: Use direct button event listeners
    div.addEventListener("click", (e) => {
      if (e.target === div) {
        this.closeModal();
      }
    });

    setTimeout(() => {
      document.body.appendChild(div);

      // FIXED: Attach event listeners directly to buttons
      const confirmBtn = div.querySelector("[data-action='confirm']");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeModal();
        });
      }

      this.addRippleEffect();
    }, 100);
  }

  static showPreConfirmModal(data) {
    const div = document.createElement("div");
    div.classList.add("cool-alert-modal-overlay", "active");
    div.id = "cool-alert-" + data.icon;

    div.innerHTML = `
                    <div class="cool-alert-js cool-alert-modal cool-alert-${
                      data.icon
                    }">
                        <div class="cool-alert-modal-header"></div>
                        <button class="cool-alert-close" data-action="dismiss">&times;</button>
                        <div class="cool-alert-modal-icon">${this.getIcon(
                          data.icon
                        )}</div>
                        <h2 class="cool-alert-modal-title">${data.title}</h2>
                        <p class="cool-alert-modal-message">${data.text}</p>
                        <div class="cool-alert-modal-buttons">
                            <button class="cool-alert-modal-btn cool-alert-secondary" data-action="cancel">${
                              data.cancelButtonText || "Cancel"
                            }</button>
                            <button class="cool-alert-modal-btn cool-alert-primary" data-action="preconfirm" ${
                              data.showLoaderOnConfirm
                                ? 'data-loading="true"'
                                : ""
                            }>${data.confirmButtonText || "Confirm"}</button>
                        </div>
                    </div>
                `;

    // FIXED: Use direct button event listeners
    div.addEventListener("click", (e) => {
      if (
        e.target === div &&
        (!data.allowOutsideClick || data.allowOutsideClick())
      ) {
        this.handleModalAction("dismiss", data);
      }
    });

    setTimeout(() => {
      document.body.appendChild(div);

      // FIXED: Attach event listeners directly to buttons
      const modal = div.querySelector(".cool-alert-modal");

      const preconfirmBtn = modal.querySelector("[data-action='preconfirm']");
      if (preconfirmBtn) {
        preconfirmBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.handlePreConfirm(e.currentTarget, data);
        });
      }

      modal
        .querySelectorAll("[data-action]:not([data-action='preconfirm'])")
        .forEach((button) => {
          button.addEventListener("click", (e) => {
            e.stopPropagation();
            const action = e.currentTarget.getAttribute("data-action");
            this.handleModalAction(action, data);
          });
        });

      if (data.draggable) this.initializeDrag();
      this.addRippleEffect();
    }, 100);
  }

  static async handlePreConfirm(button, data) {
    if (data.showLoaderOnConfirm) {
      button.disabled = true;
      button.innerHTML = '<span class="cool-alert-spinner"></span> Loading...';
      button.classList.add("cool-alert-loading");
    }

    try {
      const result = await data.preConfirm();
      this.resolvePromise({
        isConfirmed: true,
        value: result,
        dismiss: undefined,
      });
    } catch (error) {
      this.showValidationMessage(error);
      if (data.showLoaderOnConfirm) {
        button.disabled = false;
        button.innerHTML = data.confirmButtonText || "Confirm";
        button.classList.remove("cool-alert-loading");
      }
    }
  }

  static showValidationMessage(error) {
    const modal = document.querySelector(".cool-alert-modal");
    if (modal) {
      let errorDiv = modal.querySelector(".cool-alert-validation-error");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "cool-alert-validation-error";
        modal.querySelector(".cool-alert-modal-buttons").before(errorDiv);
      }
      errorDiv.textContent = error.message || error;
      errorDiv.style.display = "block";
    }
  }

  static handleModalAction(action, data) {
    if (action === "dismiss" || action === "cancel") {
      if (this.currentPromise) {
        const result = {
          isConfirmed: false,
          isDenied: false,
          isDismissed: true,
          value: undefined,
          dismiss: action === "dismiss" ? "close" : "cancel",
        };
        this.currentPromise.resolve(result);
        this.currentPromise = null;
      }
      this.closeModal();
      return;
    }

    if (!this.currentPromise) {
      this.closeModal();
      return;
    }

    const result = {
      isConfirmed: action === "confirm",
      isDenied: action === "deny",
      isDismissed: false,
      value: action === "confirm" ? true : undefined,
      dismiss: undefined,
    };

    this.resolvePromise(result);
  }

  static resolvePromise(result) {
    if (this.currentPromise) {
      this.currentPromise.resolve(result);
      this.currentPromise = null;
    }
    this.closeModal();
  }

  static closeModal() {
    const modal = document.querySelector(".cool-alert-modal-overlay");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";

      if (this.currentPromise) {
        this.currentPromise = null;
      }

      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 100);
    }
  }

  static isLoading() {
    const loadingBtn = document.querySelector(
      ".cool-alert-modal-btn.cool-alert-loading"
    );
    return !!loadingBtn;
  }

  static showToast(type, title, text, duration = 3000) {
    const toastConfig = {
      success: {
        icon: "✓",
        message: "Action completed successfully.",
      },
      error: {
        icon: "✕",
        message: "Something went wrong. Please try again.",
      },
      warning: {
        icon: "⚠",
        message: "Please review your action carefully.",
      },
      info: {
        icon: "ℹ",
        message: "Here's some important information for you.",
      },
      question: {
        icon: "?",
        message: "Do you want to proceed?",
      },
    };

    const config = toastConfig[type];
    const toastId = `cool-alert-toast-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const toast = document.createElement("div");
    toast.className = `cool-alert-js cool-alert-toast ${type}`;
    toast.id = toastId;

    toast.innerHTML = `
                    <div class="cool-alert-toast-icon">${config.icon}</div>
                    <div class="cool-alert-toast-content">
                        <div class="cool-alert-toast-title">${title || ""}</div>
                        <div class="cool-alert-toast-message">${
                          text || config.message
                        }</div>
                    </div>
                    <button class="cool-alert-toast-close">&times;</button>
                    <div class="cool-alert-toast-progress"></div>
                `;

    const container = document.getElementById("cool-alert-toast-container");
    container.appendChild(toast);

    // FIXED: Use direct event listener instead of inline onclick
    const closeBtn = toast.querySelector(".cool-alert-toast-close");
    closeBtn.addEventListener("click", () => this.closeToast(toastId));

    setTimeout(() => toast.classList.add("show"), 10);

    const progressBar = toast.querySelector(".cool-alert-toast-progress");
    setTimeout(() => {
      progressBar.style.width = "100%";
      progressBar.style.transition = `width ${duration}ms linear`;
      setTimeout(() => (progressBar.style.width = "0%"), 50);
    }, 100);

    const autoRemoveTimer = setTimeout(
      () => this.closeToast(toastId),
      duration
    );
    toast.autoRemoveTimer = autoRemoveTimer;

    toast.addEventListener("mouseenter", () => {
      clearTimeout(autoRemoveTimer);
      progressBar.style.animationPlayState = "paused";
    });

    toast.addEventListener("mouseleave", () => {
      const remainingTime =
        (parseFloat(progressBar.style.width) / 100) * duration;
      if (remainingTime > 0) {
        toast.autoRemoveTimer = setTimeout(
          () => this.closeToast(toastId),
          remainingTime
        );
      }
      progressBar.style.animationPlayState = "running";
    });
  }

  static closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      if (toast.autoRemoveTimer) {
        clearTimeout(toast.autoRemoveTimer);
      }
      toast.classList.remove("show");
      toast.classList.add("hide");

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  static getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
      question: "?",
    };
    return icons[type] || "ℹ";
  }

  static initializeDrag() {
    const modal = document.querySelector(".cool-alert-modal");

    if (!modal) return;

    const header = modal.querySelector(".cool-alert-modal-header");

    this.boundDrag = this.drag.bind(this);
    this.boundStopDrag = this.stopDrag.bind(this);

    const startDrag = (e) => {
      if (
        e.target.closest(".cool-alert-modal-btn") ||
        e.target.closest(".cool-alert-close")
      ) {
        return;
      }

      this.dragData.isDragging = true;
      this.dragData.currentModal = modal;

      const rect = modal.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      this.dragData.modalStartX = rect.left + rect.width / 2 - viewportCenterX;
      this.dragData.modalStartY = rect.top + rect.height / 2 - viewportCenterY;
      this.dragData.startX = e.clientX;
      this.dragData.startY = e.clientY;

      modal.classList.add("cool-alert-dragging");
      e.preventDefault();

      document.addEventListener("mousemove", this.boundDrag);
      document.addEventListener("mouseup", this.boundStopDrag);
    };

    header.addEventListener("mousedown", startDrag);
    modal.addEventListener("mousedown", startDrag);
  }

  static drag(e) {
    if (!this.dragData.isDragging || !this.dragData.currentModal) return;

    const deltaX = e.clientX - this.dragData.startX;
    const deltaY = e.clientY - this.dragData.startY;

    const newX = this.dragData.modalStartX + deltaX;
    const newY = this.dragData.modalStartY + deltaY;

    const modalRect = this.dragData.currentModal.getBoundingClientRect();
    const maxX = (window.innerWidth - modalRect.width) / 2;
    const maxY = (window.innerHeight - modalRect.height) / 2;

    const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
    const constrainedY = Math.max(-maxY, Math.min(maxY, newY));

    this.dragData.currentModal.style.transform = `translate(${constrainedX}px, ${constrainedY}px) scale(1.05)`;
  }

  static stopDrag() {
    if (!this.dragData.isDragging || !this.dragData.currentModal) return;

    this.dragData.isDragging = false;
    this.dragData.currentModal.classList.remove("cool-alert-dragging");

    const currentTransform = this.dragData.currentModal.style.transform;
    const translateMatch = currentTransform.match(/translate\(([^)]+)\)/);

    if (translateMatch) {
      this.dragData.currentModal.style.transform =
        translateMatch[0] + " scale(1)";
    }

    this.dragData.currentModal = null;

    document.removeEventListener("mousemove", this.boundDrag);
    document.removeEventListener("mouseup", this.boundStopDrag);
  }

  static addRippleEffect() {
    document.querySelectorAll(".cool-alert-modal-btn").forEach((btn) => {
      if (btn.hasRipple) return;
      btn.hasRipple = true;

      btn.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                            position: absolute;
                            border-radius: 50%;
                            background: rgba(255, 255, 255, 0.3);
                            transform: scale(0);
                            animation: ripple-effect 0.6s linear;
                            left: ${x}px;
                            top: ${y}px;
                            width: ${size}px;
                            height: ${size}px;
                            pointer-events: none;
                        `;

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  static show(data, text = null, icon = null) {
    this.initializeStyles();

    if (typeof data === "string") {
      this.showBasicModal(data, text, icon);
      return Promise.resolve({ isConfirmed: true });
    }

    if (data && data.toast === true) {
      this.createToastContainer(data.position || "top-right");
      this.showToast(
        data.icon || "info",
        data.title || null,
        data.text || null,
        data.duration || 3000
      );
      return Promise.resolve({ dismissed: true });
    }

    if (data && typeof data === "object" && data.toast !== true) {
      data.title = data.title || "";
      data.text = data.text || "";
      data.icon = data.icon || "info";

      return new Promise((resolve, reject) => {
        if (this.currentPromise) {
          this.closeModal();
        }

        this.currentPromise = { resolve, reject };
        document.body.style.overflow = "hidden";

        if (data.preConfirm) {
          this.showPreConfirmModal(data);
        } else {
          this.showModal(data);
        }
      });
    }

    return Promise.resolve({ dismissed: true });
  }

  static handleHTMXRequest(requestId, callback) {
    if (this.isProcessingRequest || this.lastProcessedRequest === requestId) {
      return;
    }

    this.isProcessingRequest = true;
    this.lastProcessedRequest = requestId;

    try {
      callback();
    } finally {
      setTimeout(() => {
        this.isProcessingRequest = false;
      }, 100);
    }
  }

  static clearRequestTracking() {
    this.isProcessingRequest = false;
    this.lastProcessedRequest = null;
  }
}

export default CoolAlert;
