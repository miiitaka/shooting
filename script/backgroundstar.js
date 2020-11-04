/**
 * 背景を流れる星クラス
 */
class BackgroundStar {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} size - 星の大きさ（幅、高さ）
   * @param {number} speed - 星の移動速度
   * @param {string} [color = "#ffffff"] - 星の色
   */
  constructor(ctx, size, speed, color = "#ffffff") {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * 星の大きさ（幅、高さ）
     * @type {number}
     */
    this.size = size;
    /**
     * 星の移動速度
     * @type {number}
     */
    this.speed = speed;
    /**
     * 星をfillする際の色
     * @type {string}
     */
    this.color = color;
    /**
     * 自身の座標
     * @type {Position}
     */
    this.position = null;
  }

  /**
   * 星を設定する
   * @param {number} x - 星を発生させるX座標
   * @param {number} y - 星を発生させるY座標
   */
  set(x, y) {
    this.position = new Position(x, y);
  }

  /**
   * 星を更新する
   */
  update() {
    this.ctx.fillStyle = this.color;
    this.position.y += this.speed;
    this.ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
    if (this.position.y + this.size > this.ctx.canvas.height) {
      this.position.y = -this.size;
    }
  }
}
