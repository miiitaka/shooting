/**
 * Explosionクラス
 */
class Explosion {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} radius - 爆発の広がりの半径
   * @param {number} count - 爆発の火花の数
   * @param {number} size - 爆発の火花の大きさ（幅・高さ）
   * @param {number} timeRange - 爆発が消えるまでの時間（秒単位）
   * @param {string} {color="#ff1166"} - 爆発の色
   */
  constructor(ctx, radius, count, size, timeRange, color = "#ff1166") {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;
    /**
  　 * 爆発の生存状態を表すグラフ
     * @type {boolean}
     */
    this.life = false;
    /**
  　 * 爆発をfillする際の色
     * @type {strign}
     */
    this.color = color;
    /**
  　 * 自身の座標
     * @type {Position}
     */
    this.position = null;
    /**
  　 * 爆発の広がりの半径
     * @type {number}
     */
    this.radius = radius;
    /**
  　 * 爆発の火花の数
     * @type {number}
     */
    this.count = count;
    /**
  　 * 爆発が始まった瞬間のタイムスタンプ
     * @type {number}
     */
    this.startTime = 0;
    /**
  　 * 爆発が消えるまでの時間
     * @type {number}
     */
    this.timeRange = timeRange;
    /**
  　 * 火花ひとつあたりの大きさ
     * @type {number}
     */
    this.fireSize = size;
    /**
  　 * 火花の位置格納
     * @type {Array<Position>}
     */
    this.firePosition = [];
    /**
  　 * 火花の進行方向を格納
     * @type {Array<Position>}
     */
    this.fireVector = [];
  }

  /**
   * 爆発エフェクトを設定する
   * @param {number} x - 爆発を発生させるX座標
   * @param {number} y - 爆発を発生させるY座標
   */
  set(x ,y) {
    for (let i = 0; i < this.count; i++) {
      this.firePosition[i] = new Position(x, y);
      let r = Math.random() * Math.PI * 2;
      let s = Math.sin(r);
      let c = Math.cos(r);
      this.fireVector[i] = new Position(c, s);
    }
    this.life = true;
    this.startTime = Date.now();
  }

  /**
   * 爆発エフェクトを更新し描画を行う
   */
  update() {
    if (this.life !== true) { return; }

    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;
    let time = (Date.now() - this.startTime) / 1000;
    let progress = Math.min(time / this.timeRange, 1);

    for (let i = 0; i < this.firePosition.length; i++) {
      let d = this.radius * progress;
      let x = this.firePosition[i].x + this.fireVector[i].x * d;
      let y = this.firePosition[i].y + this.fireVector[i].y * d;

      this.ctx.fillRect(
        x - this.fireSize / 2,
        y - this.fireSize / 2,
        this.fireSize,
        this.fireSize
      );
    }

    if (progress >= 1) {
      this.life = false;
    }
  }
}
