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
        _this._gravity = 1.2;
        _this._basketball_speed_x = 0.0;
        _this._baskball_speed_y = 0.0;
        _this._touchdown_impluse = new egret.Point(-5.0, -16.0);
        _this._is_game_end = false;
        _this._current_impluse = new egret.Point();
        _this._ballCircleRadius = 0;
        _this._isStart = false;
        _this._isStop = false;
        _this._auto_enter_next_round = false;
        _this._is_first_round = true;
        _this._hasTouchBegin = false;
        _this._is_face_left = true;
        _this._has_goal = false;
        _this.skinName = "MainScene";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MainScenePanel.prototype.onAddToStage = function (event) {
        this._isStart = true;
        this._last_time = egret.getTimer();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this._ballCircleRadius = 25;
        this.initGame();
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
    MainScenePanel.prototype.getHitManager = function () {
        return this._hitManager;
    };
    MainScenePanel.prototype.getHitManagerNew = function () {
        return this._hitManagerNew;
    };
    MainScenePanel.prototype.initGame = function () {
        this._hitManager = new HitManager(this);
        this._hitManagerNew = new HitManagerNew(this);
        this._playerBall = new PlayerBall(this.m_basket_ball, this);
        this._left_basket_container_x = this.m_basket_container.x;
        this._left_basket_container_y = this.m_basket_container.y;
        this._right_basket_container_x = this.stage.stageWidth;
        this._right_basket_container_y = this._left_basket_container_y;
        this.NextRound();
    };
    MainScenePanel.prototype.IsFaceLeft = function () {
        return this._is_face_left;
    };
    MainScenePanel.prototype.HasGoal = function () {
        return this._has_goal;
    };
    MainScenePanel.prototype.SetGoal = function (has_global) {
        this._has_goal = has_global;
        if (has_global) {
            var __this_1 = this;
            setTimeout(function () {
                __this_1._auto_enter_next_round = true;
            }.bind(this), 2 * 1000);
        }
    };
    MainScenePanel.prototype.NextRound = function () {
        this.SetGoal(false);
        this._is_face_left = Math.floor(Math.random() * 2) == 0;
        if (this._is_first_round) {
            this._is_face_left = true;
        }
        if (this._is_face_left) {
            this.m_basket_container.x = this._left_basket_container_x;
            this.m_basket_container.y = this._left_basket_container_y;
            this.m_basket_container.scaleX = Math.abs(this.m_basket_container.scaleX);
        }
        else {
            this.m_basket_container.x = this._right_basket_container_x;
            this.m_basket_container.y = this._right_basket_container_y;
            this.m_basket_container.scaleX = Math.abs(this.m_basket_container.scaleX) * -1;
        }
        if (!this._is_first_round) {
            if (this._is_face_left) {
                var random_ball_x = this.stage.stageWidth + Math.random() * 30;
                var random_ball_y = this.m_floor.y - Math.random() * 30 - 200 - this.m_basket_ball.height;
                this.m_basket_ball.x = random_ball_x;
                this.m_basket_ball.y = random_ball_y;
                this._basketball_speed_x = HitConst.Max_Speed_X * -1;
            }
            else {
                var random_ball_x = 0 - Math.random() * 30;
                var random_ball_y = this.m_floor.y - Math.random() * 30 - 200 - this.m_basket_ball.height;
                this.m_basket_ball.x = random_ball_x;
                this.m_basket_ball.y = random_ball_y;
                this._basketball_speed_x = HitConst.Max_Speed_X;
            }
        }
        else {
            var random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
            var random_ball_y = this.m_floor.y - 200;
            this.m_basket_ball.x = random_ball_x;
            this.m_basket_ball.y = random_ball_y;
        }
        this._is_first_round = false;
    };
    MainScenePanel.prototype.onEnterFrame = function (event) {
        if (this._isStop) {
            return;
        }
        if (this._auto_enter_next_round) {
            this._auto_enter_next_round = false;
            this.NextRound();
        }
        this._playerBall.Update();
    };
    MainScenePanel.prototype.onTouchBegin = function (event) {
        if (!this._hasTouchBegin) {
            this._hasTouchBegin = true;
        }
        if (this.m_basket_ball.y <= this.m_top.y) {
            return;
        }
        if (this._baskball_speed_y > 0) {
            this._baskball_speed_y = 0;
        }
        this._current_impluse.x = this._touchdown_impluse.x;
        this._current_impluse.y = this._touchdown_impluse.y;
        this._basketball_speed_x = HitConst.Max_Speed_X * (this._is_face_left ? -1 : 1);
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
    MainScenePanel.prototype.isLeft = function () {
        return true;
    };
    return MainScenePanel;
}(eui.Component));
__reflect(MainScenePanel.prototype, "MainScenePanel");
//# sourceMappingURL=MainScenePanel.js.map