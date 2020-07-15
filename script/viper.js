/**
 * Viperクラス
 */
class Viper extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {Image} image - キャラクターの画像
   */
  constructor(ctx, x, y, image) {
    // 親クラスのコンストラクタ呼出
    super(ctx, x, y, 0, image);

    /**
  　 * viperの登場フラグ
     * @type {boolean}
     */
    this.isComing = false;

    /**
     * 登場開始のタイムスタンプ
     * @type {number}
     */
    this.comingStart = null;

    /**
     * @type {Position}
     */
    this.comingEndPosition = null;
  }

  /**
   * 登場演出に関する設定を行う
   * @param {number} startX - 登場開始時のX座標
   * @param {number} startY - 登場開始時のY座標
   * @param {number} endX - 登場終了時のX座標
   * @param {number} endY - 登場終了時のY座標
   */
  setComing(startX, startY, endX, endY) {
    // 登場中のフラグを立てる
    this.isComing = true;
    // 登場開始時のタイムスタンプを取得する
    this.comingStart = Date.now();
    // 登場開始位置に自機を移動
    this.position.set(startX, startY);
    // 登場開始時の座標を設定する
    this.comingStartPosition = new Position(startX, startY);
    // 登場終了時の座標を設定する
    this.comingEndPosition = new Position(endX, endY);
  }

  /**
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    let justTime = Date.now();

    if (this.isComing) {
      let comingTime = (justTime - this.comingStart) / 1000;
      let y = this.comingStartPosition.y - comingTime * 50;

      if (y <= this.comingEndPosition.y) {
        this.isComing = false;
        y = this.comingEndPosition.y;
      }

      this.position.set(this.position.x, y);

      if (justTime % 100 < 50) {
        this.ctx.globalAlpha = 0.5;
      }
    }

    this.draw();
    this.ctx.globalAlpha = 1;
  }
}



















