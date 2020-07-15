(() => {
  /**
   * キーの押下状態を調べるためのオブジェクト
   * このオブジェクトはプロジェクトのどこからでも参照できるように
   * windowオブジェクトのカスタムプロパティとして設定する
   * @global
   * @type {object}
   */
  window.isKeyDown = {};

  /**
   * canvasの幅
   * @type {number}
   */
  const CANVAS_WIDTH = 640;

  /**
   * canvasの高さ
   * @type {number}
   */
  const CANVAS_HEIGHT = 480;

  /**
   * canvas2DAPIをラップしたユーティリティクラス
   * @type {Canvas2DUtility}
   */
  let util;

  /**
   * 描画対象となるCanvasElement
   * @type {HTMLCanvasElement}
   */
  let canvas;

  /**
   * Canvas2DAPIのコンテキスト
   * @type {CanvasRenderingContext2D}
   */
  let ctx;

  /**
   * イメージのインスタンス
   * @type {image}
   */
  let image;

  /**
   * 実行開始時のタイムスタンプ
   * @type {number}
   */
  let startTime = null;

  /**
   * 自機キャラクターのインスタンス
   * @type {Viper}
   */
  let viper = null;

  /**
   * Canvas & Context initialize.
   */
  const initialize = () => {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    viper = new Viper(ctx, 0, 0, image);

    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );
  };

  /**
   * Rendering function.
   */
  const render = () => {
    ctx.globalAlpha = 1;
    util.drawRect(0, 0, canvas.width, canvas.height, "#eeeeee");
    let nowTime = (Date.now() - startTime) / 1000;

    viper.update();

    requestAnimationFrame(render);
  };

  /**
   * Key Event Settings.
  */
  const eventSetting = () => {
    window.addEventListener("keydown", (event) => {
      isKeyDown[`key_${event.key}`] = true;
    }, false);
    window.addEventListener("keyup", (event) => {
      isKeyDown[`key_${event.key}`] = false;
    }, false);
  };

  window.addEventListener("load", () => {
    util = new Canvas2DUtility(document.body.querySelector("#main_canvas"));
    canvas = util.canvas;
    ctx = util.context;

    util.imageLoader("./image/viper.png", (loadImage) => {
      image = loadImage;
      initialize();
      eventSetting();
      startTime = Date.now();
      render();
    });
  }, false);
})();
