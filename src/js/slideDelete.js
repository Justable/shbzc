(function($){
    var $html = $('html'),
        $dialog = $(".ui-dialog").eq(0);
    var baseFontSize = $html.css('font-size').replace('px','');


    var $delete = $('.scroll-left .delete'),
        $deleteItem = null;

    $delete.on('click',function (e) {
        var $this = $(this);
        $deleteItem = $this.parents('.ui-list-address');
        $dialog.addClass('show');
    });

    $('.ui-dialog-close').on('click',function (e) {
        $dialog.removeClass('show');
    });

    $('.ui-dialog-ft:first-child').on('click',function (e) {
        $dialog.removeClass('show');
    });

    $('.ui-dialog-ft:last-child').on('click',function (e) {
        $deleteItem && $deleteItem.remove();
        $dialog.removeClass('show');
    });

    // 获取所有行，对每一行设置监听
    var $lines = $('.scroll-left');
    var $addrLines = $('.scroll-left .address');
    var lastXForMobile;

    // 用于记录被按下的对象
    var pressedObj;  // 当前左滑的对象
    var lastLeftObj; // 上一个左滑的对象
    var $pressedAddr; //当前左滑的对象中的address

    // 用于记录按下的点
    var start;
    var threshold = 3.5*baseFontSize;
    $addrLines.on('touchstart',function (e) {
        if (lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
            $(lastLeftObj).css('left', 0); // 右滑
            lastLeftObj = null; // 清空上一个左滑的对象
        }
    });
    $lines.on('touchstart',function (e) {
        pressedObj = this; // 记录被按下的对象
        $pressedAddr = $(pressedObj).find('.address');
        lastXForMobile = e.changedTouches[0].pageX;

        // 记录开始按下时的点
        var touches = e.touches[0];
        start = {
            x: touches.pageX, // 横坐标
            y: touches.pageY  // 纵坐标
        };
    });
    $lines.on('touchmove',function (e) {
        $(pressedObj).removeClass('slide');
        $pressedAddr.removeClass('slide');
        // 计算划动过程中x和y的变化量
        var touches = e.touches[0];
        var delta = {
            x: touches.pageX - start.x,
            y: touches.pageY - start.y
        };

        // 横向位移大于纵向位移，阻止纵向滚动
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            e.preventDefault();
        }
        var diffX = e.changedTouches[0].pageX - lastXForMobile;
        var diffXAddress = diffX + threshold;
        diffX = diffX<-threshold?-threshold:diffX;
        diffX = diffX>0?0:diffX;
        if(lastLeftObj != pressedObj){
            $(pressedObj).css('left', diffX); // 左滑
        }
        if(diffXAddress < 0){ //划过缓冲
            var thres = -threshold/2;
            diffXAddress = diffXAddress<thres?thres:diffXAddress;
            $pressedAddr.css('left',diffXAddress);
        }
    });
    $lines.on('touchend',function (e) {
        $(pressedObj).addClass('slide');
        $pressedAddr.addClass('slide');
        var diffX = e.changedTouches[0].pageX - lastXForMobile;
        if(diffX < 0){
            if (diffX < -threshold/2) {
                $(pressedObj).css('left', -threshold); // 左滑\
                lastLeftObj = pressedObj; // 记录上一个左滑的对象
            } else {
                $(pressedObj).css('left', 0);
            }
        }
        $pressedAddr.css('left',0);
    });
})(window.Zepto);