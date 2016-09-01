Array.max = function(array){
  return Math.max.apply(Math, array);
};

Array.min = function(array){
  return Math.min.apply(Math, array);
};

function getCursorPosition(e) {
  return {x: e.pageX, y: e.pageY};
}

function declOfNum(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

function showStep(step) {
  $('[data-step-screen="' + step + '"]')
  .add('[data-step-circle="' + step + '"]')
    .addClass('isActive')
    .siblings().removeClass('isActive');
  if(step == 1){
    parallax();
  }
  if(step == 2) {
    clearInterval(window.refresh);
    setDiargam(Dic.circlesObject);
    $('@mobile-result').show();
    $('.mobile-choice').hide();
    // -- andrewgs tmp soultion
    $('div.step-block').find('span.isActive').removeClass('isActive');
    $('div.step-block').find('span:nth-child(3)').addClass('circle isActive');
  }else{
  }
}

function parallax(step) {
    var items = $('@parallax-ball');
    var goLeft, goTop;
    window.refresh = setInterval(balls, 4000);
    balls();
    function balls (){
      items.each(function(i, val){
        $(val).css({
           "transform": 'translate('+goLeft+'px, '+goTop+'px)',
        });
        goLeft = -30 + Math.floor(Math.random() * 70);
        goTop = -30 + Math.floor(Math.random() * 70);
      });
    }
}



var grphm = grphm || { };
    grphm.currentLeafFade = 0;

if ( $(window).height() > 762 && $(window).width() > 1024 ) { 
  grphm.crossPoint = 450;
  grphm.iframeWidth = 975;
  grphm.circleRadius = 255; //330;
  grphm.circleDelta = 50;
  grphm.arrowRadius = 225;
  grphm.arrowOffset = 1;
  grphm.arrowOffset2 = 22;
  grphm.circleRadiusCoef = 1.1;
} else {
  grphm.crossPoint = 300;
  grphm.iframeWidth = 650;
  grphm.arrowRadius = 155;
  grphm.arrowOffset = 22;
  grphm.arrowOffset2 = 22;
  grphm.circleRadius = 195;
  grphm.circleDelta = 20;
  grphm.circleRadiusCoef = 1.12;
}

function setDiargam(data) {
  // Calculate the sum of all votes
  var total = 0,
      quantity_outer = 0, // images
      quantity_inner = 0, // icons
      quantity_total = 0, // total
      avg = 0,
      max = 0;

  for (var i in data) {
    if ( data[i]['type'] == 'inner' ) {
      quantity_inner++;
    } else {
      total += parseInt(data[i]['votes']);
      quantity_outer++;
    }
    quantity_total++;
    if (parseInt(data[i]['votes']) > max) {
      max = data[i]['votes'];
    }
  }
  avg = Math.round(total/quantity_outer);
  total = total + avg * quantity_inner;

  // Draw circle diagram
  var prevAngle = 0,
      angle = 0,
      fraction = 0;

  for (var i in data)
  {
    if ( data[i]['type'] == 'inner' )
    {
      // Fraction of the segment
      fraction = avg/total;
      // Calculate initial angle
      angle = prevAngle + fraction * Math.PI * 2;
      makeImageClip(i, prevAngle, angle, true, max);
    } else {
      fraction = parseInt(data[i]['votes'])/total;
      angle = prevAngle + fraction * Math.PI * 2;
      makeImageClip(i, prevAngle, angle, false, max);
    }
    // Refresh for next iteration
    prevAngle = angle;
  }

  function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
  }

  function grayScale(context, canvas) {
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixels  = imgData.data;

    for (var i = 0, n = pixels.length; i < n; i += 4) {
      var grayscale = pixels[i] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;
      pixels[i  ] = grayscale; // red
      pixels[i+1] = grayscale; // green
      pixels[i+2] = grayscale; // blue
      //pixels[i+3]            // is alpha
    }
    // Redraw the image in black & white
    context.putImageData(imgData, 0, 0);
  }

  function showLeaf(currentLeaf, direction) {

    if (direction == "init") {
      currentLeaf = currentLeaf;
    } else {
      if (direction == "forward") {
        currentLeaf = currentLeaf + 1;
        if (currentLeaf >= Object.keys(data).length) {
          currentLeaf = 0;
        }
      } else {
        currentLeaf = currentLeaf - 1;
        if (currentLeaf < 0) {
          currentLeaf = Object.keys(data).length - 1;
        }
      }
    }

    for (var i in data) {

        $('@canvas-circle').show();
        $('@canvas-circle-name').html(data[currentLeaf]['name']);
        $('@canvas-circle-votes').html(data[currentLeaf]['votes'] + ' ' + declOfNum(data[currentLeaf]['votes'], ['голос', 'голоса', 'голосов']));
        if ( currentLeaf != i ) {
          // $('img.canvas__bw').show();
          $('@canvas-container').find('img#'+ i +'-bw').fadeIn(300);
          $('@canvas-container').find('img#'+ i).fadeOut(150);
          
          $('@canvas-container').find('img#'+ currentLeaf +'-bw').fadeOut(300);
          $('@canvas-container').find('img#'+ currentLeaf).fadeIn(150);
        }

        var parent = $('.canvas__results');
        var child = $('.canvas__arrow');

        var radius_ = 105;
        var x_ = parent.width()/2 - child.width()/2 + Math.round( (Math.cos(-1 * (grphm[currentLeaf].angle / (180/Math.PI)))) * radius_ );
        var y_ = -290 + 132 + Math.round( (Math.sin((grphm[currentLeaf].angle / (180/Math.PI)))) * radius_);
        $('div.canvas__arrow').show();
        $('div.canvas__arrow').css("transform", 'rotate('+ grphm[currentLeaf].angle +'deg)');
        $('div.canvas__arrow').css("left", x_ + "px");
        $('div.canvas__arrow').css("top", y_ + "px");
    }

    return currentLeaf;
  }

  function makeImageClip(i, prevAngle_, angle_, boolean_, max_) {

      $('@canvas-container').append('<canvas class="canvas__canvas canvas__white" id="'+ i +'-white" width="'+grphm.iframeWidth+'" height="'+grphm.iframeWidth+'"> </canvas>')
      $('@canvas-container').append('<canvas class="canvas__canvas" id="'+ i +'" width="'+grphm.iframeWidth+'" height="'+grphm.iframeWidth+'"> </canvas>')
      $('@canvas-container').append('<canvas class="canvas__canvas canvas__bw" id="'+ i +'-bw" width="'+grphm.iframeWidth+'" height="'+grphm.iframeWidth+'"> </canvas>')

      grphm[i] = { };
      grphm[i].canvas = document.getElementById(i);
      grphm[i].ctx = grphm[i].canvas.getContext('2d');
      grphm[i].img = document.createElement('IMG');
      grphm[i].angle = Math.round((prevAngle_ + angle_)/2 * (180/Math.PI));

      grphm[i+'-white'] = { };
      grphm[i+'-white'].canvas = document.getElementById(i+'-white');
      grphm[i+'-white'].ctx = grphm[i+'-white'].canvas.getContext('2d');
      // grphm[i+'-white'].img = document.createElement('IMG');

      grphm[i+'-bw'] = { };
      grphm[i+'-bw'].canvas = document.getElementById(i+'-bw');
      grphm[i+'-bw'].ctx = grphm[i+'-bw'].canvas.getContext('2d');
      grphm[i+'-bw'].img = document.createElement('IMG');

      var percentOfMax = Math.round(parseInt(data[i]['votes']) * 100 / max_);
      grphm[i].radius = grphm.circleRadius + grphm.circleDelta + Math.round(50 * percentOfMax / 100);

      grphm[i].img.onload = function () {

          var K, W, H, X, Y;

          K = this.height/this.width;
          if (boolean_) {
              W = 24;
          } else {
              W = grphm.circleRadius + grphm.circleDelta + 200;
          }
          H = W * K;
          X = grphm.crossPoint + Math.round((Math.cos(-1 * (prevAngle_+angle_)/2)) * grphm.circleRadius/grphm.circleRadiusCoef);
          Y = grphm.crossPoint + Math.round((Math.sin((prevAngle_+angle_)/2)) * grphm.circleRadius/grphm.circleRadiusCoef);

          // White background
          grphm[i+'-white'].ctx.fillStyle = "#fff";
          grphm[i+'-white'].ctx.beginPath();
          grphm[i+'-white'].ctx.moveTo(grphm.crossPoint, grphm.crossPoint);
          if (boolean_) {
            grphm[i+'-white'].ctx.arc(grphm.crossPoint,grphm.crossPoint, grphm.circleRadius, prevAngle_, angle_, false);
          } else {
            grphm[i+'-white'].ctx.arc(grphm.crossPoint,grphm.crossPoint, grphm[i].radius, prevAngle_, angle_, false);
          }
          grphm[i+'-white'].ctx.lineTo(grphm.crossPoint,grphm.crossPoint);
          grphm[i+'-white'].ctx.closePath();
          grphm[i+'-white'].ctx.fill();
          grphm[i+'-white'].ctx.save();

          // Color leafs
          grphm[i].ctx.beginPath();
          grphm[i].ctx.moveTo(grphm.crossPoint, grphm.crossPoint);
          if ( data[i]['type'] == 'long' ) {
            grphm[i].ctx.arc(grphm.crossPoint,grphm.crossPoint, grphm[i].radius, prevAngle_, angle_, false);
          } else {
            grphm[i].ctx.arc(grphm.crossPoint,grphm.crossPoint, grphm.circleRadius, prevAngle_, angle_, false);
          }
          grphm[i].ctx.lineTo(grphm.crossPoint,grphm.crossPoint);
          grphm[i].ctx.closePath();
          grphm[i].ctx.clip();
          grphm[i].ctx.drawImage(grphm[i].img, X-W/2, Y-H/2, W, H);
          grphm[i].ctx.restore();

          var img_color = grphm[i].canvas.toDataURL("image/png");
          $('@canvas-container').append('<img style="display: none;" id="' + i + '" class="canvas__image" src="' + img_color + '"/>');
          $('@canvas-container').find('canvas#'+i).remove();

          // Black and white leafs
          grphm[i+'-bw'].ctx.beginPath();
          grphm[i+'-bw'].ctx.moveTo(grphm.crossPoint, grphm.crossPoint);
          if ( data[i]['type'] == 'long' ) {
            grphm[i+'-bw'].ctx.arc(grphm.crossPoint,grphm.crossPoint, grphm[i].radius, prevAngle_, angle_, false);
          } else {
            grphm[i+'-bw'].ctx.arc(grphm.crossPoint,grphm.crossPoint, grphm.circleRadius, prevAngle_, angle_, false);
          }
          grphm[i+'-bw'].ctx.lineTo(grphm.crossPoint,grphm.crossPoint);
          grphm[i+'-bw'].ctx.closePath();
          grphm[i+'-bw'].ctx.clip();
          grphm[i+'-bw'].ctx.drawImage(grphm[i].img, X-W/2, Y-H/2, W, H);
          grayScale(grphm[i+'-bw'].ctx, grphm[i+'-bw'].canvas);
          grphm[i+'-bw'].ctx.restore();

          var img_bw = grphm[i+'-bw'].canvas.toDataURL("image/png");
          if ( $(window).height() < 762 && $(window).width() < 1024 ) { 
            $('@canvas-container').append('<img style="opacity: 0.2;" id="' + i + '-bw" class="canvas__image canvas__bw" src="' + img_bw + '"/>');
          } else {
            $('@canvas-container').append('<img style="opacity: 0.8;" id="' + i + '-bw" class="canvas__image canvas__bw" src="' + img_bw + '"/>');            
          }
          $('@canvas-container').find('canvas#'+i+'-bw').remove();
      };

      grphm[i].img.src = data[i]['d_image'];
  }

  let leaveTimeout = false;

  grphm[quantity_total-1+'-white'].canvas.style.zIndex = 190;

  if ($(window).width() > 1024) {
    grphm[quantity_total-1+'-white'].canvas.onmousemove = function(e) {
        // Important: correct mouse position
        var rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left + grphm.arrowOffset,
            y = e.clientY - rect.top + grphm.arrowOffset;

        for (var i in data) {
          // if (grphm[i].ctx.isPointInPath(x, y) || grphm[i+'-white'].ctx.isPointInPath(x, y)) {
          if ( grphm[i+'-white'].ctx.isPointInPath(x, y) ) {
            $('@canvas-circle').show();
            $('@canvas-circle-name').html(data[i]['name']);
            $('@canvas-circle-votes').html(data[i]['votes'] + ' ' + declOfNum(data[i]['votes'], ['голос', 'голоса', 'голосов']));
            if ( grphm.currentLeafFade != i ) {
              // $('img.canvas__bw').show();
              $('@canvas-container').find('img#'+ grphm.currentLeafFade +'-bw').fadeIn(200);
              $('@canvas-container').find('img#'+ grphm.currentLeafFade).fadeOut(200);
              
              $('@canvas-container').find('img#'+ i +'-bw').fadeOut(200);
              $('@canvas-container').find('img#'+ i).fadeIn(200);
            }

            var x_ = grphm.arrowRadius - grphm.arrowOffset2 + Math.round( (Math.cos(-1 * (grphm[i].angle / (180/Math.PI)))) * grphm.arrowRadius );
            var y_ = grphm.arrowRadius - grphm.arrowOffset2 + Math.round( (Math.sin((grphm[i].angle / (180/Math.PI)))) * grphm.arrowRadius);
            $('div.canvas__arrow').show();
            $('div.canvas__arrow').css("transform", 'rotate('+ grphm[i].angle +'deg)');
            $('div.canvas__arrow').css("left", x_ + "px");
            $('div.canvas__arrow').css("top", y_ + "px");

            clearTimeout(leaveTimeout);

            grphm.currentLeafFade = i;
          }
        }
    };

    grphm[quantity_total-1+'-white'].canvas.onmouseleave = function(e) {
      leaveTimeout = setTimeout(function(){
        $('@canvas-circle').hide();
        // $('img.canvas__bw').show();
        $('@canvas-container').find('img#'+ grphm.currentLeafFade).fadeOut(200);
        $('@canvas-container').find('img#'+ grphm.currentLeafFade +'-bw').fadeIn(200);
        grphm.currentLeafFade = -1; // reset it to prevent error with comeback to the same leaf after leave
        $('div.canvas__arrow').hide();
      }, 1000);
    };
    $('div.canvas__arrow').mouseover(function(){
      clearTimeout(leaveTimeout);
    });
  } else {
    var currentLeaf = 0;
    
    currentLeaf = showLeaf(currentLeaf, 'init');

    $('@left').on('tap click', function() {
      currentLeaf = showLeaf(currentLeaf, 'back');
    });
    $('@right').on('tap click', function() {
      currentLeaf = showLeaf(currentLeaf, 'forward');
    });
  }
}

var rbc = {
    $header: $('@header'),
    $headerOpen: $('@header-open'),
    showMenu: function() {
        this.$header.addClass('isActive');
    },
    hideMenuTimeout: false,
    hideMenu: function() {
        var t = this;
        clearTimeout(this.hideMenuTimeout);
        this.hideMenuTimeout = setTimeout(function() {
            t.$header.removeClass('isActive');
        }, 1000);
    },
    init: function() {
        var t = this;
        t.$headerOpen.on('click', function() {
            t.showMenu();
            return false;
        });
        t.$header.on('mouseover', function() {
            clearTimeout(t.hideMenuTimeout);
        });
        t.$header.on('mouseleave', function() {
            t.hideMenu();
        });
    }
}
rbc.init();

var Share = {
    vk: function(purl) {
        if (!purl) purl = window.location.href;
        var
            url = 'http://vk.com/share.php?';
        url += 'url=' + encodeURIComponent(purl);
        url += '&noparse=true';
        this.popup(url);
    },
    fb: function(purl) {
        if (!purl) purl = window.location.href;
        var
            url = 'https://www.facebook.com/sharer/sharer.php?u=';
        url += encodeURIComponent(purl);
        this.popup(url);
    },
    tw: function(purl) {
        if (!purl) purl = window.location.href;
        var
            str = $('[property="og:title"]').attr('content') + ' ';
        str += encodeURIComponent(purl);
        var
            url = 'https://twitter.com/intent/tweet?text=';
        url += str;
        this.popup(url);
    },
    gp: function(purl) {
        if (!purl) purl = window.location.href;
        var
            url = 'https://plus.google.com/share?url=';
        url += encodeURIComponent(purl);
        this.popup(url);
    },
    popup: function(url) {
        window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
    }
}

class Hint {
    constructor() {
        if (!$('@main-hint').length || $(window).width() < 780) return;

        // console.log($(window).width())
        let t = this;
        t.activeIndex = 0;
        t.timeout = false;
        $('@hint-open').on('click', function() {
            t.open();
            return false;
        });
        $('@main-hint').on('click', function() {
            t.next();
        });
        $('@hint-close').on('click', function() {
            t.close();
            return false;
        });
        // if($.cookie('TeaserClosed')) {
        //     t.showHint(1);
        //     t.open();
        // }


    }
    open() {
        let t = this;
        $('@main-hint').show();
        setTimeout(function() {
            $('@main-hint').addClass('isActive');
        });
        t.step1();

        setTimeout(function() {
            $('@hint-circle').addClass('isTransition');
        });
    }

    close() {
        $('@circle').removeClass('isMoving');
        //let t = this;
        $('@main-hint').removeClass('isActive');
        setTimeout(function() {
            $('@main-hint').hide();
        }, 200);
        clearTimeout(t.timeout);
        $('@hint-circle').removeClass('isTransition');


    }
    next() {
        let t = this;
        clearTimeout(t.timeout);
        if (t.activeIndex == 1) {
            t.step2();
        } else {
            t.close();
        }
    }

    step1() {
        let t = this;
        clearTimeout(t.timeout);
        t.activeIndex = 1;
        var position = {};
        // var $circleToShow = $('@circle-item').first();
        var highest;
        var first = 1;
        $('@circle-item').each(function() {
            if (first == 1) {
                highest = $(this);
                first = 0;
            } else {
                if (highest.height() < $(this).height()) {
                    highest = $(this);
                }
            }
        });
        var $circleToShow = highest;


        $circleToShow.parent().addClass('isMoving');
        $.each(['left', 'top'], function(index, value) {
            position[value] = $circleToShow.offset()[value];
        });
        $.each(['width', 'height'], function(index, value) {
            position[value] = $circleToShow.outerWidth();
        });
        t.showHint(1);
        t.setCircle(position);
        t.timeout = setTimeout(function() {
            t.next();

        }, 2000);

    }
    step2() {
        let t = this;
        clearTimeout(t.timeout);
        t.activeIndex = 2;
        var position = {};
        var $tripArea = $('@trip-area');
        $.each(['left', 'top'], function(index, value) {
            position[value] = $tripArea.offset()[value] - 30;
        });
        $.each(['width', 'height'], function(index, value) {
            position[value] = $tripArea.outerWidth() + 60;
        });
        t.setCircle(position);
        t.showHint(2);
        t.timeout = setTimeout(function() {
            t.next();
        }, 5000);
    }
    showHint(id) {
        $('[data-hint-id="' + id + '"]').addClass('isActive')
            .siblings('[data-hint-id]').removeClass('isActive');
    }
    setCircle(args) {
        let $circle = $('@hint-circle');
        $circle.css(args);
    }
}

class Teaser {
    constructor() {
        if (!$('@teaser').length) return;
        let t = this;
        t.hint = new Hint();

        if ($(window).width() <= 1024) {

          $('.main-block').addClass('noscroll');
          $('.main-block').css('height','0');
          $('.main-block').css('max-height','initial');
          $('@teaser').show();

            $('@teaser-close').on('click', function() {
                $('.main-block').removeClass('noscroll');
                $('.main-block').css('height','735px');
                t.close();
            });

        } else {
          // if (!$.cookie('alreadyVoted')) {
              $('@teaser').show();
          // }

          $('@teaser-close').on('click', function() {
              t.close();
          });
        }


    }

    close() {
        let t = this;
        let $teaser = $('@teaser');
        $teaser.fadeOut(function() {

          if ($(window).width() > 1024) {
            // t.hint.open();
          }
        });
        $.cookie('TeaserClosed', true, {
            path: '/'
        });
    }
}

class Circles {
    constructor() {
        let t = this;
        this.movingID = false;
        this.startMovingPosition = {};
        this.voted = [];
        this.isVoted = false;
        this.lastStatus = false;
          if ($(window).height() <= 780) {
            t.positions = [{//воздушный шар
                left: 22.6,
                top: 194
            }, {
                left: 30.3,
                top: 330
            }, {
                left: 15,
                top: 420
            }, {
                left: 8,
                top: 255
            }, {
                left: 5,
                top: 810
            }, {
                top: 600,
                left: 18
            }, {
                left: 27.4,
                top: 524
            }, {
                left: 37,
                top: 680
            }, {
                right: 35.5,
                top: 360
            }, {
                right: 5,
                top: 203
            }, {
                right: 33,
                top: 170.37

            }, {
                left: 14,
                top: 100
            }, {
                right: 21,
                top: 340
            }, {
                right: 18,
                top: 110
            }, {
                right: 7,
                top: 410
            }, {
                right: 28,
                top: 535
            }, {
                left: 7,
                top: 630
            }, {
                left: 25,
                top: 770
            }, {
                left: 18,
                top: 830
            }, {
                left: 40,
                top: 880
            }];
          }else{
            t.positions = [{
                left: 22.6,
                top: 194
            }, {
                left: 10.3,
                top: 320
            }, {
                left: 6.4,
                top: 470
            }, {
                left: 8,
                top: 569
            }, {
                left: 12.8,
                top: 742
            }, {
                top: 570,
                left: 18
            }, {
                left: 27.4,
                top: 524
            }, {
                left: 27,
                top: 660
            }, {
                right: 27.5,
                top: 280
            }, {
                right: 5,
                top: 203
            }, {
                right: 13,
                top: 170.37

            }, {
                left: 21,
                top: 400
            }, {
                right: 18,
                top: 340
            }, {
                right: 8,
                top: 420
            }, {
                right: 19,
                top: 490
            }, {
                right: 28,
                top: 535
            }, {
                left: 10,
                top: 210
            }, {
                left: 19,
                top: 315
            }, {
                left: 5,
                top: 790
            }, {
                left: 40,
                top: 800
            }];
          }
        t.votes = {
            min: 99999,
            max: 0
        };
        if ($(window).height() <= 780) {
            $.each(t.positions, function(i, v) {
                t.positions[i].top = t.positions[i].top / 1.50;
                if(t.positions[i].left){
                  t.positions[i].left = t.positions[i].left / 1.2 +'vw';

                }else if(t.positions[i].right){
                  t.positions[i].right = t.positions[i].right / 1.2 +'vw';

                }
                // console.log(t.positions[i]);
            });
        } else {
          $.each(t.positions, function(i, v) {
              if(t.positions[i].left){
                t.positions[i].left = t.positions[i].left / 1 +'vw';
              }else if(t.positions[i].right){
                t.positions[i].right = t.positions[i].right / 1 +'vw';
              }
          });
        }
        t.circlesObject = {};
        $.ajax({
            url: Dic.API_URL + 'getcircles',
            type: 'get',
            dataType: 'json'
        }).done(function(response) {
            t.circlesObject = response;
            Dic.circlesObject = response;
            t.setCircles();
            t.setStatus('start');
            showStep(2);
            // if ($.cookie('alreadyVoted')) {
            //     showStep(2);

            // } else {
            //     showStep(1);
            // }
        }).fail(function(response) {
            console.log(response);
        });
        $('@votes-reset').on('click', function() {
          t.reset();
          return false;
        });
        $('@votes-confirm').on('click', function() {
            t.confirm();
            return false;
        });



        if ($(window).width() <= 1024) {

        } else {

          $(document).on('mousedown', '@circle', function(e) {
              if (t.voted.length < 3) {
                  t.movingID = $(this).attr('data-circle-id');
                  $(this).addClass('isMoving');
                  t.startMovingPosition = getCursorPosition(e);
                  t.showPlus();
                  e.preventDefault();

                  $('body').addClass('isMovingCircle');
              }
          });
          $(document).on('mousemove', function(e) {
              if (t.movingID) {
                  t.moveCircleViaCursor(t.movingID, getCursorPosition(e));
                  e.preventDefault();
              }
          });
          $(document).on('mouseup', '@trip-area', function(e) {
              if (t.movingID) {
                  t.setVote(t.movingID);
                  t.justVoted = true;
                  e.preventDefault();
              }
          });
          $(document).on('mouseenter', '@trip-area', function(e) {
              if (t.voted.length < 3) {
                  if (t.movingID) {
                      $('@trip-area').addClass('isScaled');
                  }
              }
          });
          $(document).on('mouseleave', '@trip-area', function(e) {
              if (t.voted.length < 3) {
                  if (t.movingID) {
                      $('@trip-area').removeClass('isScaled');
                  }
              }
          });
          $(document).on('mouseup', function(e) {
              $('body').removeClass('isMovingCircle');
              if (t.movingID) {
                  let $movingCircle = $('@circle[data-circle-id="' + t.movingID + '"]');
                  $movingCircle.removeClass('isMoving');
                  if (!t.justVoted) {
                      t.moveCircle($movingCircle.attr('data-circle-id'), {
                          x: 0,
                          y: 0
                      });
                  }
                  t.justVoted = false;
                  t.movingID = false;
                  if (t.voted.length >= 3) {
                      setTimeout(function() {
                          t.setStatus('end');
                      }, 1500)
                  }
                  t.hidePlus();
                  e.preventDefault();
              }
          });
        }
    }
    confirm() {
        let t = this;
        $.ajax({
            'type': 'get',
            'url': Dic.API_URL + 'sendvotes',
            'data': 'votes=' + t.voted.join(',')
        }).done(function() {
            showStep(2);
            $.cookie('alreadyVoted', true, {
                path: '/'
            });
        }).fail(function(response) {
            //console.log(response);
        });
    }
    reset() {
        let t = this;
        $('@circle.isFaded').removeClass('isFaded');
        $.each(t.voted, function(index, value) {
            t.moveCircle(value, {
                x: 0,
                y: 0
            });
        });
        t.voted = [];
        t.setStatus('start');
    }
    showPlus() {
        $('[data-step="moving"]').addClass('isActive');
        //$('.trip-area').addClass('isScaled');
    }
    hidePlus() {
        $('[data-step="moving"]').removeClass('isActive');
        //$('.trip-area').removeClass('isScaled');
    }
    setVote(id) {
        let t = this;
        var circle = t.circlesObject[id];
        var $circle = $('@circle[data-circle-id="' + id + '"]');
        t.setStatus('chosen');
        t.voted.push(id);
        $circle.addClass('isFaded');
        $('@vote-preview').css('background-image', 'url(' + circle.image + ')');
        $('@vote-title').html(circle.name);
        $('@vote-count').html(circle.votes + ' ' + declOfNum(circle.votes, ['голос', 'голоса', 'голосов']));
        var votesLeft = (3 - t.voted.length);
        if (votesLeft == 0) {
            $('@vote-left-container').hide();
        } else {
            $('@vote-left-container').show();
            $('@vote-left').html(votesLeft + ' ' + declOfNum(votesLeft, ['приключение', 'приключения', 'приключений']));
        }
    }
    setStatus(status) {
        let t = this;
        this.status = status;
        $('[data-step="' + status + '"]').addClass('isActive')
            .siblings().removeClass('isActive');
        let $tripArea = $('@trip-area');
        setTimeout(function() {
            if (t.voted.length > 0) {
                $tripArea.removeClass('isScaled');
            }
            let $circlesContainer = $('@circles-container');
            if (t.voted.length > 2) {
                $circlesContainer.addClass('isNotAllowedToMove');
            } else {
                $circlesContainer.removeClass('isNotAllowedToMove');
            }
        });
    }
    moveCircleViaCursor(id, cursorPosition) {
        let t = this;
        let newPosition = {};
        $.each(['x', 'y'], function(i, v) {
            newPosition[v] = cursorPosition[v] - t.startMovingPosition[v]
        });
        t.moveCircle(id, newPosition);
    }
    moveCircle(id, position) {
        let $circle = $('@circle[data-circle-id="' + id + '"]');
        let $item = $circle.find('@circle-item');
        $item.css({
            'transform': 'translate(' + position.x + 'px, ' + position.y + 'px)'
        });
    }
    renderCircle(circle) {
        let t = this;
        let imageStyleStr = 'background-image: url(' + circle.image + ');';
        let imageStyleOuter = '';
        let imageStyleInner = '';
        let imageBefore = '';
        let number = parseInt(circle.id) + 1;

        if (circle.type == 'inner') {
            imageStyleInner = imageStyleStr;
            imageBefore = 'no-mask'
        } else {
            imageStyleOuter = imageStyleStr;
            imageBefore = 'bg-hover'
        }
        return '<div class="circle-container circle-parallax" role="circle" data-circle-id="' + circle.id + '" style="z-index:' + parseInt(20-circle.id) + ';">\
                  <div  role="circle-item" class="user-circle ' + imageBefore + '">\
                    <div class="circle-bg" style="' + imageStyleOuter + '"></div>\
                    <div style="' + imageStyleInner + '" role="circle-inner" class="inner">\
                      <span class="number"> <span>' + number + '</span><span>20</span></span>\
                      <span class="text" role="circle-text">' + circle.name + '</span>\
                      <span class="votes" role="circle-text">' + circle.votes + '<span class="icon-heart"></span></span>\
                    </div>\
                  </div>\
                </div>';
              }
    setSize(id) {
        let t = this;
        let $circle = $('@circle[data-circle-id="' + id + '"]');
        let circle = t.circlesObject[id];
        let blockSizes = {
            min: 110,
            max: 140
        }
        let blockSizeMobile = 265;
        let fontSizes = {
            min: 10,
            max: 15
        }
        let votePercents = (circle.votes - t.votes.min) / ((t.votes.max - t.votes.min) / 100);
        let blockSize = (blockSizes.max - blockSizes.min) * (votePercents / 100) + blockSizes.min;
        let blockSizeMin = blockSize - 12 * 2;
        let blockGap = 12;
        let fontSize = (fontSizes.max - fontSizes.min) * (votePercents / 100) + fontSizes.min;

        $circle.find('@circle-item').css({
            'width': blockSize,
            'height': blockSize,
            'margin': (-blockSize / 2) + 'px 0 0 ' + (-blockSize / 2) + 'px',
            'border-radius': blockSize
        });

        $circle.find('@circle-inner').css({
            'top': blockGap,
            'left': blockGap,
            'width': blockSizeMin,
            'height': blockSizeMin,
            'border-radius': blockSizeMin,
            'line-height': blockSizeMin + 'px'
        });

        $circle.find('@circle-text').css({
            'font-size': fontSize
        });
    }
    setPositions(id) {
        let t = this;
        let $circle = $('@circle');
        let activePositionIndex = 0;

        let positions = t.positions.sort(function() {
            return 0.5 - Math.random()
        });
        $circle.each(function() {
          let thisPosition;
          // if ($(this).attr('data-circle-id') == 18) {
          //     thisPosition = {
          //         right: "40vw",
          //         top: $(window).height() <= 760 ? 500 : 670
          //     }
          // } else {
              thisPosition = positions[activePositionIndex];
              activePositionIndex++;
          // }
          $(this).css(thisPosition);

        });
    }
    setCircles() {
        let t = this;
        let $circlesContainer = $('@circles-container');
        let numbers = [];
        $.each(t.circlesObject, function(index, value) {
            numbers.push(value.votes);
        });
        t.votes.min = Array.min(numbers);
        t.votes.max = Array.max(numbers);
        $.each(t.circlesObject, function(index, value) {
            value.id = index;
            $circlesContainer.prepend(t.renderCircle(value));
            t.setSize(index);
        });
          t.setPositions();
    }
}

class CirclesMobile {

  constructor() {
    let t = this;
        this.voted = [];
        this.isVoted = false;
        t.votes = {
            min: 99999,
            max: 0
        };
    var notVoted = [];

    t.circlesObject = {};
    $.ajax({
        url: Dic.API_URL + 'getcircles',
        type: 'get',
        dataType: 'json'
    }).done(function(response) {
        t.circlesObject = response;
        Dic.circlesObject = response;
        t.setCircles();
        // if ($.cookie('alreadyVoted')) {
        //     $('.main-block').css('height', '735px');
        //     $('.main-block').removeClass('noscroll');
        //     showStep(2);
        // } else {
        //     showStep(1);
        //     $( "@container__mobile" ).each(function( index, value ) {
        //       notVoted[index] = parseInt($(this).attr('data-circle-id'));
        //     });
        // }
        // $('.main-block').css('height', '735px');
        // $('.main-block').removeClass('noscroll');
        showStep(2);
    }).fail(function(response) {
        console.log(response);
    });

    $('@votes-reset').on('click tap', function() {
      location.reload();
    });
    $('@votes-confirm').on('click tap', function() {
        t.confirm();
        $('.main-block').css('height', '715px');
        return false;
    });

    $(document).on('click tap', '@skip', function(e) {

      var $this = $(this);
      $this.addClass('clicked');

      setTimeout(function(){

        $this.removeClass('clicked'); 
        var $item = $this.closest('@container__mobile');
        var number = parseInt($item.attr('data-circle-id'));
        $("@container__mobile[data-circle-id='" + number + "'] .text").hide();

        var index = notVoted.indexOf(number);

        if ( index < (notVoted.length - 1)) {
          var newIndex =  index + 1;
        } else {
          var newIndex =  0;
        }

        $("@container__mobile[data-circle-id='" + notVoted[newIndex] + "'] .circle-bg").hide();
        $("@container__mobile[data-circle-id='" + notVoted[newIndex] + "']").show();

        $("@container__mobile[data-circle-id='" + notVoted[newIndex] + "'] .circle-bg").slideDown( function() {
          $("@container__mobile[data-circle-id='" + number + "'] .text").show();
          $("@container__mobile[data-circle-id='" + notVoted[index] + "']").hide();
        });
        
      }, 200);



    });

    $(document).on('click tap', '@vote', function(e) {

      var $this = $(this);

      $this.addClass('clicked');

      setTimeout(function(){

        $this.removeClass('clicked');

        if (t.voted.length < 3) {

          var $item = $this.closest('@container__mobile');
          t.setVote($item.attr('data-circle-id'));

          var number = parseInt($item.attr('data-circle-id'));
          $("@container__mobile[data-circle-id='" + number + "'] .text").hide();

          var index =  notVoted.indexOf(number);
          var prevNumber = number;

          notVoted = notVoted.filter(function(item) { return item !== notVoted[index]; });

          if ( index < notVoted.length) {
            var newIndex =  index;
          } else {
            var newIndex =  0;
          }

          $("@container__mobile[data-circle-id='" + notVoted[newIndex] + "'] .circle-bg").hide();
          $("@container__mobile[data-circle-id='" + notVoted[newIndex] + "']").show();

          $("@container__mobile[data-circle-id='" + notVoted[newIndex] + "'] .circle-bg").slideDown( function() {
            $("@container__mobile[data-circle-id='" + prevNumber + "']").hide();
          });


          if (t.voted.length >= 3) {
            $('@trip-area').show();
            $('@container__mobile').hide();
            if (t.voted.length >= 3) {
                  setTimeout(function() {
                      t.setStatus('end');
                  }, 200);
              }
            // $('.index-title .mobile').hide();
            $('.circles-container').hide();
          }
        }
      }, 200);


    });
  }
  confirm() {
      let t = this;
      $.ajax({
          'type': 'get',
          'url': Dic.API_URL + 'sendvotes',
          'data': 'votes=' + t.voted.join(',')
      }).done(function() {
          showStep(2);
          $.cookie('alreadyVoted', true, {
              path: '/'
          });
      }).fail(function(response) {
          console.log(response);
      });
  }
  setVote(id) {
      let t = this;
      var circle = t.circlesObject[id];
      var $circle = $('@circle[data-circle-id="' + id + '"]');
      t.setStatus('chosen');
      t.voted.push(id);
  }
  setStatus(status) {
    console.log(status)
      let t = this;
      this.status = status;
      $('[data-step="' + status + '"]').addClass('isActive')
          .siblings().removeClass('isActive');
  }
  renderCircle(circle) {
    let t = this;
    let imageStyleStr = 'background-image: url(' + circle.image + ');';
    let number = parseInt(circle.id) + 1;

    return '<div class="circle-container__mobile" role="container__mobile" data-circle-id="' + circle.id + '"">\
        <div class="circle-bg" style="' + imageStyleStr + '"></div>\
        <div role="circle-inner" class="inner">\
          <span class="number"> <span>' + number + '</span><span>20</span></span>\
          <span class="text" role="circle-text">' + circle.name + '</span>\
        </div>\
        <div class="wrapper">\
          <div class="controls">\
            <div class="skip x-skip" role="skip">\
              <img src="images/skip.png">\
            </div>\
            <div class="vote x-vote" role="vote">\
              <img src="images/vote.png">\
            </div>\
          </div>\
        </div>\
    </div>'
  }
  setCircles() {
      let t = this;
      let $circlesContainer = $('@circles-container');
      let numbers = [];
      $.each(t.circlesObject, function(index, value) {
          numbers.push(value.votes);
      });
      t.votes.min = Array.min(numbers);
      t.votes.max = Array.max(numbers);
      $.each(t.circlesObject, function(index, value) {
          value.id = index;
          $circlesContainer.append(t.renderCircle(value));

      });
      $('@container__mobile').hide();
      $("@container__mobile[data-circle-id='0']").show();
  }
}

class Result {
    constructor() {
        let t = this;
        if (!$('@result-canvas').length) return;
        this.canvas = $('@result-canvas')[0];
        this.context = this.canvas.getContext('2d');
        this.radius = 210;
        t.drawPart({
            width: 50,
            start: 1.5 * Math.PI,
            end: 1.9 * Math.PI
        });
        t.drawPart({
            width: 100,
            start: 1.9 * Math.PI,
            end: 2.5 * Math.PI
        });
        t.drawPart({
            width: 1,
            start: 2.5 * Math.PI,
            end: 3 * Math.PI
        });
        t.drawPart({
            width: 25,
            start: 3 * Math.PI,
            end: 3.5 * Math.PI
        });
    }
    drawPart(args) {
        let t = this;
        let cvs = t.canvas;
        let ctx = t.context;
        ctx.beginPath();
        ctx.arc(cvs.width / 2, cvs.height / 2, t.radius + args.width / 2, args.start, args.end, false);
        ctx.lineWidth = args.width;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}

function getScrollPercentage() {
      var scrollTop = $(window).scrollTop();
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollPercent = (scrollTop) / (docHeight - winHeight);
      var scrollPercentRounded = Math.round(scrollPercent * 100);

      return scrollPercentRounded;
  }


function setPic() {

  if ($('.article-intro').length) {
    var temp = $('.article-intro').css('background-image');

    if ($( window ).width() > 1479) {
      if (temp.indexOf('cover2600') < 0 ) {
        temp = temp.replace("cover", "cover2600");
        $('[data-parallax]').css('background-image',temp);
      }
    } else {
      if (temp.indexOf('cover2600') >= 0 ) {
        temp = temp.replace("cover2600", "cover");
        $('[data-parallax]').css('background-image',temp);
      }
    }
  }

}

function showHeader() {
  var $fixedMenu = $('header.fixed'),
      $staticMenu = $('header.static'),
      menuShowed = false;

  $(window).on('scroll', function () {
      if (getScrollPercentage() > 2) {
        $fixedMenu.addClass('opened');
        $staticMenu.hide();
      } else {
        $fixedMenu.removeClass('opened');
        $staticMenu.show();
      }
  }).trigger('scroll');
}

if ($(window).width() > 1024) {
  var result = new Result();
  var circles = new Circles();
  var teaser = new Teaser();
} else {
  var teaser = new Teaser();
  var mobCircles = new CirclesMobile();
  $(document).on('click', '@teaser-close', function(e) {
    var result = new Result();
  });
}


$(function() {

  if ($('body').hasClass('article-body')) {

      new WOW({
          offset: window.innerWidth / 6
      }).init();

      $('[data-slick]').slick();

      // $('[data-parallax]').mousemove(function(e) {
      //     var amountMovedX = (e.pageX * -1 / 30);
      //     var amountMovedY = (e.pageY * -1 / 30);

      //     $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
      // });

      setPic();

      $( window ).resize(function() {
        setPic();
      });

      showHeader();

      $('[data-scroll-indicator]').each(function() {
          var $that = $(this);

          $(window).on('scroll', function() {
              $that.css('width', getScrollPercentage() + '%');
          });

      });

      $('[data-share-twisted-button]').each(function() {
          var $button = $(this);
          var $content = $('[data-share-twisted]');
          var $area = $('[data-inner-nav]')

          

          if ($( window ).width() <= 1000) {
            $button.on('click tap', function() {
              $button.toggleClass('is-active');
              $content.toggleClass('is-open');
            });
          } else {
              $button.on('mouseover', function() {
                $button.toggleClass('is-active');
                $content.toggleClass('is-open');
            });

            $area.on('mouseleave', function() {
                $button.removeClass('is-active');
                $content.removeClass('is-open');
            });
          }

      });
  }
});


$(function() {
    let $popup = $('@about-popup');
    let $overlay = $('@about-overlay');
    $('@about-open').on('click', function() {
        open();
        return false;
    });
    $('@about-close').on('click', function() {
        close();
        return false;
    });
    $overlay.on('click', function(e) {
        close();
    });
    $popup.on('click', function(e) {
        e.stopPropagation();
    });

    function close() {
        $overlay.fadeOut();
        $('html').removeClass('isLocked');
    }

    function open() {
        $overlay.fadeIn();
        $('html').addClass('isLocked');
    }
});


$(function() {
    $('a.subscription__circle__close').click(function(e) {
        e.preventDefault();
        $('.subscription__circle').hide();
    });
    $('a.canvas__results__link').click(function() {
        $('div.subscription__circle').show();
    });
    $('@subscription-form').on('submit', function(e) {
        e.preventDefault();
        var email = $('.subscription__circle__input').val();
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (re.test(email)) {
            $('@subscription-form [type="submit"]').attr('disabled', 'disabled');
            $.ajax({
                url: Dic.API_URL + 'subscription',
                data: {
                    email: email
                },
                dataType: 'json',
                type: 'get'
            }).done(function() {
                $('.subscription__circle__close, .subscription__circle__title, .subscription__circle__form, .subscription__circle__info').hide();
                $('.subscription__circle__message').show();
                ga("send", "event", "main page", "success subscribe");
                setTimeout(function() {
                    $('.subscription__circle').hide();
                    $('.subscription__circle__message').hide();
                    $('.subscription__circle__close, .subscription__circle__title, .subscription__circle__form, .subscription__circle__info').show();
                    $('.subscription__circle__input').css('color', '#8d8d8d').val('');
                }, 2000);
            }).fail(function(response) {
                //console.log(response);
            });
        } else {
            $('.subscription__circle__input').css('color', '#a31f18');
        }
        return false;
    });
});

$(function() {
    var $tooltip = $('@tooltip');
    var $tooltipText = $('@tooltip-text');
    $('[data-tooltip]')
        .on('mouseenter', function() {
            var text = $(this).attr('data-tooltip');
            var position = {
                    left: $(this).offset().left + $(this).outerWidth() / 2,
                    top: $(this).offset().top + $(this).outerHeight() * 3
                }
                //console.log(position);
            $tooltip.show().css(position);
            $tooltipText.html(text);
        })
        .on('mouseleave', function() {
            $tooltip.hide();
        });
});

$(function() {
    var timeStamp = new Date().getTime();
    var linkHeader = "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=18498509&PluID=0&ord=[timestamp]";
    var linkDrive = "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=18498550&PluID=0&ord=[timestamp]";
    var linkMore = "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=18498513&PluID=0&ord=[timestamp]";
    $('.js-nissan').on('click', function() {
        $('body').append('<img src =' + linkHeader + ' height="1" width="1">');
    });
    $('.js-testdrive').on('click', function() {
        $('body').append('<img src =' + linkDrive + ' height="1" width="1">');
    });
    $('.js-more').on('click', function() {
        $('body').append('<img src =' + linkMore + ' height="1" width="1">');
    });
});

var verOff;
if(window.innerWidth <= 1440){
  verOff = 0;
}else if
(window.innerWidth >= 1440 && window.innerWidth <= 1800){
  verOff = -500;
}else if
(window.innerWidth > 1800){
  verOff = -1100;
}

$.stellar({
    horizontalScrolling: false,
    verticalOffset: verOff,
});

$(function() {
  var wTop, objPos;

  $(document).scroll(function (event) {
    wTop = $(window).scrollTop() + window.innerHeight;
    carScroll ();
  });

  $(window).resize(function (event){
    wTop = window.innerHeight;
    carScroll ();
  });



  function carScroll (){
    if ($(window).width() >= 1024) {
      objPos = $(".sharing").offset().top;
      if(wTop > objPos){
        $(".car-link").css({
          "position": "absolute",
          "bottom": "-30px"
        });
      }else if(wTop <640){
        $(".car-link").css({
          "position": "absolute",
          "bottom": "110px"
        });
      }else{
        $(".car-link").css({
          "position": "fixed",
          "bottom": "0px"
        });
      }
   }else{
     $(".car-link").css({
       "position": "absolute",
       "bottom": "-70px"
     });
   }
  }

});



$(function() {
    $('@teaser-close').on('click', function() {
        ga("send", "event", "main page", "clicked take part");
    });
    $('.car-link').on('click', function() {
        ga("send", "event", "main page", "clicked product car");
    });
    $('.js-more').on('click', function() {
        ga("send", "event", "promo page", "clicked more button");
    });
    $('.article-anons').on('click', function() {
        ga("send", "event", "promo page", "clicked take part");
    });
    $('.js-testdrive').on('click', function() {
        ga("send", "event", "promo page", "clicked test drive");
    });
    $('.js-nissan').on('click', function() {
        var link = $(this).attr('href');
        ga("send", "event", "brand button", "clicked header", link);
    });
    $('.ga-share').on('click', function() {
        var name = $(this).attr('data-social');
        ga("send", "event", "share", "clicked share button", name);
    });

});


var player;
var subtitles = [
  {
    start: 0,
    end: 1000,
    text: "О каком приключении вы мечтаете прямо сейчас?"
  },
  {
    start: 0,
    end: 1000,
    text: "Голосуйте за идеальное мужское приключение"
  }
];

window.onYouTubeIframeAPIReady = function(){
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'j6fXrgR3gZw',
    playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'rel': 0 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

window.onPlayerReady = function(event){
  event.target.playVideo();
}

window.onPlayerStateChange = function(event) {
    if(event.data === 0) {
      closeVideo(true);
    }
    if (event.data == YT.PlayerState.PLAYING) {

      var videotime = 0;
      var timeupdater = null;

      function updateTime() {
        var oldTime = videotime;
        if(player && player.getCurrentTime) {
          videotime = player.getCurrentTime();
        }
        if(videotime !== oldTime) {
          onProgress(videotime);
        }
      }

      function onProgress(currentTime) {
        if(currentTime > 23) {
          $('.main-video__sub1').hide();
        }
        if(currentTime > 24) {
          console.log("the video reached 23 seconds!");
          $('.main-video__sub2').show();
          clearInterval(timeupdater);
        }
      }

      $('.main-video__sub1').show();
      timeupdater = setInterval(updateTime, 100);

    }
}

window.onPlayerError = function() {
    $( '#player' ).hide();
    $( '.main-video' ).css('background-image','url("./images/video.png")');
}

function closeVideo(ended) {

  $( ".main-video__control" ).hide();

  if (ended) {
    $( "#player" ).hide();
    player.stopVideo();
  }
  $( ".main-video" ).animate({
    opacity: 0
  }, 2000, function() {
    $('.main-video').hide();
    player.stopVideo();
  });

}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

$(function() {

  if ($('#player') && ($( window ).width() > 800) && (false)) {

    if ($.cookie('TeaserClosed') || $.cookie('alreadyVoted')) {
      $( ".main-video" ).hide();
      $( ".main-video__control" ).hide();
    } else {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      $('#skip').click(function(){
        closeVideo(false);
      });

      $('#mute').click(function(){
        var $this = $(this);
        var text = $('span', $this).text();

        if (player.isMuted()) {
          player.unMute();
          text = text.replace("ВКЛ", "ВЫКЛ");
          $('span', $this).text(text);
          $('span', $this).removeClass('unmute');
        } else {
          player.mute();
          text = text.replace("ВЫКЛ", "ВКЛ");
          $('span', $this).text(text);
          $('span', $this).addClass('unmute');
        }
      });
    }
  }

})
