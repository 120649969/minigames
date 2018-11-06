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
        _this.basketball_speed_x = 0.0;
        _this.basketball_speed_y = 0.0;
        _this._current_impluse = new egret.Point();
        _this._isUsingMi = true;
        _this._auto_enter_next_round = false;
        _this._is_first_round = true;
        _this._hasTouchBegin = false;
        _this._hasThisRoundTouch = false;
        _this._is_face_left = true;
        _this._has_goal = false;
        _this.skinName = "MainScene";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MainScenePanel.prototype.onAddToStage = function (event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        var __this = this;
        this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            var debugPanel = new DebugPanel();
            __this.addChild(debugPanel);
            event.stopPropagation();
        }.bind(this), this);
        this.initGame();
    };
    MainScenePanel.prototype.HasTouchBegin = function () {
        return this._hasTouchBegin;
    };
    MainScenePanel.prototype.getHitManager = function () {
        return this._hitManager;
    };
    MainScenePanel.prototype.getHitManagerMi = function () {
        return this._hitManagerMi;
    };
    MainScenePanel.prototype.HasThisRoundTouch = function () {
        return this._hasThisRoundTouch;
    };
    MainScenePanel.prototype.initGame = function () {
        this._hitManager = new HitManager(this);
        this._playerBall = new PlayerBall(this.m_basket_ball, this);
        this._hitManagerMi = new HitManagerMi(this);
        this._playerBallMi = new PlayerBallMi(this.m_basket_ball, this);
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
    };
    MainScenePanel.prototype.AutoEnterNextRound = function () {
        this._auto_enter_next_round = true;
    };
    MainScenePanel.prototype.IsInAutoEnterNextRound = function () {
        return this._auto_enter_next_round;
    };
    MainScenePanel.prototype.NextRound = function () {
        this.SetGoal(false);
        // this._is_face_left = Math.floor(Math.random() * 2) == 0
        this._is_face_left = !this._is_face_left;
        if (this._is_first_round) {
            this._is_face_left = true;
        }
        this._hasThisRoundTouch = false;
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
            // if(this._is_face_left){
            // 	let random_ball_x = this.stage.stageWidth + Math.random() * 30;
            // 	let random_ball_y = this.m_floor.y - Math.random() * 30 - 200 - this.m_basket_ball.height;
            // 	this.m_basket_ball.x = random_ball_x
            // 	this.m_basket_ball.y = random_ball_y
            // 	// this.basketball_speed_x = HitConst.Max_Speed_X * -1;
            // } else {
            // 	let random_ball_x = 0 - Math.random() * 30;
            // 	let random_ball_y = this.m_floor.y - Math.random() * 30 - 200 - this.m_basket_ball.height;
            // 	this.m_basket_ball.x = random_ball_x
            // 	this.m_basket_ball.y = random_ball_y
            // 	// this.basketball_speed_x = HitConst.Max_Speed_X;
            // }
        }
        else {
            var random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
            var random_ball_y = this.m_floor.y - 200;
            this.m_basket_ball.x = random_ball_x;
            this.m_basket_ball.y = random_ball_y;
        }
        this._is_first_round = false;
        if (this._isUsingMi) {
            this._playerBallMi.EnterNextRound();
        }
        else {
            this._playerBall.EnterNextRound();
        }
    };
    MainScenePanel.prototype.onEnterFrame = function (event) {
        if (this._auto_enter_next_round) {
            this.NextRound();
            this._auto_enter_next_round = false;
        }
        if (this._isUsingMi) {
            this._playerBallMi.Update();
        }
        else {
            this._playerBall.Update();
        }
    };
    MainScenePanel.prototype.onTouchBegin = function (event) {
        if (!this._hasTouchBegin) {
            this._hasTouchBegin = true;
        }
        this._hasThisRoundTouch = true;
        if (this.m_basket_ball.y <= this.m_top.y) {
            return;
        }
        if (this.basketball_speed_y > 0) {
            this.basketball_speed_y = 0;
        }
        this._current_impluse.y = HitConst.PUSH_DOWN_IMPLUSE_Y;
        this.basketball_speed_x = HitConst.Max_Speed_X * (this._is_face_left ? -1 : 1);
    };
    //和篮网的碰撞
    // public checkHitNet():void
    // {
    // 	let temp_global_point:egret.Point = new egret.Point();
    // 	this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);
    // 	let localPoint:egret.Point = new egret.Point();
    // 	this.m_basket_container.globalToLocal(temp_global_point.x, temp_global_point.y, localPoint);
    // 	if(localPoint.x <= this.m_net_scope.x + this.m_net_scope.width + this._ballCircleRadius && localPoint.x >= this.m_net_scope.x - this._ballCircleRadius)
    // 	{
    // 		if(localPoint.y <= this.m_net_scope.y + this.m_net_scope.height + this._ballCircleRadius && localPoint.y >= this.m_net_scope.y + this.m_net_scope.height / 2)
    // 		{
    // 			console.log("#####hit net#####")
    // 		}
    // 	}
    // }
    MainScenePanel.prototype.isLeft = function () {
        return true;
    };
    return MainScenePanel;
}(eui.Component));
__reflect(MainScenePanel.prototype, "MainScenePanel");
//# sourceMappingURL=MainScenePanel.js.map