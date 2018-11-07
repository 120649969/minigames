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
        _this._isUsingMi = true;
        _this._auto_enter_next_round = false;
        _this._is_first_round = true;
        _this._hasTouchBegin = false;
        _this._hasThisRoundTouch = false;
        _this._is_face_left = true;
        _this._has_goal = false;
        _this.skinName = "MainScene";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this._onAddToStage, _this);
        return _this;
    }
    MainScenePanel.prototype._onAddToStage = function (event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
        this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
        var __this = this;
        this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            var debugPanel = new DebugPanel();
            __this.addChild(debugPanel);
            event.stopPropagation();
        }.bind(this), this);
        this._initGame();
    };
    MainScenePanel.prototype.HasTouchBegin = function () {
        return this._hasTouchBegin;
    };
    MainScenePanel.prototype.GetHitManagerMi = function () {
        return this._hitManager;
    };
    MainScenePanel.prototype.HasThisRoundTouch = function () {
        return this._hasThisRoundTouch;
    };
    MainScenePanel.prototype._initGame = function () {
        this._hitManager = new HitManager(this);
        this._playerBall = new PlayerBall(this.m_basket_ball, this);
        this._left_basket_container_x = this.m_basket_container_back.x;
        this._left_basket_container_y = this.m_basket_container_back.y;
        this._right_basket_container_x = this.stage.stageWidth;
        this._right_basket_container_y = this._left_basket_container_y;
        this._nextRound();
    };
    MainScenePanel.prototype.IsFaceLeft = function () {
        return this._is_face_left;
    };
    MainScenePanel.prototype.HasGoal = function () {
        return this._has_goal;
    };
    MainScenePanel.prototype.SetGoal = function (has_global) {
        this._has_goal = has_global;
    };
    MainScenePanel.prototype.AutoEnterNextRound = function () {
        this._auto_enter_next_round = true;
    };
    MainScenePanel.prototype.IsInAutoEnterNextRound = function () {
        return this._auto_enter_next_round;
    };
    MainScenePanel.prototype.GetPlayerBall = function () {
        return this._playerBall;
    };
    MainScenePanel.prototype._nextRound = function () {
        this.SetGoal(false);
        this._is_face_left = Math.floor(Math.random() * 2) == 0;
        // this._is_face_left = !this._is_face_left
        if (this._is_first_round) {
            this._is_face_left = true;
        }
        this._hasThisRoundTouch = false;
        if (this._is_face_left) {
            this.m_basket_container_pre.x = this._left_basket_container_x;
            this.m_basket_container_pre.y = this._left_basket_container_y;
            this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX);
            this.m_basket_container_back.x = this._left_basket_container_x;
            this.m_basket_container_back.y = this._left_basket_container_y;
            this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX);
        }
        else {
            this.m_basket_container_pre.x = this._right_basket_container_x;
            this.m_basket_container_pre.y = this._right_basket_container_y;
            this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;
            this.m_basket_container_back.x = this._right_basket_container_x;
            this.m_basket_container_back.y = this._right_basket_container_y;
            this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;
        }
        if (this._is_first_round) {
            var random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
            var random_ball_y = this.m_floor.y - 200;
            this.m_basket_ball.x = random_ball_x;
            this.m_basket_ball.y = random_ball_y;
        }
        this._is_first_round = false;
        this.validateNow();
        this._hitManager.EnterNextRound();
        this._playerBall.EnterNextRound();
    };
    MainScenePanel.prototype._onEnterFrame = function (event) {
        if (this._auto_enter_next_round) {
            this._nextRound();
            this._auto_enter_next_round = false;
        }
        this._playerBall.Update();
    };
    MainScenePanel.prototype._onTouchBegin = function (event) {
        if (!this._hasTouchBegin) {
            this._hasTouchBegin = true;
        }
        this._hasThisRoundTouch = true;
        if (this.m_basket_ball.y <= this.m_top.y) {
            return;
        }
        this._playerBall.OnPushDown();
    };
    return MainScenePanel;
}(eui.Component));
__reflect(MainScenePanel.prototype, "MainScenePanel");
//# sourceMappingURL=MainScenePanel.js.map