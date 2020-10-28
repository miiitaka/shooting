/**
 * 座標を管理するためのクラス
 */
class Position {
  /**
   * @static
   * @param {number} x - X要素
   * @param {number} y - Y要素
   * @return {number}
   */
  static calcLength(x, y) {
    return Math.sqrt(x * x, y * y);
  }

  /**
   * @static
   * @param {number} x - X要素
   * @param {number} y - Y要素
   * @return {Position}
   */
  static calcNormal(x, y) {
    let len = Position.calcLength(x, y);
    return new Position(x / len, y / len);
  }

  /**
   * @constructor
   * @param {number} x - X座標
   * @param {number} y - Y座標
   */
  constructor(x, y) {
    /**
     * X座標
     * @type {number}
     */
    this.x = x;

    /**
     * Y座標
     * @type {number}
     */
    this.y = y;
  }

  /**
   * 値を設定する
   * @param {number} x - 設定するX座標
   * @param {number} y - 設定するY座標
   */
  set(x, y) {
    if (x !== null) { this.x = x; }
    if (y !== null) { this.y = y; }
  }

  /**
   * 対象をPositionクラスのインスタンスとの距離を返す
   * @param {Position} target - 距離を測る対象
   */
  distance(target) {
    let x = this.x - target.x;
    let y = this.y - target.y;
    return Math.sqrt(x * x + y * y);
  }
}
