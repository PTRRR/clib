/**
 * @typedef {Object} Point
 * @property {number} x - The X coordinate
 * @property {number} y - The Y coordinate
 */

/**
 * A simple drawing canvas for beginners
 * @class
 */
class DrawingCanvas {
  /**
   * Creates a new drawing canvas
   * @param {string} canvasId - The ID of the canvas element to use
   * @throws {Error} If canvas element is not found or context cannot be obtained
   */
  constructor(canvasId) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById(canvasId);
    if (!canvas) throw new Error(`Canvas with id ${canvasId} not found`);

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    /** @private @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @private @type {CanvasRenderingContext2D} */
    this.ctx = ctx;

    /** @private @type {boolean} */
    this.isDrawing = false;

    /** @private @type {string} */
    this.currentColor = "#000000";

    /** @private @type {number} */
    this.currentLineWidth = 2;

    /** @private @type {Point|null} */
    this.lastPoint = null;

    this.setupEventListeners();
  }

  /** @private */
  setupEventListeners() {
    this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
    this.canvas.addEventListener("mouseleave", this.stopDrawing.bind(this));
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  startDrawing(e) {
    this.isDrawing = true;
    const point = this.getPoint(e);
    this.lastPoint = point;
    this.drawDot(point);
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  draw(e) {
    if (!this.isDrawing) return;
    const newPoint = this.getPoint(e);
    if (this.lastPoint) {
      this.drawLine(this.lastPoint, newPoint);
    }
    this.lastPoint = newPoint;
  }

  /** @private */
  stopDrawing() {
    this.isDrawing = false;
    this.lastPoint = null;
  }

  /**
   * @private
   * @param {MouseEvent} e
   * @returns {Point}
   */
  getPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * @private
   * @param {Point} point
   */
  drawDot(point) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.currentLineWidth / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fill();
  }

  /**
   * @private
   * @param {Point} from
   * @param {Point} to
   */
  drawLine(from, to) {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentLineWidth;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }

  /**
   * Sets the drawing color
   * @param {string} color - A valid CSS color string (e.g., '#ff0000' or 'red')
   */
  setColor(color) {
    this.currentColor = color;
  }

  /**
   * Sets the line width for drawing
   * @param {number} width - Width in pixels (1-100)
   */
  setLineWidth(width) {
    this.currentLineWidth = width;
  }

  /**
   * Clears the entire canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Export to window object for global usage
export { DrawingCanvas };
