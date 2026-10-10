/**
 * signature.js - Canvas Tanda Tangan Digital yang Responsif & Halus
 * Mendukung input sentuhan (jari/stylus di mobile) dan mouse di desktop.
 */

class SignaturePad {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.strokeColor = options.strokeColor || '#18181B';
    this.lineWidth = options.lineWidth || 2.2;
    this.onStrokeEnd = options.onStrokeEnd || null;

    this.isDrawing = false;
    this.hasDrawn = false;
    this.points = [];

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.bindEvents();

    // Resize listener with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const savedData = this.hasDrawn ? this.toDataURL() : null;
        this.resizeCanvas();
        if (savedData) {
          this.fromDataURL(savedData);
        }
      }, 150);
    });
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    // Pastikan ukuran piksel canvas sesuai rasio layar
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);

    this.ctx.scale(ratio, ratio);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.lineWidth;

    // Redraw baseline guide
    this.drawBaselineGuide();
  }

  drawBaselineGuide() {
    // Garis panduan tipis tempat tanda tangan
    const rect = this.canvas.getBoundingClientRect();
    const y = rect.height - 20;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeStyle = '#E4E4E7';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(16, y);
    this.ctx.lineTo(rect.width - 16, y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  bindEvents() {
    const canvas = this.canvas;

    // Pointer events (unifies mouse and touch seamlessly)
    canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    canvas.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    // Mencegah scroll layar saat menggambar di smartphone
    canvas.style.touchAction = 'none';
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.isDrawing = true;
    this.hasDrawn = true;
    this.canvas.setPointerCapture(e.pointerId);

    const pos = this.getPointerPos(e);
    this.points = [pos];

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = this.strokeColor;
    this.ctx.arc(pos.x, pos.y, this.lineWidth / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  handlePointerMove(e) {
    if (!this.isDrawing) return;
    const pos = this.getPointerPos(e);
    this.points.push(pos);

    if (this.points.length > 2) {
      const p1 = this.points[this.points.length - 2];
      const p2 = this.points[this.points.length - 1];
      const midPoint = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
      };

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    }
  }

  handlePointerUp(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.points = [];
    if (this.onStrokeEnd) {
      this.onStrokeEnd();
    }
  }

  clear() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.ctx.clearRect(0, 0, rect.width * ratio, rect.height * ratio);
    this.hasDrawn = false;
    this.drawBaselineGuide();
    if (this.onStrokeEnd) {
      this.onStrokeEnd();
    }
  }

  isEmpty() {
    return !this.hasDrawn;
  }

  toDataURL(type = 'image/png') {
    return this.canvas.toDataURL(type);
  }

  fromDataURL(dataUrl) {
    const img = new Image();
    img.onload = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.ctx.drawImage(img, 0, 0, rect.width, rect.height);
      this.hasDrawn = true;
    };
    img.src = dataUrl;
  }
}
