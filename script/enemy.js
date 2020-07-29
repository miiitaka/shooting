/**
 * Enemyクラス
 */
class Enemy extends Character {
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
  　 * 自身の移動スピード
     * @type {number}
     */
    this.speed = 3;
  }

  /**
   * 敵を配置する
   * @param {number} x - 配置するX座標
   * @param {number} y - 配置するY座標
   * @param {number} [life = 1] - 設定するライフ
   */
  set(x ,y, life = 1) {
    this.position.set(x, y);
    this.life = life;
  }

  /**
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    if (this.life <= 0) { return; }

    if (this.position.y - this.height > this.ctx.canvas.height) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.draw();
  }
}