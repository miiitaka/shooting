/**
 * Viperクラス
 */
class Viper extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {string} imagePath - キャラクターの画像
   */
  constructor(ctx, x, y, w, h, imagePath) {
    // 親クラスのコンストラクタ呼出
    super(ctx, x, y, w, h, 0, imagePath);

    /**
  　 * viperの移動スピード
     * @type {number}
     */
    this.speed = 3;

    /**
  　 * ショットを撃った後のチェック用カウンター
     * @type {number}
     */
    this.shotCheckCounter = 0;

    /**
  　 * ショットを撃つことができる間隔（フレーム数）
     * @type {number}
     */
    this.shotInterval = 10;

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
    this.comingStartPosition = null;

    /**
     * @type {Position}
     */
    this.comingEndPosition = null;

    /**
     * 自身が持つショットインスタンスの配列
     * @type {Array<Shot>}
     */
    this.shotArray = null;

    /**
     * 自身が持つシングルショットインスタンスの配列
     * @type {Array<Shot>}
     */
    this.singleShotArray = null;
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
   * ショットを設定する
   * @param {Array<Shot>} shotArray - 自身に設定するショットの配列
   * @param {Array<Shot>} singleShotArray - 自身に設定するシングルショットの配列
   */
  setShotArray(shotArray, singleShotArray) {
    this.shotArray = shotArray;
    this.singleShotArray = singleShotArray;
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
    } else {
      if (window.isKeyDown.key_ArrowLeft) {
        this.position.x -= this.speed;
      }
      if (window.isKeyDown.key_ArrowRight) {
        this.position.x += this.speed;
      }
      if (window.isKeyDown.key_ArrowUp) {
        this.position.y -= this.speed;
      }
      if (window.isKeyDown.key_ArrowDown) {
        this.position.y += this.speed;
      }
      let canvasWidth = this.ctx.canvas.width;
      let canvasHeight = this.ctx.canvas.height;
      let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
      let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
      this.position.set(tx, ty);

      if (window.isKeyDown.key_z) {
        if (this.shotCheckCounter >= 0) {
          for (let i = 0; i < this.shotArray.length; ++i) {
            if (this.shotArray[i].life <= 0) {
              this.shotArray[i].set(this.position.x, this.position.y);
              this.shotCheckCounter = -this.shotInterval;
              break;
            }
          }
          for (let i = 0; i < this.singleShotArray.length; i += 2) {
            if (this.singleShotArray[i].life <= 0 && this.singleShotArray[i + 1].life <= 0) {
              let radCW = 280 * Math.PI / 180;
              let radCCW = 260 * Math.PI / 180;
              this.singleShotArray[i].set(this.position.x, this.position.y);
              this.singleShotArray[i].setVectorFromAngle(radCW);
              this.singleShotArray[i + 1].set(this.position.x, this.position.y);
              this.singleShotArray[i + 1].setVectorFromAngle(radCCW);
              this.shotCheckCounter = -this.shotInterval;
              break;
            }
          }
        }
      }
      ++this.shotCheckCounter;
    }

    this.draw();
    this.ctx.globalAlpha = 1;
  }
}
