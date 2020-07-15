/**
 * 座標を管理するためのクラス
 */
class Position {
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
}