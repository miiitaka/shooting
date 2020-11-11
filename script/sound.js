/**
 * 効果音を再生するための簡易的なクラス
 */
class Sound {
  constructor() {
    /**
     * オーディオのコンテキスト
     * @type {AudioContext}
     */
    this.ctx = new AudioContext();
    /**
     * デコードしたオーディオデータ
     */
    this.source = null;
  }

  /**
   * オーディオファイルのロード
   * @param {string} audioPath - オーディオファイルのパス
   * @param {function} callback - ファイルのロード完了時に呼ばれるコルバック関数
   */
  load(audioPath, callback) {
    fetch(audioPath)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      return this.ctx.decodeAudioData(buffer);
    })
    .then((decodeAudio) => {
      this.source = decodeAudio;
      callback();
    })
    .catch(() => {
      callback("error");
    });
  }
  /**
   * AudioBufferからAudioBufferSourceNodeを生成して再生する
   */
  play() {
    let node = new AudioBufferSourceNode(this.ctx, {buffer: this.source});
    node.connect(ths.ctx.destination);
    node.addEventListener("ended", () => {
      node.stop();
      node.disconnect();
      node = null;
    }, false);
    node.start();
  }
}
