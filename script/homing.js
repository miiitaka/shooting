/**
 * Homingクラス
 */
class Homing extends Shot {
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
    super(ctx, x, y, w, h, imagePath);

    this.frame = 0;
  }

  /**
   * ホーミングショットを配置する
   * @param {number} x - 配置するX座標
   * @param {number} y - 配置するY座標
   * @param {number} speed - 設定するスピード
   * @param {number} power - 設定する攻撃力
   */
  set(x ,y, speed, power) {
    this.position.set(x, y);
    this.life = 1;
    this.setSpeed(speed);
    this.setPower(power);
    this.frame = 0;
  }

  /**
   * キャラクターの状態を更新し描画を行う
   */
  update() {
    if (this.life <= 0) { return; }

    if (
      this.position.x + this.width < 0 ||
      this.position.x - this.width > this.ctx.canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
    ) {
      this.life = 0;
    }

    let target = this.targetArray[0];

    if (this.frame < 100) {
      let vector = new Position(
        target.position.x - this.position.x,
        target.position.y - this.position.y
      );

      let normalizedVector = vector.normalize;
      this.vector = this.vector.normalize();
      let cross = this.vector.cross(normalizedVector);
      let rad = Math.PI / 180;
      if (cross > 0) {
        this.vector.rotate(rad);
      } else if (cross < 0) {
        this.vector.rotate(-rad);
      }
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.angle = Math.atan2(this.vector.y, this.vector.x);

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
          if (v instanceof Enemy) {
            let score = 100;
            if (v.type === "large") {
              score = 1000;
            }
            gameScore = Math.min(gameScore + score, 99999);
          }
        }
        this.life = 0;
      }
    });

    this.rotationDraw();
    ++this.frame;
  }
}
