<template>
  <div class="box">
    <div class="img-box"
         ref="star_box"
         v-for="(item, key) in star_list"
         :key="key">
      <img :class="[item == 0 ? 'gray' : 'full']"
           :src="item == 0 ? '/img/gray-star.png' : '/img/star.png'">
    </div>
    <div style="height: 20px"></div>
    <button v-on:click="fall(2)">测试 降1颗星</button>
    <!-- <button v-on:click="fall(2)">测试 降2颗星</button> -->
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>
<script src="https://cdn.bootcss.com/chance/1.0.18/chance.min.js"></script>

<script>

export default {
  data () {
    return {
      star_list: [],
      star_num: 0,
      start_total: 3,
    }
  },
  mounted () {
    var star = 2
    this.setStar(star)
  },
  methods: {
    fall (fall_n) {
      this.setStar(1)
      return
      // // 减少（消失）数量
      // var fall_n = 1
      var star = this.star_num - fall_n

      for (let i = 1; i <= fall_n; i++) {

        // console.log(this.star_num)
        // console.log(i)
        let box = this.$refs.star_box[this.star_num - i]
        console.log(box)

        let isPlay = false; //是否触发了动画
        const imageBox = box;
        const image = imageBox.querySelector("img");

        startAnimation(() => {
          image.classList.remove("quickFade")
          image.classList.remove("full")
          image.classList.remove("opacity1")
          // this.setStar(star)
          image.classList.add('gray')
          image.classList.add('opacity0')
          image.src = '/img/gray-star.png'
          setTimeout(() => {
            image.classList.remove("opacity0")
            image.classList.add("opacity1")
          }, 20)
        })
        function startAnimation (cb) {
          image.classList.remove("quickFade");
          snap(imageBox);
          function snap (target) {
            if (isPlay) {
              console.log('-lock-')
              return
            }
            isPlay = true;
            html2canvas(target, {
              allowTaint: 0,
              useCORS: true,
              backgroundColor: "transparent"
            })
              .then(canvas => {
                const canvasCount = 20;
                const ctx = canvas.getContext("2d");
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixelArr = imageData.data;
                const data = imageData.data.slice(0).fill(0);
                let imageDataArray = Array.from({ length: canvasCount }, e => data.slice(0));

                for (let i = 0; i < pixelArr.length; i += 4) {
                  const p = Math.floor(i / pixelArr.length * canvasCount);
                  const a = imageDataArray[weightedRandomDistrib(p, canvasCount)];

                  a[i] = pixelArr[i];
                  a[i + 1] = pixelArr[i + 1];
                  a[i + 2] = pixelArr[i + 2];
                  a[i + 3] = pixelArr[i + 3];
                }

                for (let i = 0; i < canvasCount; i++) {
                  const c = newCanvasFromImageData(
                    imageDataArray[i],
                    canvas.width,
                    canvas.height
                  );
                  c.classList.add("dust");
                  setTimeout(() => {
                    animateTransform(
                      c,
                      200,
                      -100,
                      chance.integer({ min: -25, max: 25 }),
                      2000
                    );
                    c.classList.add("blur");
                    setTimeout(() => {
                      c.remove();
                      isPlay = false
                      cb()
                    }, 2050);
                  }, 70 * i);

                  target.appendChild(c);
                }

                Array.from(target.querySelectorAll(":not(.dust)")).map(el => {
                  el.classList.add("quickFade");
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          };

          function weightedRandomDistrib (peak, count) {
            const prob = [],
              seq = [];
            for (let i = 0; i < count; i++) {
              prob.push(Math.pow(count - Math.abs(peak - i), 6));
              seq.push(i);
            }
            return chance.weighted(seq, prob);
          }

          function animateTransform (elem, sx, sy, angle, duration) {
            elem.animate(
              [
                { transform: "rotate(0) translate(0, 0)" },
                {
                  transform: "rotate(" + angle + "deg) translate(" + sx + "px," + sy + "px)"
                }
              ],
              {
                duration: duration,
                easing: "ease-in"
              }
            );
          }

          function newCanvasFromImageData (imageDataArray, w, h) {
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const tempCtx = canvas.getContext("2d");
            tempCtx.putImageData(new ImageData(imageDataArray, w, h), 0, 0);

            return canvas;
          }

        }
      }



    },
    setStar (star) {
      var total = this.start_total
      this.star_num = star
      var star_list = new Array(total).fill(0).map((_, i) => i + 1 <= star ? 1 : 0)
      this.star_list = star_list
    }
  }
}
</script>
<style lang="stylus" scoped>
.box
  padding-top 20px
  height 100vh
  background-color #fff
  .img-box
    position relative
    display inline-block
    .gray
      width 45px
    .full
      width 45px
      color rgb(255, 156, 35)
    img
      transition 1s all
      padding 0 5px
</style>


<style>
.dust {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  filter: blur(0.05em);
}

.quickFade {
  animation: fadeout 1s linear forwards;
}

.fade {
  animation: fadeout 2s linear forwards;
}
.opacity0 {
  opacity: 0;
}
.opacity1 {
  opacity: 1;
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.blur {
  animation: fadeblur 2s ease-in forwards;
}

@keyframes fadeblur {
  0% {
    opacity: 1;
    filter: blur(0.05em);
  }
  80% {
    filter: blur(0.188em);
  }
  100% {
    opacity: 0;
  }
}
</style>
