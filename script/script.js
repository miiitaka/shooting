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
   * 敵キャラクター（小）のインスタンス数
   * @type {number}
   */
  const ENEMY_SMALL_MAX_COUNT = 20;

  /**
   * 敵キャラクター（大）のインスタンス数
   * @type {number}
   */
  const ENEMY_LARGE_MAX_COUNT = 5;

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
   * ボスキャラクターのホーミングショットの最大個数
   * @type {number}
   */
  const HOMING_MAX_COUNT = 50;

  /**
   * 背景を流れる星の個数
   * @type {number}
   */
  const BACKGROUND_STAR_MAX_COUNT = 100;

  /**
   * 背景を流れる星の最大サイズ
   * @type {number}
   */
  const BACKGROUND_STAR_MAX_SIZE = 3;

  /**
   * 背景を流れる星の最大速度
   * @type {number}
   */
  const BACKGROUND_STAR_MAX_SPEED = 4;

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
   * ボスキャラクターのインスタンス
   * @type {Boss}
   */
  let boss = null;

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
   * ボスキャラクターのホーミングショットのインスタンスを格納する配列
   * @type {Array<Homing>}
   */
  let homingArray = [];

  /**
   * 流れる星のインスタンスを格納する配列
   * @type {Array<BackgroundStar>}
   */
  let backgroundStarArray = [];

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
      CANVAS_HEIGHT + 50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );

    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, "./image/viper_shot.png");
      singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, "./image/viper_single_shot.png");
      singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, "./image/viper_single_shot.png");
    }
    viper.setShotArray(shotArray, singleShotArray);

    for (let i = 0; i < ENEMY_SHOT_MAX_COUNT; ++i) {
      enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, "./image/enemy_shot.png");
      enemyShotArray[i].setTargets([viper]);
      enemyShotArray[i].setExplosions(explosionArray);
    }

    for (let i = 0; i < HOMING_MAX_COUNT; ++i) {
      enemyShotArray[i] = new Homing(ctx, 0, 0, 32, 32, "./image/homing_shot.png");
      enemyShotArray[i].setTargets([viper]);
      enemyShotArray[i].setExplosions(explosionArray);
    }

    for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, "./image/enemy_small.png");
      enemyArray[i].setShotArray(enemyShotArray);
      enemyArray[i].setAttackTarget(viper);
    }

    for (let i = 0; i < ENEMY_LARGE_MAX_COUNT; ++i) {
      enemyArray[ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 64, 64, "./image/enemy_large.png");
      enemyArray[ENEMY_SMALL_MAX_COUNT + i].setShotArray(enemyShotArray);
      enemyArray[ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(viper);
    }

    boss = new Boss(ctx, 0, 0, 48, 48, "./image/boss.png");
    boss.setShotArray(enemyShotArray);
    boss.setAttackTarget(viper);
    let concatEnemyArray = enemyArray.concat([boss]);

    for (let i = 0; i < EXPLOSION_MAX_COUNT; ++i) {
      explosionArray[i] = new Explosion(ctx, 100, 15, 40, 1);
    }

    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i].setTargets(concatEnemyArray);
      singleShotArray[i * 2].setTargets(concatEnemyArray);
      singleShotArray[i * 2 + 1].setTargets(concatEnemyArray);
      shotArray[i].setExplosions(explosionArray);
      singleShotArray[i * 2].setExplosions(explosionArray);
      singleShotArray[i * 2 + 1].setExplosions(explosionArray);
    }

    for (let i = 0; i < BACKGROUND_STAR_MAX_COUNT; ++i) {
      let
        size  = 1 + Math.random() * (BACKGROUND_STAR_MAX_SIZE - 1),
        speed = 1 + Math.random() * (BACKGROUND_STAR_MAX_SPEED - 1),
        x = Math.random() * CANVAS_WIDTH,
        y = Math.random() * CANVAS_HEIGHT;

      backgroundStarArray[i] = new BackgroundStar(ctx, size, speed);
      backgroundStarArray[i].set(x, y);
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
    homingArray.map((v) => {
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
    util.drawRect(0, 0, canvas.width, canvas.height, "#111122");
    let nowTime = (Date.now() - startTime) / 1000;

    ctx.font = "bold 24px monospace";
    util.drawText(zeroPadding(gameScore, 5), 30, 50, "#111111");

    scene.update();
    viper.update();
    boss.update();

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

    homingArray.map((v) => {
      v.update();
    });

    explosionArray.map((v) => {
      v.update();
    });

    backgroundStarArray.map((v) => {
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
      if (time > 3) {
        // scene.use("invade_default_type");
        scene.use("invade_boss");
      }
    });
    scene.add("invade_default_type", (time) => {
      if (scene.frame % 30 === 0) {
        for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            if (scene.frame % 60 === 0) {
              e.set(-e.width, 30, 2, "default");
              e.setVectorFromAngle(degreesToRadians(30));
            } else {
              e.set(CANVAS_WIDTH + e.width, 30, 2, "default");
              e.setVectorFromAngle(degreesToRadians(150));
            }
            break;
          }
        }
      }
      if (scene.frame === 270) {
        scene.use("blank");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });
    scene.add("blank", (time) => {
      if (scene.frame === 150) {
        scene.use("invade_wave_move_type");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });
    scene.add("invade_wave_move_type", (time) => {
      if (scene.frame % 50 === 0) {
        for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            if (scene.frame <= 200) {
              e.set(CANVAS_WIDTH * 0.2, -e.height, 2, "wave");
            } else {
              e.set(CANVAS_WIDTH * 0.8, -e.height, 2, "wave");
            }
            break;
          }
        }
      }
      if (scene.frame === 450) {
        scene.use("invade_large_type");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });
    scene.add("invade_large_type", (time) => {
      if (scene.frame === 100) {
        let i = ENEMY_SMALL_MAX_COUNT + ENEMY_LARGE_MAX_COUNT;
        for (let j = ENEMY_SMALL_MAX_COUNT; j < i; ++j) {
          if (enemyArray[j].life <= 0) {
            let e = enemyArray[j];
            e.set(CANVAS_WIDTH / 2, -e.height, 50, "large");
            break;
          }
        }
      }
      if (scene.frame === 500) {
        scene.use("invade_boss");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });
    scene.add("invade_boss", (time) => {
      if (scene.frame === 0) {
        boss.set(CANVAS_WIDTH / 2, -boss, 250);
        boss.setMode("invade");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
        boss.setMode("escape");
      }
      if (boss.life <= 0) {
        scene.use("intro");
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
   * 度数法の角度からラジアンを生成する
   * @param {number} degrees - 度数法の度数
   */
  const degreesToRadians = (degrees) => {
    return Math.PI / 180;
  };

  /**
   * 特定の範囲におけるランダムな整数の値を生成する
   * @param {number} range - 乱数を生成する範囲
   */
  const generateRandomInt = (range) => {
    return Math.floor(Math.random() * range);
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

    let button = document.body.querySelector("#start_button");

    button.addEventListener("click", () => {
      this.disabled = true;
      // let sound = new Sound();
      // sound.load("./sound/explosion.mp3", (error) => {
      //   if (error !== null) {
      //     alert("ファイルの読み込みエラーです");
      //     return;
      //   }
        initialize();
        loadCheck();
      // });
    });
  }, false);
})();
