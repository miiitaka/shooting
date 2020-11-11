/**
 * Bossクラス
 */
class Boss extends Character {
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
  　 * 自身のモード
     * @type {string}
     */
    this.mode = "";

    /**
  　 * 自身が出現してからのフレーム数
     * @type {number}
     */
    this.frame = 0;

    /**
  　 * 自身の移動スピード
     * @type {number}
     */
    this.speed = 3;

    /**
  　 * 自身が持つショットインスタンスの配列
     * @type {Array}<Shot>
     */
    this.shotArray = null;

    /**
  　 * 自身が持つショットインスタンスの配列
     * @type {Array}<Homing>
     */
    this.homingArray = null;

    /**
  　 * 自身が攻撃の対象とするCharacter由来のインスタンス
     * @type {Character}
     */
    this.attackTarget = null;
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
    this.frame = 0;
  }

  /**
   * ショットを設定する
   * @param {Array<Shot>} shotArray - 自身に設定するショットの配列
   */
  setShotArray(shotArray) {
    this.shotArray = shotArray;
  }

  /**
   * ホーミングショットを設定する
   * @param {Array<Homing>} homingArray - 自身に設定するショットの配列
   */
  setHomingArray(homingArray) {
    this.homingArray = homingArray;
  }

  /**
   * モードを設定する
   * @param {string} mode - 自身に設定するモード
   */
  setMode(mode) {
    this.mode = mode;
  }

  /**
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    if (this.life <= 0) { return; }

    switch (this.mode) {
        case "invade":
          this.position.y += this.speed;
          if (this.position.y - this.height > 100) {
            this.position.y = 100;
            this.mode = "floating";
            this.frame = 0;
          }
          break;
        case "escape":
          this.position.y -= this.speed;
          if (this.position.y < -this.height) {
            this.life = 0;
          }
          break;
        case "floating":
          if (this.frame % 1000 < 500) {
            if (this.frame % 200 > 140 && this.frame % 10 === 0) {
              let
                tx = this.attackTarget.position.x - this.position.x,
                ty = this.attackTarget.position.y - this.position.y,
                tv = Position.calcNormal(tx, ty);
              this.fire(tv.x, tv.y, 3);
            }
          } else {
            if (this.frame % 50 === 0) {
              this.homingFire(0, 1, 3.5);
            }
          }
          this.position.x += Math.cos(this.frame / 100) * 2;
          break;
        default:
          break;
    }
    this.draw();
    ++this.frame;
  }

  /**
   * 自身から指定された方向にショットを放つ
   * @param {number} [x = 0] - 進行方向ベクトルのX要素
   * @param {number} [y = 1] - 進行方向ベクトルのY要素
   * @param {number} [speed = 5] - ショットのスピード
   */
  fire(x = 0, y = 1, speed = 5) {
   for (let i = 0; i < this.shotArray.length; ++i) {
     if (this.shotArray[i].life <= 0) {
       this.shotArray[i].set(this.position.x, this.position.y);
       this.shotArray[i].setSpeed(speed);
       this.shotArray[i].setVector(x, y);
       break;
     }
   }
  }

  /**
   * 攻撃対象を設定する
   * @param {Character} target - 自身が攻撃対象とするインスタンス
   */
  setAttackTarget(target) {
    this.attackTarget = target;
  }
}
