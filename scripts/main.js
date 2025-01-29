(function (window) {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  const PARTICLE_NUM = 5000;
  const RADIUS = Math.PI * 2;
  const CANVASID = "canvas";

  let texts = [
    "TAP DIMANA AJA YA :)",
    "JANGAN LUPA",
    "PAKAI LANDSCAPE MODE",
    "BTW",
    "COBA LIHAT DEH",
    "KATA INI",
    "SEPERTINYA ADA YANG ANEH",
    "AYO PENCET LAGI",
    "AKU GA BOHONG KOK",
    "PENCET LAGI",
    "AKU TAHU KAMU PASTI KESAL",
    "TAPI INI BENER ADA YANG ANEH",
    "AKU JANJI",
    "INI TERAKHIR KALI",
    "PENCET LAGI",
    "AYO SEMANGAT",
    "KAMU PASTI BISA",
    "IHHH KAMU KURANG PENCET ITU",
    "AYO DONG",
    "IYA INI BENER TERAKHIR KOK",
    "YASUDAH DEH",
    "JADI",
    "SEBENERNYA",
    "AKU",
    "SUKA",
    "SAMA",
    "KAMU",
    "DARI",
    "SEMESTER",
    "SATU",
    "HEHEHE...",
    "MAAF YA",
    "BARU BILANG SEKARANG",
  ];

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 50;

  function setDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.left = "0%";
    canvas.style.top = "0%";
    canvas.style.bottom = "0%";
    canvas.style.right = "0%";
    canvas.style.marginTop = window.innerHeight * 0.1 + "px"; // Sesuaikan margin
  }

  function adjustTextSize() {
    // Menyesuaikan ukuran teks berdasarkan ukuran layar
    if (window.innerWidth < 600) {
      textSize = 30; // Ukuran lebih kecil di layar kecil
    } else {
      textSize = 50; // Ukuran teks standar
    }
  }

  function draw() {
    adjustTextSize(); // Menyesuaikan ukuran teks setiap frame

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.textBaseline = "middle";
    ctx.fontWeight = "bold";
    ctx.font =
      textSize +
      "px 'SimHei', 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'";
    ctx.fillText(
      text,
      (canvas.width - ctx.measureText(text).width) * 0.5,
      canvas.height * 0.5
    );

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0, l = particles.length; i < l; i++) {
      let p = particles[i];
      p.inText = false;
    }
    particleText(imgData);

    window.requestAnimationFrame(draw);
  }

  function particleText(imgData) {
    var pxls = [];
    for (var w = canvas.width; w > 0; w -= 3) {
      for (var h = 0; h < canvas.height; h += 3) {
        var index = (w + h * canvas.width) * 4;
        if (imgData.data[index] > 1) {
          pxls.push([w, h]);
        }
      }
    }

    var count = pxls.length;
    var j = parseInt((particles.length - pxls.length) / 2, 10);
    j = j < 0 ? 0 : j;

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y;

        if (quiver) {
          X = pxls[i - 1][0] - (p.px + Math.random() * 10);
          Y = pxls[i - 1][1] - (p.py + Math.random() * 10);
        } else {
          X = pxls[i - 1][0] - p.px;
          Y = pxls[i - 1][1] - p.py;
        }
        var T = Math.sqrt(X * X + Y * Y);
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);
        p.x = p.px + C * T * p.delta;
        p.y = p.py + S * T * p.delta;
        p.px = p.x;
        p.py = p.y;
        p.inText = true;
        p.fadeIn();
        p.draw(ctx);
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!p.inText) {
        p.fadeOut();

        var X = p.mx - p.px;
        var Y = p.my - p.py;
        var T = Math.sqrt(X * X + Y * Y);
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);

        p.x = p.px + (C * T * p.delta) / 2;
        p.y = p.py + (S * T * p.delta) / 2;
        p.px = p.x;
        p.py = p.y;

        p.draw(ctx);
      }
    }
  }

  function event() {
    document.addEventListener(
      "click",
      function (e) {
        textIndex++;
        if (textIndex >= texts.length) {
          textIndex--;
          return;
        }
        text = texts[textIndex];
        console.log(textIndex);
      },
      false
    );

    document.addEventListener(
      "touchstart",
      function (e) {
        textIndex++;
        if (textIndex >= texts.length) {
          textIndex--;
          return;
        }
        text = texts[textIndex];
        console.log(textIndex);
      },
      false
    );
  }

  function init() {
    canvas = document.getElementById(CANVASID);
    if (canvas === null || !canvas.getContext) {
      return;
    }
    ctx = canvas.getContext("2d");
    setDimensions();
    event();

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas);
    }

    draw();
  }

  class Particle {
    constructor(canvas) {
      let spread = canvas.height;
      let size = Math.random() * 1.2;

      this.delta = 0.06;

      this.x = 0;
      this.y = 0;

      this.px = Math.random() * canvas.width;
      this.py = canvas.height * 0.5 + (Math.random() - 0.5) * spread;

      this.mx = this.px;
      this.my = this.py;

      this.size = size;

      this.inText = false;

      this.opacity = 0;
      this.fadeInRate = 0.005;
      this.fadeOutRate = 0.03;
      this.opacityTresh = 0.98;
      this.fadingOut = true;
      this.fadingIn = true;
    }
    fadeIn() {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true;
      if (this.fadingIn) {
        this.opacity += this.fadeInRate;
      } else {
        this.opacity = 1;
      }
    }
    fadeOut() {
      this.fadingOut = this.opacity < 0 ? false : true;
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate;
        if (this.opacity < 0) {
          this.opacity = 0;
        }
      } else {
        this.opacity = 0;
      }
    }
    draw(ctx) {
      ctx.fillStyle = "rgba(226,225,142, " + this.opacity + ")";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  var isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (!isChrome) {
    $("#iframeAudio").remove();
  }

  init();
})(window);
