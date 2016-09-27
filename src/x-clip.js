/**
 * Created by pk111 on 2016/9/27.
 */
(function () {
    var xcilp = function () {
        var $container = $(".clip-imgshow");
        var event_state = {};
        var returnXplesObject={
            init:function (image) {
                var self = this;
                console.log(image);
                self.createImgorigin(image);

                self.eventBind();
            },
            createImgorigin:function (image) {
                $(".clip-imgshow img").attr("src",image.src);
            },
            eventBind:function () {
                var self = this;
                $(".clip-imgshow").on("mousedown touchstart","img",function (e) {
                    self.startMoving(e);
                    self.saveEventState(e);
                })
            },
            startMoving:function (e) {
                var self = this;
                e.preventDefault();
                e.stopPropagation();
                // saveEventState(e);
                $(document).on('mousemove touchmove', function (e) {
                    self.moving(e);
                });
                $(document).on('mouseup touchend', function (e) {
                    self.endMoving(e);
                });
            },
            endMoving:function(e) {
                e.preventDefault();
                $(document).off('mouseup touchend');
                $(document).off('mousemove touchmove');
            },
            moving:function (e) {
                var mouse = {},
                    touches,
                    self = this;
                e.preventDefault();
                e.stopPropagation();

                touches = e.originalEvent.touches;

                mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
                mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
                $container.offset({
                    'left': mouse.x - (event_state.mouse_x - event_state.container_left),
                    'top': mouse.y - (event_state.mouse_y - event_state.container_top)
                });
                // Watch for pinch zoom gesture while moving
                if (event_state.touches && event_state.touches.length > 1 && touches.length > 1) {
                    var width = event_state.container_width,
                        height = event_state.container_height;
                    var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
                    a = a * a;
                    var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
                    b = b * b;
                    var dist1 = Math.sqrt(a + b);

                    a = e.originalEvent.touches[0].clientX - touches[1].clientX;
                    a = a * a;
                    b = e.originalEvent.touches[0].clientY - touches[1].clientY;
                    b = b * b;
                    var dist2 = Math.sqrt(a + b);

                    var ratio = dist2 / dist1;

                    width = width * ratio;
                    height = height * ratio;
                    // To improve performance you might limit how often resizeImage() is called
                    resizeImage(width, height);
                }
            },
            saveEventState : function(e) {
                // Save the initial event details and container state
                event_state.container_width = $container.width();//宽
                event_state.container_height = $container.height();//高
                event_state.container_left = $container.offset().left;//左边长
                event_state.container_top = $container.offset().top;//顶边长
                event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
                event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

                // This is a fix for mobile safari修复移动端
                // For some reason it does not allow a direct copy of the touches property
                if (typeof e.originalEvent.touches !== 'undefined') {
                    event_state.touches = [];
                    $.each(e.originalEvent.touches, function(i, ob) {
                        event_state.touches[i] = {};
                        event_state.touches[i].clientX = 0 + ob.clientX;
                        event_state.touches[i].clientY = 0 + ob.clientY;
                    });
                }
                event_state.evnt = e;
            }
        }

        return returnXplesObject;
    }

    //模拟传入图片
    var virtualImg = new Image();
    // virtualImg.src = "http://static.hpbanking.com/xg/uploads/esn/product/large/ba45c8f60456a672e003a875e469d0eb.jpg";
    // virtualImg.src = "./testimg.jpg";
    virtualImg.src = "http://static.hpbanking.com/xg/uploads/rent/bshop/06286e4f089a0c0302f036c13e3115ee.jpg"
    var Xclip = xcilp();
    Xclip.init(virtualImg);
}.call(this));