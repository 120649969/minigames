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
        _this._last_x = 0;
        _this._last_y = 0;
        _this._is_hit_resolve = false;
        _this._is_next_frame_skil_times = false;
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
        this._ballCircleRadius = 25;
        var init_x = this.m_basket_ball.x;
        var init_y = this.m_basket_ball.y;
        var init_speed_x = 0;
        var init_speed_y = 0;
        this._basketball_speed_x = init_speed_x;
        this._baskball_speed_y = init_speed_y;
        this.m_btn_reset.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            this.m_basket_ball.x = init_x;
            this.m_basket_ball.y = init_y;
            this._basketball_speed_x = init_speed_x;
            this._baskball_speed_y = init_speed_y;
            this._isOnFloor = false;
            this._isStop = false;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
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
        var step_speed = 2;
        var times = Math.ceil(total_speed / step_speed);
        if (this._is_next_frame_skil_times) {
            times = 1;
            this._is_next_frame_skil_times = false;
        }
        var curr_speend_x = this._basketball_speed_x / times;
        var curr_speend_y = this._baskball_speed_y / times;
        this._current_times = times;
        for (var step_idx = 1; step_idx <= times; step_idx++) {
            this._currnet_index = step_idx;
            if (step_idx == times) {
                curr_speend_x = this._basketball_speed_x - this._basketball_speed_x / times * (times - 1);
                curr_speend_y = this._baskball_speed_y - this._baskball_speed_y / times * (times - 1);
            }
            this._last_x = this.m_basket_ball.x;
            this._last_y = this.m_basket_ball.y;
            this.m_basket_ball.x += curr_speend_x;
            this.m_basket_ball.y += curr_speend_y;
            this.m_basket_ball.x = Math.max(this.m_basket_ball.x, 0);
            this.m_basket_ball.x = Math.min(this.m_basket_ball.x, this.stage.stageWidth);
            this.m_basket_ball.y = Math.min(this.m_basket_ball.y, this.m_floor.y - this.m_basket_ball.height * this.m_basket_ball.scaleY / 2.0);
            if (this.checkHitFloor()) {
                return;
            }
            if (this.checkHitBasketTopScope() || this.checkHitBasketDownScope() || this.checkHitBoardNew() || this.checkHitBasketLeftScope()) {
                if (this._is_hit_resolve) {
                    // console.log(this.m_basket_ball.x + " toback  " + this.m_basket_ball.y)
                    this.m_basket_ball.x = this._last_x;
                    this.m_basket_ball.y = this._last_y;
                    this._is_hit_resolve = false;
                }
                // console.log(this.m_basket_ball.x + " to1  " + this.m_basket_ball.y)
                return;
            }
            // console.log(this.m_basket_ball.x + " to2  " + this.m_basket_ball.y)
            // if(this.checkHitBasketCircle())
            // {
            // 	return
            // }
        }
        // this.checkHitNet();
    };
    MainScenePanel.prototype.checkHitBasketLeftScope = function () {
        var global_ball_center_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);
        var left_scope_left_top_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_left_scope.x, this.m_left_scope.y, left_scope_left_top_point);
        var left_scope_right_down_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_left_scope.x + this.m_left_scope.width, this.m_left_scope.y + this.m_left_scope.height, left_scope_right_down_point);
        if (global_ball_center_point.y > left_scope_right_down_point.y + this._ballCircleRadius || global_ball_center_point.y < left_scope_left_top_point.y - this._ballCircleRadius) {
            return false;
        }
        if (global_ball_center_point.x < left_scope_left_top_point.x || global_ball_center_point.x > left_scope_right_down_point.x + this._ballCircleRadius) {
            return false;
        }
        if (global_ball_center_point.y < left_scope_left_top_point.y) {
            console.assert(this._basketball_speed_x < 0, "left scope  top ball speed_x < 0");
            if (this._basketball_speed_x == 0) {
                this._basketball_speed_x = 5;
            }
            else {
                this._basketball_speed_x *= -1;
            }
            this._baskball_speed_y *= -1;
            this._is_hit_resolve = true;
            return true;
        }
        if (global_ball_center_point.y > left_scope_right_down_point.y) {
            if (this._basketball_speed_x == 0) {
                this._baskball_speed_y *= 0.5;
                this._basketball_speed_x = 5;
            }
            else {
                this._basketball_speed_x *= -3;
                this._baskball_speed_y *= 0.5;
            }
            this._is_hit_resolve = true;
            return true;
        }
        this._basketball_speed_x *= -1;
        this._baskball_speed_y *= 0.5;
        this._is_hit_resolve = true;
        return false;
    };
    MainScenePanel.prototype.checkHitBasketDownScope = function () {
        var global_ball_center_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);
        var right_scope_left_top_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_right_scope.x, this.m_right_scope.y, right_scope_left_top_point);
        var right_scope_right_down_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_right_scope.x + this.m_right_scope.width, this.m_right_scope.y + this.m_right_scope.height, right_scope_right_down_point);
        if (global_ball_center_point.y > right_scope_right_down_point.y) {
            //下方，框的底部，只有圆的上方才能和顶部碰撞，圆的下方就算和顶部碰撞了，也视作为左右两侧的碰撞
            //去除x没在范围的情况
            if (global_ball_center_point.x > right_scope_right_down_point.x + this._ballCircleRadius) {
                return false;
            }
            else if (global_ball_center_point.x < right_scope_left_top_point.x - this._ballCircleRadius) {
                return false;
            }
            //去除y没在范围的情况
            var delta_y = global_ball_center_point.y - right_scope_right_down_point.y;
            if (delta_y > this._ballCircleRadius) {
                return false;
            }
            else {
                //这里去没有相交的情况
                //去除y在范围，x在范围 但是不符合矩形和圆相交的情况
                var top_line_cirle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(delta_y, 2));
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (global_ball_center_point.x - right_scope_right_down_point.x > top_line_cirle_width) {
                        return false;
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (right_scope_left_top_point.x - global_ball_center_point.x > top_line_cirle_width) {
                        return false;
                    }
                }
            }
            if (delta_y > this._ballCircleRadius / 2) {
                this._is_hit_resolve = true;
                //此时需要根据碰撞的具体位置来判断
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (this._basketball_speed_x < 0) {
                        if (this._baskball_speed_y > 0) {
                            return false;
                        }
                        this._baskball_speed_y *= -1;
                    }
                    else {
                        this._baskball_speed_y *= -1;
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (this._basketball_speed_x < 0) {
                        this._baskball_speed_y *= -1;
                    }
                    else {
                        this._baskball_speed_y = -5;
                        // this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = -10; //底部上升，反弹到另外一方
                    }
                    // if(this._basketball_speed_x < 0){ //从右往左运动
                    // 	this._baskball_speed_y  *= -1
                    // } else { //从左向右的运动，这个时候需要给球加一个向左的速度
                    // 	this._baskball_speed_y *= -1;
                    // }
                }
                else if (global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) {
                    this._baskball_speed_y *= -1;
                }
                else {
                    this._is_hit_resolve = false;
                    return false;
                }
                return true;
            }
            else {
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (Math.abs(this._basketball_speed_x) < 3) {
                        this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = 5;
                    }
                    else {
                        if (this._basketball_speed_x < 0) {
                            this._basketball_speed_x *= -1;
                            this._baskball_speed_y *= -0.7;
                        }
                        else {
                            this._baskball_speed_y = 0;
                            // this._baskball_speed_y *= -0.7;
                            this._basketball_speed_x *= -2; //底部上升，反弹到另外一方
                        }
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (Math.abs(this._basketball_speed_x) < 3) {
                        this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = -5;
                    }
                    else {
                        if (this._basketball_speed_x > 0) {
                            this._basketball_speed_x *= -3;
                            this._baskball_speed_y = 0;
                        }
                        else {
                            this._baskball_speed_y *= -0.7;
                        }
                    }
                }
                else {
                    console.error("速度过快了");
                }
                this._is_hit_resolve = true;
                return true;
            }
        }
        return false;
    };
    MainScenePanel.prototype.checkHitBasketTopScope = function () {
        var global_ball_center_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);
        var right_scope_left_top_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_right_scope.x, this.m_right_scope.y, right_scope_left_top_point);
        var right_scope_right_down_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_right_scope.x + this.m_right_scope.width, this.m_right_scope.y + this.m_right_scope.height, right_scope_right_down_point);
        if (global_ball_center_point.y < right_scope_left_top_point.y) {
            //上方，框的顶部，只有圆的下方才能和顶部碰撞，圆的上方就算和顶部碰撞了，也视作为左右两侧的碰撞
            //去除x没在范围的情况
            if (global_ball_center_point.x > right_scope_right_down_point.x + this._ballCircleRadius) {
                return false;
            }
            else if (global_ball_center_point.x < right_scope_left_top_point.x - this._ballCircleRadius) {
                return false;
            }
            //去除y没在范围的情况
            var delta_y = right_scope_left_top_point.y - global_ball_center_point.y;
            if (delta_y > this._ballCircleRadius) {
                return false;
            }
            else {
                //这里去没有相交的情况
                //去除y在范围，x在范围 但是不符合矩形和圆相交的情况
                var top_line_cirle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(delta_y, 2));
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (global_ball_center_point.x - right_scope_right_down_point.x > top_line_cirle_width) {
                        return false;
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (right_scope_left_top_point.x - global_ball_center_point.x > top_line_cirle_width) {
                        return false;
                    }
                }
            }
            if (delta_y > this._ballCircleRadius / 2) {
                this._is_hit_resolve = true;
                //此时需要根据碰撞的具体位置来判断
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (this._basketball_speed_x < 0) {
                        if (this._baskball_speed_y < 0) {
                            return false;
                        }
                        var _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x);
                        if (Math.abs(this._basketball_speed_x) < 3) {
                            if (_rate > 1) {
                                this._basketball_speed_x = 5;
                                this._baskball_speed_y *= -0.7;
                            }
                            else {
                                this._basketball_speed_x = 5;
                                this._baskball_speed_y *= 0.7;
                            }
                        }
                        else {
                            if (_rate >= 1) {
                                this._basketball_speed_x *= 0.7;
                                this._baskball_speed_y *= -0.7;
                            }
                            else {
                                this._basketball_speed_x *= -0.7;
                                this._baskball_speed_y *= 0.7;
                            }
                            this._basketball_speed_x = Math.min(this._basketball_speed_x, -5);
                            if (Math.abs(this._baskball_speed_y) < 5) {
                                this._baskball_speed_y = this._baskball_speed_y / Math.abs(this._baskball_speed_y) * 5;
                            }
                        }
                    }
                    else {
                        if (this._basketball_speed_x == 0) {
                            this._basketball_speed_x = 5;
                        }
                        else {
                            this._basketball_speed_x = Math.max(this._basketball_speed_x, 5);
                        }
                        this._baskball_speed_y *= -0.7;
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (this._basketball_speed_x < 0) {
                        var _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x);
                        if (_rate >= 1) {
                            this._basketball_speed_x *= 0.7;
                            this._baskball_speed_y *= -0.7;
                        }
                        else {
                            this._basketball_speed_x *= -0.7;
                            this._baskball_speed_y *= 0.7;
                        }
                    }
                    else {
                        if (this._basketball_speed_x == 0) {
                            this._basketball_speed_x = -5;
                            this._baskball_speed_y *= 0.7;
                        }
                        else {
                            this._basketball_speed_x *= -0.7;
                            this._baskball_speed_y *= 0.7;
                        }
                        this._basketball_speed_x = Math.max(this._basketball_speed_x, -5);
                    }
                }
                else if (global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) {
                    if (this._basketball_speed_x == 0) {
                        this._basketball_speed_x = 5;
                    }
                    else {
                        this._basketball_speed_x *= 0.7;
                        this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = 0.7;
                    }
                }
                else {
                    this._is_hit_resolve = false;
                    return false;
                }
                return true;
            }
            else {
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (Math.abs(this._basketball_speed_x) < 3) {
                        this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = 5;
                    }
                    else {
                        if (this._basketball_speed_x < 0) {
                            this._basketball_speed_x *= -3;
                            this._baskball_speed_y = 0;
                        }
                        else {
                            this._baskball_speed_y *= -0.7;
                        }
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (Math.abs(this._basketball_speed_x) < 3) {
                        this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = -5;
                    }
                    else {
                        if (this._basketball_speed_x > 0) {
                            this._basketball_speed_x *= -3;
                            this._baskball_speed_y = 0;
                        }
                        else {
                            this._baskball_speed_y *= -0.7;
                        }
                    }
                }
                else {
                    console.error("速度过快了");
                }
                this._is_hit_resolve = true;
                return true;
            }
        }
        return false;
    };
    MainScenePanel.prototype.checkHitBasketRightScope = function () {
        var curr_x = this.m_basket_ball.x;
        var curr_y = this.m_basket_ball.y;
        var global_ball_center_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);
        var right_scope_left_top_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_right_scope.x, this.m_right_scope.y, right_scope_left_top_point);
        var right_scope_right_down_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_right_scope.x + this.m_right_scope.width, this.m_right_scope.y + this.m_right_scope.height, right_scope_right_down_point);
        if (global_ball_center_point.y < right_scope_left_top_point.y) {
            //上方，框的顶部，只有圆的下方才能和顶部碰撞，圆的上方就算和顶部碰撞了，也视作为左右两侧的碰撞
            //去除x没在范围的情况
            if (global_ball_center_point.x > right_scope_right_down_point.x + this._ballCircleRadius) {
                return false;
            }
            else if (global_ball_center_point.x < right_scope_left_top_point.x - this._ballCircleRadius) {
                return false;
            }
            //去除y没在范围的情况
            var delta_y = right_scope_left_top_point.y - global_ball_center_point.y;
            if (delta_y > this._ballCircleRadius) {
                return false;
            }
            else {
                //这里去没有相交的情况
                //去除y在范围，x在范围 但是不符合矩形和圆相交的情况
                var top_line_cirle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(delta_y, 2));
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (global_ball_center_point.x - right_scope_right_down_point.x > top_line_cirle_width) {
                        return false;
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x) {
                    if (right_scope_left_top_point.x - global_ball_center_point.x > top_line_cirle_width) {
                        return false;
                    }
                }
            }
            if (delta_y > this._ballCircleRadius / 2) {
                this._is_hit_resolve = true;
                //此时需要根据碰撞的具体位置来判断
                if (global_ball_center_point.x > right_scope_right_down_point.x) {
                    if (this._basketball_speed_x < 0) {
                        var message = this._basketball_speed_x + "  " + this._baskball_speed_y;
                        if (this._baskball_speed_y < 0) {
                            return false;
                        }
                        var _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x);
                        if (Math.abs(this._basketball_speed_x) < 3) {
                            if (_rate > 1) {
                                this._basketball_speed_x = 5;
                                this._baskball_speed_y *= -0.7;
                            }
                            else {
                                this._basketball_speed_x = 5;
                                this._baskball_speed_y *= 0.7;
                            }
                        }
                        else {
                            if (_rate >= 1) {
                                this._basketball_speed_x *= 0.7;
                                this._baskball_speed_y *= -0.7;
                            }
                            else {
                                this._basketball_speed_x *= -0.7;
                                this._baskball_speed_y *= 0.7;
                            }
                            this._basketball_speed_x = Math.min(this._basketball_speed_x, -5);
                            if (Math.abs(this._baskball_speed_y) < 5) {
                                this._baskball_speed_y = this._baskball_speed_y / Math.abs(this._baskball_speed_y) * 5;
                            }
                        }
                    }
                    else {
                        if (this._basketball_speed_x == 0) {
                            this._basketball_speed_x = 5;
                        }
                        else {
                            this._basketball_speed_x = Math.max(this._basketball_speed_x, 5);
                        }
                        this._baskball_speed_y *= -0.7;
                    }
                }
                else if (global_ball_center_point.x < right_scope_left_top_point.x && global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius) {
                    if (this._basketball_speed_x < 0) {
                        var _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x);
                        if (_rate >= 1) {
                            this._basketball_speed_x *= 0.7;
                            this._baskball_speed_y *= -0.7;
                        }
                        else {
                            this._basketball_speed_x *= -0.7;
                            this._baskball_speed_y *= 0.7;
                        }
                    }
                    else {
                        if (this._basketball_speed_x == 0) {
                            this._basketball_speed_x = -5;
                            this._baskball_speed_y *= 0.7;
                        }
                        else {
                            this._basketball_speed_x *= -0.7;
                            this._baskball_speed_y *= 0.7;
                        }
                        this._basketball_speed_x = Math.max(this._basketball_speed_x, -5);
                    }
                }
                else if (global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) {
                    if (this._basketball_speed_x == 0) {
                        this._basketball_speed_x = 5;
                    }
                    else {
                        this._basketball_speed_x *= 0.7;
                        this._baskball_speed_y *= -0.7;
                        this._basketball_speed_x = 0.7;
                    }
                }
                else {
                    this._is_hit_resolve = false;
                    return false;
                }
                return true;
            }
            else {
                var come_here = 0;
                // if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
                // 	if(this._basketball_speed_x < 0){ //反弹，并且减速
                // 		this._basketball_speed_x *= -0.7;
                // 		this._baskball_speed_y *= 0.7;
                // 	}else{
                // 		this._basketball_speed_x  += 0.3;
                // 		this._baskball_speed_y *= 0.7;
                // 	}
                // } else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左上方的角
                // 	if(this._basketball_speed_x < 0){ //反弹，并且减速
                // 		this._basketball_speed_x  == 0.3;
                // 		this._baskball_speed_y *= 0.7;
                // 	}else{
                // 		this._basketball_speed_x *= -0.7;
                // 		this._baskball_speed_y *= 0.7;
                // 	}
                // }
                // this._is_hit_resolve = true
                // return true;
            }
        }
        else if (global_ball_center_point.y > right_scope_right_down_point.y) {
        }
        else {
        }
        return false;
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
            this._basketball_speed_x = 0;
            return true;
        }
        return false;
    };
    MainScenePanel.prototype.checkHitBoardNew = function () {
        var global_ball_center_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);
        var board_scope_left_top_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y, board_scope_left_top_point);
        var board_scope_right_down_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_board_scope.x + this.m_board_scope.width, this.m_board_scope.y + this.m_board_scope.height, board_scope_right_down_point);
        var skip_board_scope_left_top_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_skip_board_scope.x, this.m_skip_board_scope.y, skip_board_scope_left_top_point);
        var skip_board_scope_right_down_point = new egret.Point();
        this.m_basket_container.localToGlobal(this.m_skip_board_scope.x + this.m_skip_board_scope.width, this.m_board_scope.y + this.m_board_scope.height, skip_board_scope_right_down_point);
        //x无效范围
        if (global_ball_center_point.x > board_scope_right_down_point.x + this._ballCircleRadius || global_ball_center_point.x < board_scope_left_top_point.x - this._ballCircleRadius) {
            return false;
        }
        //y无效范围
        if (global_ball_center_point.y > board_scope_right_down_point.y + this._ballCircleRadius || global_ball_center_point.y < board_scope_left_top_point.y - this._ballCircleRadius) {
            return false;
        }
        if (global_ball_center_point.y < skip_board_scope_left_top_point.y) {
            var top_line_circle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(global_ball_center_point.y - board_scope_left_top_point.y, 2));
            if (global_ball_center_point.x < board_scope_left_top_point.x) {
                if (board_scope_left_top_point.x - global_ball_center_point.x > top_line_circle_width) {
                    return false;
                }
            }
            else if (global_ball_center_point.x > board_scope_right_down_point.x) {
                if (global_ball_center_point.x - board_scope_right_down_point.x > top_line_circle_width) {
                    return false;
                }
            }
            this._is_hit_resolve = true;
            //处理上面相交过程
            if (this._basketball_speed_x > 0) {
                if (this._baskball_speed_y < 0) {
                    this._is_hit_resolve = false;
                    return false;
                }
                this._basketball_speed_x *= 0.7;
                this._baskball_speed_y *= -0.7;
            }
            else if (this._basketball_speed_x == 0) {
                this._basketball_speed_x = 5;
            }
            else if (this._basketball_speed_x < 0) {
                this._basketball_speed_x = -3;
                this._baskball_speed_y = -10;
                this._is_next_frame_skil_times = true;
            }
            return true;
        }
        if (global_ball_center_point.y > board_scope_right_down_point.y) {
            var down_line_circle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(global_ball_center_point.y - board_scope_right_down_point.y, 2));
            if (global_ball_center_point.x < board_scope_left_top_point.x) {
                if (board_scope_left_top_point.x - global_ball_center_point.x > down_line_circle_width) {
                    return false;
                }
            }
            else if (global_ball_center_point.x > board_scope_right_down_point.x) {
                if (global_ball_center_point.x - board_scope_right_down_point.x > down_line_circle_width) {
                    return false;
                }
            }
            this._is_hit_resolve = true;
            if (this._basketball_speed_x == 0) {
                if (global_ball_center_point.x > board_scope_right_down_point.x) {
                    this._basketball_speed_x = 5.0;
                }
                else if (global_ball_center_point.x < board_scope_left_top_point.x) {
                    this._basketball_speed_x = -5.0;
                }
                this._baskball_speed_y *= -0.7; //直接反弹
            }
            else {
                this._baskball_speed_y *= -1; //直接反弹
            }
            return true;
        }
        //下面就是碰撞左右两边了
        this._is_hit_resolve = true;
        this._basketball_speed_x *= -1;
        return true;
    };
    MainScenePanel.prototype.checkHitBoard = function () {
        var global_ball_center_point = new egret.Point();
        this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);
        var localInContainerPoint = new egret.Point();
        this.m_basket_container.globalToLocal(global_ball_center_point.x, global_ball_center_point.y, localInContainerPoint);
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
                var is_down = false;
                if (temp_global_point.y < center_y_1) {
                    is_down = true;
                    if (this._baskball_speed_y > 0) {
                        this._basketball_speed_x *= 1;
                        this._baskball_speed_y *= -1;
                        console.log("#####11#######", this._basketball_speed_x, this._baskball_speed_y);
                    }
                    else {
                        this._basketball_speed_x *= -1;
                        this._baskball_speed_y *= 1;
                        console.log("#####22#######", this._basketball_speed_x, this._baskball_speed_y);
                    }
                }
                else {
                    if (temp_global_point.x < bigCircleRightDownPoint.x + this._ballCircleRadius / 2) {
                        console.log("#####33#######", this._basketball_speed_x, this._baskball_speed_y);
                        if (this._baskball_speed_y < 0) {
                            this._basketball_speed_x *= 0.7;
                            this._baskball_speed_y *= -0.7;
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        console.log("#####44#######", this._basketball_speed_x, this._baskball_speed_y);
                        if (this._basketball_speed_x < 0) {
                            this._basketball_speed_x *= -0.7;
                            this._baskball_speed_y *= 0.7;
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                console.log("#####hit circle###########", this._basketball_speed_x, this._baskball_speed_y, this._current_times, this._currnet_index, is_down);
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