/**
 * キャラクター管理のための基幹クラス
 */
class Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {number} life - キャラクターのライフ（生存フラグを兼ねる）
   * @param {string} imagePath - キャラクターの画像
   */
  constructor(ctx, x, y, w, h, life, imagePath) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * @type {Position}
     */
    this.position = new Position(x, y);

    /**
     * @type {number}
     */
    this.width = w;

    /**
     * @type {number}
     */
    this.height = h;

    /**
     * @type {number}
     */
    this.life = life;

    /**
     * @type {boolean}
     */
    this.ready = false;
    /**

     * @type {Image}
     */
    this.image = new Image();
    this.image.addEventListener("load", () => {
      this.ready = true;
    }, false);
    this.image.src = imagePath
  }

  /**
   * キャラクターを描画する
   */
  draw() {
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y- offsetY,
      this.width,
      this.height
    );
  }
}