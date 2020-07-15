/**
 * キャラクター管理のための基幹クラス
 */
class Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} life - キャラクターのライフ（生存フラグを兼ねる）
   * @param {Image} image - キャラクターの画像
   */
  constructor(ctx, x, y, life, image) {
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
    this.life = life;

    /**
     * @type {Image}
     */
    this.image = image;
  }

  /**
   * キャラクターを描画する
   */
  draw() {
    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y
    );
  }
}