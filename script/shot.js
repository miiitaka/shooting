/**
 * Shotクラス
 */
class Shot extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {Image} imagePath - キャラクターの画像
   */
  constructor(ctx, x, y, w, h, imagePath) {
    // 親クラスのコンストラクタ呼出
    super(ctx, x, y, w, h, 0, imagePath);

    /**
  　 * viperの移動スピード
     * @type {number}
     */
    this.speed = 7;
    /**
  　 * ショットの進行方向
     * @type {Position}
     */
    this.vector = new Position(0, -1);
  }

  /**
   * ショットを配置する
   * @param {number} x - 配置するX座標
   * @param {number} y - 配置するY座標
   */
  set(x ,y) {
    this.position.set(x, y);
    this.life = 1;
  }

  /**
   * ショットを進行方向を設定する
   * @param {number} x - X方向の移動量
   * @param {number} y - Y方向の移動量
   */
  setVector(x ,y) {
    this.vector.set(x, y);
  }

  /**
   * ショットのスピードを設定する
   * @param {number} [speed] - 設定するスピード
   */
  setSpeed(speed) {
    if (speed !== null && speed > 0) {
      this.speed = speed;
    }
  }

  /**
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    if (this.life <= 0) { return; }

    if (this.position.y + this.height < 0) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.draw();
  }
}
