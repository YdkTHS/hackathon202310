let leftPaddle; // 左のパドルオブジェクト
let rightPaddle; // 右のパドルオブジェクト
let ball; // ボールオブジェクト
let leftScore = 0; // 左側の得点
let rightScore = 0; // 右側の得点
let gameIsOver = false; // ゲームが終了したかどうかを示すフラグ

function setup() {
  createCanvas(windowWidth,windowHeight); // ゲーム画面のキャンバスを作成
  leftPaddle = new Paddle(true); // 左のパドルを生成
  rightPaddle = new Paddle(false); // 右のパドルを生成
  ball = new Ball(); // ボールを生成
}

function draw() {
  background(0, 66, 37);

  // テニスコート風のデザインを描画
  stroke(255);
  strokeWeight(4);
  noFill();
  rect(50, 50, windowWidth - 100, windowHeight - 100); // コートの枠線
  line(windowWidth/ 2, 50, windowWidth / 2, windowHeight - 50); // コートの中央のネット

  if (!gameIsOver) {
    // ゲームが終了していない場合の処理
    leftPaddle.update(); // 左のパドルを更新
    rightPaddle.update(); // 右のパドルを更新
    ball.update(); // ボールを更新

    leftPaddle.show(); // 左のパドルを描画
    rightPaddle.show(); // 右のパドルを描画
    ball.show(); // ボールを描画

    textSize(32);
    fill(255);
    text(leftScore + " - " + rightScore, windowWidth / 2 - 40, 45); // 得点を表示

    // ボールが左のパドルに当たった場合、ボールの速度を反転させる
    if (ball.hits(leftPaddle)) {
      ball.xSpeed *= -1;
    }
    // ボールが右のパドルに当たった場合、ボールの速度を反転させる
    if (ball.hits(rightPaddle)) {
      ball.xSpeed *= -1;
    }

    // ボールが画面左端を越えた場合、右側の得点を増やし、ボールをリセットする
    if (ball.x < 0) {
      rightScore++;
      ball.reset();
    }
    // ボールが画面右端を越えた場合、左側の得点を増やし、ボールをリセットする
    if (ball.x > windowHeight) {
      leftScore++;
      ball.reset();
    }

    // 左側または右側の得点が10以上になった場合、ゲームを終了し、"Game finish!!"を表示する
    if (leftScore >= 10 || rightScore >= 10) {
      gameIsOver = true;
      textSize(64);
      fill(255);
      text("Game finish!!", windowHeight / 2 - 185, windowWidth / 2);
    }
  } else {
    // ゲームが終了した場合、"Game finish!!"を表示する
    textSize(64);
    fill(255);
    text("Game finish!!", windowHeight / 2 - 185, windowWidth / 2);
  }
}

// タッチ開始時の処理
function touchStarted() {
  if (touches.length > 0) {
    // 画面左半分をタッチした場合、左のパドルを移動
    if (touches[0].x < windowHeight / 2) {
      leftPaddle.move(-10); // 上に移動
    }
    // 画面右半分をタッチした場合、右のパドルを移動
    else {
      rightPaddle.move(-10); // 上に移動
    }
  }
  return false; // デフォルトのタッチ操作を無効にする
}

function touchMoved() {
  if (touches.length > 0) {
    // 画面左半分をタッチした場合、左のパドルを移動
    if (touches[0].x < windowHeight / 2) {
      leftPaddle.move(touches[0].y - pmouseY); // タッチの垂直移動を利用してパドルを移動
    }
    // 画面右半分をタッチした場合、右のパドルを移動
    else {
      rightPaddle.move(touches[0].y - pmouseY); // タッチの垂直移動を利用してパドルを移動
    }
  }
  return false; // デフォルトのタッチ操作を無効にする
}

// タッチ終了時の処理
function touchEnded() {
  // タッチ終了時にパドルの移動を停止
  leftPaddle.move(0);
  rightPaddle.move(0);
  return false; // デフォルトのタッチ操作を無効にする
}

// パドルクラスの定義
class Paddle {
  constructor(isLeft) {
    this.width = 100; // パドルの幅
    this.height = 10; // パドルの高さ
    this.isLeft = isLeft; // 左側のパドルかどうかのフラグ
    this.y = windowWidth / 2 - this.height / 2-80; // パドルの初期位置（垂直方向）
    //this.y = this.height / 2 - this.windowWidth / 2; // パドルの初期位置（垂直方向）
    this.ySpeed = 0; // パドルの垂直速度
    this.score = 0; // パドルの得点
  }

  show() {
    fill(255);
  　rect(this.isLeft ? 50 : windowHeight - this.width + 128, this.y, this.height, this.width); // パドルを描画
  }

  update() {
    this.y += this.ySpeed; // パドルの位置を更新
    //this.y = constrain(this.y, 50, this.height-windowWidth - 50); // パドルがコート内に収まるように制限
    this.y = constrain(this.y, 50, windowWidth - this.height); // パドルがコート内に収まるように制限
  }

  move(dir) {
    this.ySpeed = dir; // パドルの垂直速度を設定して移動
  }
}

// ボールクラスの定義
class Ball {
  constructor() {
    this.size = 20; // ボールの直径
    this.x = windowHeight / 2; // ボールの初期位置（水平方向）
    this.y = windowWidth / 2; // ボールの初期位置（垂直方向）
    this.xSpeed = 5; // ボールの水平速度
    this.ySpeed = 5; // ボールの垂直速度
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.size); // ボールを描画
  }

  update() {
    this.x += this.xSpeed; // ボールの位置を更新（水平方向）
    this.y += this.ySpeed; // ボールの位置を更新（垂直方向）

    // ボールが画面の上端または下端に当たった場合、垂直速度を反転
    if (this.y < 50 || this.y > windowWidth - 50) {
      this.ySpeed *= -1;
    }
  }

  // ボールがパドルに当たったかどうかを判定
  hits(paddle) {
    if (this.x > (paddle.isLeft ? 50 : windowHeight - paddle.width - 50) && this.x < (paddle.isLeft ? 50 + paddle.width : windowHeight - 50)) {
      if (this.y > paddle.y && this.y < paddle.y + paddle.height) {
        return true; // ボールがパドルに当たった場合、trueを返す
      }
    }
    return false; // ボールがパドルに当たらなかった場合、falseを返す
  }

  // ボールをリセット
  reset() {
    this.x = windowHeight / 2; // ボールの初期位置（水平方向）
    this.y = windowWidth / 2; // ボールの初期位置（垂直方向）
    this.xSpeed = random(3, 5) * (random() > 0.5 ? 1 : -1); // ボールの水平速度をランダムに設定
    this.ySpeed = random(3, 5) * (random() > 0.5 ? 1 : -1); // ボールの垂直速度をランダムに設定
  }
}