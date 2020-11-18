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
     * @type {Position}
     */
    this.vector = new Position(0, -1);

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

    /**
     * @type {number}
     */
    this.angle = 270 * Math.PI / 180;
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

  /**
   * 進行方向を設定する
   * @param {number} x - X方向の移動量
   * @param {number} y - Y方向の移動量
   */
  setVector(x, y) {
    this.vector.set(x, y);
  }

  /**
   * 進行方向を角度を元に設定する
   * @param {number} angle - 回転量（ラジアン）
   */
  setVectorFromAngle(angle) {
    this.angle = angle;
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    this.vector.set(cos, sin);
  }

  /**
   * 自身の回転量を元に座標系を回転させる
   */
  rotationDraw() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle - Math.PI * 1.5);

    let offsetX = this.width / 2;
    let offsetY = this.height / 2;

    this.ctx.drawImage(
      this.image,
      -offsetX,
      -offsetY,
      this.width,
      this.height
    );
    this.ctx.restore();
  }
}
