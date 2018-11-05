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
    MainScenePanel.prototype.getHitManager = function () {
        return this._hitManager;
    };
    MainScenePanel.prototype.getHitManagerNew = function () {
        return this._hitManagerNew;
    };
    MainScenePanel.prototype.initUI = function () {
        this._hitManager = new HitManager(this);
        this._hitManagerNew = new HitManagerNew(this);
        this._playerBall = new PlayerBall(this.m_basket_ball, this);
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
        this._playerBall.Update();
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
        this._basketball_speed_x = this._touchdown_impluse.x;
        //下面是供测试使用的代码
        // let localX = event.stageX;
        // let localY = event.stageY;
        // this.m_basket_ball.x = localX;
        // this.m_basket_ball.y = localY;
        // console.log(localX, localY)
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