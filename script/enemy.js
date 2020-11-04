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
  　 * 自身のタイプ
     * @type {string}
     */
    this.type = "default";

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
   * @param {string} [type = "default"] - 設定するタイプ
   */
  set(x ,y, life = 1, type = "default") {
    this.position.set(x, y);
    this.life = life;
    this.type = type;
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
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    if (this.life <= 0) { return; }

    switch (this.type) {
        case "wave":
          if (this.frame % 60 === 0) {
            let tx = this.attackTarget.position.x - this.position.x;
            let ty = this.attackTarget.position.y - this.position.y;
            let tv = Position.calcNormal(tx, ty);
            this.fire(tv.x, tv.y, 4);
          }
          this.position.x += Math.sin(this.frame / 10);
          this.position.y += 2;
          if (this.position.y - this.height > this.ctx.canvas.height) {
            this.life = 0;
          }
          break;
        case "large":
          if (this.frame % 50 === 0) {
            for (let i = 0; i < 360; i += 45) {
              let r = i * Math.PI / 180;
              let s = Math.sin(r);
              let c = Math.cos(r);
              this.fire(c, s, 3);
            }
          }
          this.position.x += Math.sin((this.frame + 90) / 50) * 2;
          this.position.y += 1;
          if (this.position.y - this.height > this.ctx.canvas.height) {
            this.life = 0;
          }
          break;
        case "default":
        default:
          if (this.frame === 50) {
            this.fire();
          }
          this.position.x += this.vector.x * this.speed;
          this.position.y += this.vector.y * this.speed;
          if (this.position.y - this.height > this.ctx.canvas.height) {
            this.life = 0;
          }
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
