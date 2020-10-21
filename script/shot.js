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
  　 * 自身の移動スピード
     * @type {number}
     */
    this.speed = 7;
    /**
  　 * 自身の攻撃力
     * @type {number}
     */
    this.power = 1;
    /**
  　 * 自身と衝突判定を取る対象を格納する
     * @type {Array<Character>}
     */
    this.targetArray = [];
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
   * ショットの攻撃力を設定する
   * @param {number} [power] - 設定する攻撃力
   */
  setPower(power) {
    if (power !== null && power > 0) {
      this.power = power;
    }
  }

  /**
   * ショットが衝突判定を行う対象を設定する
   * @param {Array<Character>} [targets] - 衝突判定の対象を含む配列
   */
  setTargets(targets) {
    if (targets !== null && Array.isArray(targets) === true && targets.length > 0) {
      this.targetArray = targets;
    }
  }

  /**
   * ショットが爆発エフェクトを発生できるように設定する
   * @param {Array<Explosion>} [targets] - 爆発エフェクトを含む配列
   */
  setExplosions(targets) {
    if (targets !== null && Array.isArray(targets) === true && targets.length > 0) {
      this.explosionArray = targets;
    }
  }

  /**
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    if (this.life <= 0) { return; }

    if (
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
    ) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    this.targetArray.map((v) => {
      if (this.life <= 0 || v.life <= 0) { return; }

      let dist = this.position.distance(v.position);
      if (dist <= (this.width + v.width) / 4) {
        if (v instanceof Viper) {
          if (v.isComing) {
            return;
          }
        }
        v.life -= this.power;
        if (v.life <= 0) {
          for (let i = 0; i < this.explosionArray.length; ++i) {
            if (this.explosionArray[i].life !== true) {
              this.explosionArray[i].set(v.position.x, v.position.y);
              break;
            }
          }
        }
        this.life = 0;
      }
    });

    this.draw();
  }
}
