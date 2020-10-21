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
   * スコアを格納する
   * このオブジェクトはプログラムのどこからでも参照できるように
   * windowオブジェクトのカスタムプロパティとして設定する
   * @global
   * @type {number}
   */
  window.gameScore = 0;

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
   * shotの最大個数
   * @type {number}
   */
  const SHOT_MAX_COUNT = 10;

  /**
   * 敵キャラクターのインスタンス数
   * @type {number}
   */
  const ENEMY_MAX_COUNT = 10;

  /**
   * 爆発エフェクトのインスタンス数
   * @type {number}
   */
  const EXPLOSION_MAX_COUNT = 10;

  /**
   * 敵キャラクターのショットの最大個数
   * @type {number}
   */
  const ENEMY_SHOT_MAX_COUNT = 50;

  /**
   * canvas2DAPIをラップしたユーティリティクラス
   * @type {Canvas2DUtility}
   */
  let util = null;

  /**
   * 描画対象となるCanvasElement
   * @type {HTMLCanvasElement}
   */
  let canvas = null;

  /**
   * Canvas2DAPIのコンテキスト
   * @type {CanvasRenderingContext2D}
   */
  let ctx = null;

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
   * シーンマネージャーのインスタンス
   * @type {SceneManager}
   */
  let scene = null;

  /**
   * ショットのインスタンスを格納する配列
   * @type {Array<Shot>}
   */
  let shotArray = [];

  /**
   * シングルショットのインスタンスを格納する配列
   * @type {Array<Shot>}
   */
  let singleShotArray = [];

  /**
   * 敵キャラクターのインスタンスを格納する配列
   * @type {Array<Enemy>}
   */
  let enemyArray = [];

  /**
   * 爆発エフェクトのインスタンスを格納する配列
   * @type {Array<Enemy>}
   */
  let explosionArray = [];

  /**
   * 敵キャラクターのショットのインスタンスを格納する配列
   * @type {Array<Enemy>}
   */
  let enemyShotArray = [];

  /**
   * 再スタートするためのフラグ
   * @type {boolean}
   */
  let restart = false;

  /**
   * Canvas & Context initialize.
   */
  const initialize = () => {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    scene = new SceneManager();
    viper = new Viper(ctx, 0, 0, 64, 64, "./image/viper.png");

    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );

    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, "./image/viper_shot.png");
      singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, "./image/viper_single_shot.png");
      singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, "./image/viper_single_shot.png");
    }
    viper.setShotArray(shotArray, singleShotArray);

    for (let i = 0; i < ENEMY_MAX_COUNT; ++i) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 32, 32, "./image/enemy_small.png");
      enemyArray[i].setShotArray(enemyShotArray);
    }

    for (let i = 0; i < EXPLOSION_MAX_COUNT; ++i) {
      explosionArray[i] = new Explosion(ctx, 50, 15, 30, 0.25);
    }

    for (let i = 0; i < ENEMY_SHOT_MAX_COUNT; ++i) {
      enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, "./image/enemy_shot.png");
      enemyShotArray[i].setTargets([viper]);
      enemyShotArray[i].setExplosions(explosionArray);
    }

    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i].setTargets(enemyArray);
      singleShotArray[i * 2].setTargets(enemyArray);
      singleShotArray[i * 2 + 1].setTargets(enemyArray);
      shotArray[i].setExplosions(explosionArray);
      singleShotArray[i * 2].setExplosions(explosionArray);
      singleShotArray[i * 2 + 1].setExplosions(explosionArray);
    }
  };

  /**
   * インスタンスの準備が完了しているか確認する
   */
  const loadCheck = () => {
    let ready = true;
    ready = ready && viper.ready;
    shotArray.map((v) => {
      ready = ready && v.ready;
    });
    singleShotArray.map((v) => {
      ready = ready && v.ready;
    });
    enemyArray.map((v) => {
      ready = ready && v.ready;
    });
    enemyShotArray.map((v) => {
      ready = ready && v.ready;
    });

    if (ready) {
      eventSetting();
      sceneSetting();
      startTime = Date.now();
      render();
    } else {
      setTimeout(loadCheck, 100);
    }
  }

  /**
   * Rendering function.
   */
  const render = () => {
    ctx.globalAlpha = 1;
    util.drawRect(0, 0, canvas.width, canvas.height, "#eeeeee");
    let nowTime = (Date.now() - startTime) / 1000;

    ctx.font = "bold 24px monospace";
    util.drawText(zeroPadding(gameScore, 5), 30, 50, "#111111");

    scene.update();
    viper.update();

    shotArray.map((v) => {
      v.update();
    });

    singleShotArray.map((v) => {
      v.update();
    });

    enemyArray.map((v) => {
      v.update();
    });

    enemyShotArray.map((v) => {
      v.update();
    });

    explosionArray.map((v) => {
      v.update();
    });

    requestAnimationFrame(render);
  };

  /**
   * Key Event Settings.
  */
  const eventSetting = () => {
    window.addEventListener("keydown", (event) => {
      isKeyDown[`key_${event.key}`] = true;
      if (event.key === "Enter") {
        if (viper.life <= 0) {
          restart = true;
        }
      }
    }, false);
    window.addEventListener("keyup", (event) => {
      isKeyDown[`key_${event.key}`] = false;
    }, false);
  };

  /**
   * Scene Event Settings.
   */
  const sceneSetting = () => {
    scene.add("intro", (time) => {
      if (time > 2) {
        scene.use("invade");
      }
    });

    scene.add("invade", () => {
      if (scene.frame === 0) {
        for (let i = 0; i < ENEMY_MAX_COUNT; ++i) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            e.set(CANVAS_WIDTH / 2, -e.height, 2, "default");
            e.setVector(0, 1);
            break;
          }
        }
      }
      if (scene.frame === 100) {
        scene.use("invade");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });
    scene.add("gameover", (time) => {
      let
        textWidth = CANVAS_WIDTH / 2,
        loopWidth = CANVAS_WIDTH + textWidth,
        x = CANVAS_WIDTH - (scene.frame * 2) % loopWidth;

      ctx.font = "bold 72px sans-serif";
      util.drawText("GAME OVER", x, CANVAS_HEIGHT / 2, "#ff0000", textWidth);

      if (restart) {
        restart = false;
        gameScore = 0;
        viper.setComing(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT + 50,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT - 100
        );
        scene.use("intro");
      }
    });
    scene.use("intro");
  };

  /**
   * 数値の不足した桁数をゼロで埋めた文字列を返す
   * @param {number} number - 数値
   * @param {number} count - 桁数（2桁以上）
   */
 const zeroPadding = (number, count) => {
   let zeroArray = new Array(count);
   let zeroString = zeroArray.join("0") + number;
   return zeroString.slice(-count);
 };

  window.addEventListener("load", () => {
    util = new Canvas2DUtility(document.body.querySelector("#main_canvas"));
    canvas = util.canvas;
    ctx = util.context;

    initialize();
    loadCheck()
  }, false);
})();
