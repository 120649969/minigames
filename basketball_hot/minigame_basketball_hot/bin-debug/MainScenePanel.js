var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var MainScenePanel = (function (_super) {
    __extends(MainScenePanel, _super);
    function MainScenePanel() {
        var _this = _super.call(this) || this;
        _this._gravity = 1;
        _this._basketball_speed_x = 0.0;
        _this._baskball_speed_y = 0.0;
        _this._touchdown_impluse = new egret.Point(-5.0, -15.0);
        _this._is_game_end = false;
        _this._current_impluse = new egret.Point();
        _this._isOnFloor = false;
        _this._floorRestitution = 0.7; //地面反弹系数
        _this._ballCircleRadius = 0;
        _this._isStart = false;
        _this._isStop = false;
        _this._current_times = 0;
        _this._currnet_index = 0;
        _this.skinName = "MainScene";
        _this.initUI();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MainScenePanel.prototype.onAddToStage = function (event) {
        this._isStart = true;
        this._last_time = egret.getTimer();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this._ballCircleRadius = this.m_basket_ball.width * this.m_basket_ball.scaleX / 2 - 5;
        this.m_basket_ball.x = 360;
        this.m_basket_ball.y = 770;
        this.m_btn_reset.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            this.m_basket_ball.x = 360;
            this.m_basket_ball.y = 770;
            this._basketball_speed_x = 0;
            this._basketball_speed_y = 0;
            this._isOnFloor = false;
            this._isStop = false;
            event.stopPropagation();
        }.bind(this), this);
    };
    MainScenePanel.prototype.initUI = function () {
    };
    MainScenePanel.prototype._updateBallCurrentState = function () {
        var delta_speed_x = this._current_impluse.x;
        var delta_speed_y = this._gravity + this._current_impluse.y;
        this._basketball_speed_x += delta_speed_x;
        this._baskball_speed_y += delta_speed_y;
        this._baskball_speed_y = Math.max(this._baskball_speed_y, -20);
        this._basketball_speed_x = Math.max(this._basketball_speed_x, -20);
        this._basketball_speed_x = Math.min(this._basketball_speed_x, 20);
        this._current_impluse.x = 0;
        this._current_impluse.y = 0;
        var total_speed = Math.sqrt(Math.pow(this._basketball_speed_x, 2) + Math.pow(this._baskball_speed_y, 2));
        var step_speed = 1;
        var times = Math.ceil(total_speed / step_speed);
        var curr_speend_x = this._basketball_speed_x / times;
        var curr_speend_y = this._baskball_speed_y / times;
        this._current_times = times;
        for (var step_idx = 1; step_idx <= times; step_idx++) {
            this._currnet_index = step_idx;
            if (step_idx == times) {
                curr_speend_x = this._basketball_speed_x - this._basketball_speed_x / times * (times - 1);
                curr_speend_y = this._baskball_speed_y - this._baskball_speed_y / times * (times - 1);
            }
            this.m_basket_ball.x += curr_speend_x;
            this.m_basket_ball.y += curr_speend_y;
            this.m_basket_ball.x = Math.max(this.m_basket_ball.x, 0);
            this.m_basket_ball.x = Math.min(this.m_basket_ball.x, this.stage.stageWidth);
            this.m_basket_ball.y = Math.min(this.m_basket_ball.y, this.m_floor.y - this.m_basket_ball.height * this.m_basket_ball.scaleY / 2.0);
            if (this.checkHitFloor()) {
                return;
            }
            if (this.checkHitBasketCircle()) {
                return;
            }
            if (this.checkHitBoard()) {
                return;
            }
        }
        this.checkHitNet();
    };
    MainScenePanel.prototype.onEnterFrame = function (event) {
        if (this._isStop) {
            return;
        }
        var current_time = egret.getTimer();
        var offset_time = current_time - this._last_time;
        if (offset_time <= 0) {
            return;
        }
        this._last_time = current_time;
        this._updateBallCurrentState();
    };
    MainScenePanel.prototype.onTouchBegin = function (event) {
        if (this.m_basket_ball.y <= this.m_top.y) {
            return;
        }
        if (this._baskball_speed_y > 0) {
            this._baskball_speed_y = 0;
        }
        this._current_impluse.x = this._touchdown_impluse.x;
        this._current_impluse.y = this._touchdown_impluse.y;
        //下面是供测试使用的代码
        // let localX = event.stageX;
        // let localY = event.stageY;
        // this.m_basket_ball.x = localX;
        // this.m_basket_ball.y = localY;
        // console.log(localX, localY)
    };
    MainScenePanel.prototype.checkHitFloor = function () {
        var curr_y = this.m_basket_ball.y;
        if (curr_y >= this.m_floor.y - this.m_basket_ball.height * this.m_basket_ball.scaleY / 2.0) {
            if (this._isOnFloor) {
                return true;
            }
            //处理反弹
            var new_speed_y = this._baskball_speed_y * this._floorRestitution * -1;
            if (Math.abs(new_speed_y) <= 0.3) {
                new_speed_y = 0;
            }
            this._baskball_speed_y = new_speed_y;
            return true;
        }
        return false;
    };
    MainScenePanel.prototype.checkHitBoard = function () {
        var temp_global_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);
        var localInContainerPoint = new egret.Point();
        this.m_basket_container.globalToLocal(temp_global_point.x, temp_global_point.y, localInContainerPoint);
        if (localInContainerPoint.y <= this.m_board_scope.y) {
            if (localInContainerPoint.y - this.m_board_scope.y <= this._ballCircleRadius && (localInContainerPoint.x <= this.m_board_scope.x + this._ballCircleRadius && localInContainerPoint.x >= this.m_board_scope.x - this._ballCircleRadius)) {
                var topRestitution = 0.3;
                this._baskball_speed_y *= -1 * topRestitution;
                var board_top_point = new egret.Point();
                this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y, board_top_point);
                this.m_basket_ball.y = Math.min(this.m_basket_ball.y, board_top_point.y - this._ballCircleRadius);
                console.log("########top####");
                return true;
            }
        }
        else if (localInContainerPoint.y >= this.m_board_scope.y + this.m_board_scope.height) {
            if (localInContainerPoint.y - (this.m_board_scope.y + this.m_board_scope.height) <= this._ballCircleRadius && (localInContainerPoint.x <= this.m_board_scope.x + this._ballCircleRadius && localInContainerPoint.x >= this.m_board_scope.x - this._ballCircleRadius)) {
                var downRestitution = 0.3;
                this._baskball_speed_y *= -1 * downRestitution;
                var board_down_point = new egret.Point();
                this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y + this.m_board_scope.height, board_down_point);
                this.m_basket_ball.y = Math.max(this.m_basket_ball.y, board_down_point.y + this._ballCircleRadius);
                console.log("########down####");
                return true;
            }
        }
        else {
            if (localInContainerPoint.x > this.m_board_scope.x) {
                if (localInContainerPoint.x <= this.m_board_scope.x + this.m_board_scope.width + this._ballCircleRadius) {
                    this._basketball_speed_x = 0.8 * this._basketball_speed_x / Math.abs(this._basketball_speed_x) * -1;
                    var right_top_point = new egret.Point();
                    this.m_basket_container.localToGlobal(this.m_board_scope.x + this.m_board_scope.width, this.m_board_scope.y, right_top_point);
                    var temp_temp_point = new egret.Point();
                    var localInBallContainer = this.m_basket_ball.parent.globalToLocal(right_top_point.x, right_top_point.y, temp_temp_point);
                    this.m_basket_ball.x = temp_temp_point.x + this._ballCircleRadius;
                    return true;
                }
            }
            else {
                if (localInContainerPoint.x <= this.m_board_scope.x + this.m_basket_ball.width * this.m_basket_ball.scaleX) {
                    var left_top_point = new egret.Point();
                    this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y, left_top_point);
                    this.m_basket_ball.x = Math.min(this.m_basket_ball.x, left_top_point.x - this._ballCircleRadius);
                    console.log("########left####");
                    return true;
                }
            }
        }
        return false;
    };
    //和篮网的碰撞
    MainScenePanel.prototype.checkHitNet = function () {
        var temp_global_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);
        var localPoint = new egret.Point();
        this.m_basket_container.globalToLocal(temp_global_point.x, temp_global_point.y, localPoint);
        if (localPoint.x <= this.m_net_scope.x + this.m_net_scope.width + this._ballCircleRadius && localPoint.x >= this.m_net_scope.x - this._ballCircleRadius) {
            if (localPoint.y <= this.m_net_scope.y + this.m_net_scope.height + this._ballCircleRadius && localPoint.y >= this.m_net_scope.y + this.m_net_scope.height / 2) {
                console.log("#####hit net#####");
            }
        }
    };
    //和篮圈的碰撞
    MainScenePanel.prototype.checkHitBasketCircle = function () {
        var temp_global_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);
        var bigCircleLeftTopPoint = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_big_basketcircle_scope.x, this.m_big_basketcircle_scope.y, bigCircleLeftTopPoint);
        var bigCircleRightDownPoint = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_big_basketcircle_scope.x + this.m_big_basketcircle_scope.width, this.m_big_basketcircle_scope.y + this.m_big_basketcircle_scope.height, bigCircleRightDownPoint);
        var condition1 = temp_global_point.x <= bigCircleRightDownPoint.x + this._ballCircleRadius;
        var condition2 = temp_global_point.x >= (bigCircleLeftTopPoint.x + bigCircleRightDownPoint.x) / 2;
        var temp1 = bigCircleLeftTopPoint.x;
        var temp2 = bigCircleRightDownPoint.x;
        var temp3 = temp_global_point.x;
        if (condition1 && condition2) {
            var center_y_1 = (bigCircleLeftTopPoint.y + bigCircleRightDownPoint.y) / 2;
            if (temp_global_point.y < center_y_1 + this._ballCircleRadius && temp_global_point.y > center_y_1 - this._ballCircleRadius) {
                if (temp_global_point.y > center_y_1) {
                    this._basketball_speed_x *= 1;
                    this._baskball_speed_y *= -1;
                }
                else {
                    this._basketball_speed_x *= 1;
                    this._baskball_speed_y *= -1;
                }
                console.log("#####hit circle###########", this._basketball_speed_x, this._baskball_speed_y, this._current_times, this._currnet_index);
                //this._isStop = true;
                return true;
            }
        }
        var smallCircleLeftTopPoint = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_small_basketcircle_scope.x, this.m_small_basketcircle_scope.y, smallCircleLeftTopPoint);
        var smallCircleRightDownPoint = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_small_basketcircle_scope.x + this.m_small_basketcircle_scope.width, this.m_small_basketcircle_scope.y + this.m_small_basketcircle_scope.height, smallCircleRightDownPoint);
        condition1 = temp_global_point.x < smallCircleRightDownPoint.x;
        condition2 = temp_global_point.x > smallCircleLeftTopPoint.x;
        var center_y = (smallCircleLeftTopPoint.y + smallCircleRightDownPoint.y) / 2;
        var condition3 = temp_global_point.y > center_y - this._ballCircleRadius;
        var condition4 = temp_global_point.y < center_y + this._ballCircleRadius;
        if (condition1 && condition2 && condition3 && condition4) {
            if (temp_global_point.x < smallCircleLeftTopPoint.x + this._ballCircleRadius) {
                this._basketball_speed_x = 1 * this._basketball_speed_x / Math.abs(this._basketball_speed_x) * -1;
            }
            else if (temp_global_point.x < smallCircleRightDownPoint.x - this._ballCircleRadius) {
                this._basketball_speed_x = 1 * this._basketball_speed_x / Math.abs(this._basketball_speed_x) * -1;
            }
            else {
                console.log("空心");
            }
            console.log("######进入了内框#######");
            return true;
        }
        return false;
    };
    return MainScenePanel;
}(eui.Component));
__reflect(MainScenePanel.prototype, "MainScenePanel");
//# sourceMappingURL=MainScenePanel.js.map