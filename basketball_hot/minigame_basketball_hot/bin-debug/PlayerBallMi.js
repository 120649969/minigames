var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PlayerBallMi = (function () {
    function PlayerBallMi(_ball, _mainPanel) {
        this._tweenDir = 0;
        this._last_x = 0;
        this._last_y = 0;
        this._rotate_time = 0.8;
        this._last_hit_type = HitType.None;
        this.m_basket_ball = _ball;
        this.mainPanel = _mainPanel;
        this._hitManager = _mainPanel.getHitManagerMi();
    }
    PlayerBallMi.prototype._updateRotationTween = function () {
        if (!this.mainPanel.HasTouchBegin()) {
            return;
        }
        if (this._tweenDir == 0) {
            if (this.mainPanel.basketball_speed_x < 0) {
                egret.Tween.get(this.mainPanel.m_image_ball, { loop: true }).to({ rotation: -180 }, this._rotate_time * 1000).to({ rotation: -360 }, this._rotate_time * 1000);
                this._tweenDir = -1;
            }
            else {
                egret.Tween.get(this.mainPanel.m_image_ball, { loop: true }).to({ rotation: 180 }, this._rotate_time * 1000).to({ rotation: 360 }, this._rotate_time * 1000);
                this._tweenDir = 1;
            }
            return;
        }
        if (this.mainPanel.basketball_speed_x < 0 && this._tweenDir > 0) {
            this.mainPanel.m_image_ball.rotation = 0;
            this._tweenDir = -1;
            egret.Tween.removeTweens(this.mainPanel.m_image_ball);
            egret.Tween.get(this.mainPanel.m_image_ball, { loop: true }).to({ rotation: -180 }, this._rotate_time * 1000).to({ rotation: -360 }, this._rotate_time * 1000);
        }
        else if (this.mainPanel.basketball_speed_x > 0 && this._tweenDir < 0) {
            this._tweenDir = 1;
            this.mainPanel.m_image_ball.rotation = 0;
            egret.Tween.removeTweens(this.mainPanel.m_image_ball);
            egret.Tween.get(this.mainPanel.m_image_ball, { loop: true }).to({ rotation: 180 }, this._rotate_time * 1000).to({ rotation: 360 }, this._rotate_time * 1000);
        }
    };
    PlayerBallMi.prototype._adjustBallPosition = function () {
        var is_change_pos = false;
        var target_x = 0;
        if (this.mainPanel.m_basket_ball.x < 0 - this.mainPanel.m_basket_ball.width) {
            target_x = this.mainPanel.m_basket_ball.x + this.mainPanel.stage.stageWidth;
            is_change_pos = true;
        }
        else if (this.mainPanel.m_basket_ball.x > this.mainPanel.stage.stageWidth) {
            target_x = this.mainPanel.m_basket_ball.x - this.mainPanel.stage.stageWidth;
            is_change_pos = true;
        }
        if (is_change_pos) {
            if (this.mainPanel.HasGoal()) {
                this.mainPanel.AutoEnterNextRound();
            }
            this.mainPanel.m_basket_ball.x = target_x;
        }
    };
    PlayerBallMi.prototype._adjustSpeed = function () {
        if (!this.mainPanel.HasThisRoundTouch() || this.mainPanel.HasGoal()) {
            return;
        }
        if (this.mainPanel.IsFaceLeft()) {
            if (this.mainPanel.basketball_speed_x > HitConst.Max_Speed_X * -1) {
                this.mainPanel.basketball_speed_x -= HitConst.Frame_Speed_X;
            }
            this.mainPanel.basketball_speed_x = Math.max(this.mainPanel.basketball_speed_x, HitConst.Max_Speed_X * -1);
        }
        else {
            if (this.mainPanel.basketball_speed_x < HitConst.Max_Speed_X) {
                this.mainPanel.basketball_speed_x += HitConst.Frame_Speed_X;
            }
            this.mainPanel.basketball_speed_x = Math.min(this.mainPanel.basketball_speed_x, HitConst.Max_Speed_X);
        }
    };
    //检测是否进球
    PlayerBallMi.prototype._checkGoal = function (firstPoint, secondPoint) {
        var global_circle_scope_left_top_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x, this.mainPanel.m_circle_scope.y);
        var global_circle_scope_right_down_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x + this.mainPanel.m_circle_scope.width, this.mainPanel.m_circle_scope.y + this.mainPanel.m_circle_scope.height);
        if (!this.mainPanel.IsFaceLeft()) {
            HitConst.SwapPointXY(global_circle_scope_left_top_point, global_circle_scope_right_down_point);
        }
        var last_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(firstPoint.x, firstPoint.y);
        var last_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(firstPoint.x + this.m_basket_ball.width, firstPoint.y + this.m_basket_ball.height);
        var last_global_ball_center_point = new egret.Point((last_global_ball_left_top_point.x + last_global_ball_right_down_point.x) / 2, (last_global_ball_left_top_point.y + last_global_ball_right_down_point.y) / 2);
        this._last_x = this.m_basket_ball.x;
        this._last_y = this.m_basket_ball.y;
        if (last_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || last_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10) {
            return false;
        }
        var current_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x, secondPoint.y);
        var current_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x + this.m_basket_ball.width, secondPoint.y + this.m_basket_ball.height);
        var current_global_ball_center_point = new egret.Point((current_global_ball_left_top_point.x + current_global_ball_right_down_point.x) / 2, (current_global_ball_left_top_point.y + current_global_ball_right_down_point.y) / 2);
        if (current_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10) {
            return false;
        }
        var global_circle_center_point = new egret.Point((global_circle_scope_left_top_point.x + global_circle_scope_right_down_point.x) / 2, (global_circle_scope_left_top_point.y + global_circle_scope_right_down_point.y) / 2);
        if (last_global_ball_center_point.y <= global_circle_center_point.y && current_global_ball_center_point.y >= global_circle_center_point.y) {
            console.log("#########进球了###");
            return true;
        }
        return false;
    };
    PlayerBallMi.prototype._isCurrentInCricleScope = function () {
        var global_circle_scope_left_top_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x, this.mainPanel.m_circle_scope.y);
        var global_circle_scope_right_down_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x + this.mainPanel.m_circle_scope.width, this.mainPanel.m_circle_scope.y + this.mainPanel.m_circle_scope.height);
        if (!this.mainPanel.IsFaceLeft()) {
            HitConst.SwapPointXY(global_circle_scope_left_top_point, global_circle_scope_right_down_point);
        }
        var current_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(this.m_basket_ball.x, this.m_basket_ball.y);
        var current_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(this.m_basket_ball.x + this.m_basket_ball.width, this.m_basket_ball.y + this.m_basket_ball.height);
        if (current_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10) {
            return false;
        }
        return true;
    };
    PlayerBallMi.prototype.EnterNextRound = function () {
    };
    PlayerBallMi.prototype.Update = function () {
        this._adjustSpeed();
        this._updateRotationTween();
        this._adjustBallPosition();
        var delta_speed_y = HitConst.Gravity + this.mainPanel._current_impluse.y;
        this.mainPanel.basketball_speed_y += delta_speed_y;
        this.mainPanel.basketball_speed_y = Math.max(this.mainPanel.basketball_speed_y, HitConst.MIN_SPEED_Y);
        this.mainPanel._current_impluse.y = 0;
        var total_speed = Math.sqrt(Math.pow(this.mainPanel.basketball_speed_x, 2) + Math.pow(this.mainPanel.basketball_speed_y, 2)) / HitConst.Factor;
        var step_speed = 2;
        var times = Math.ceil(total_speed / step_speed);
        var step_speend_x = this.mainPanel.basketball_speed_x / times;
        var step_speend_y = this.mainPanel.basketball_speed_y / times;
        var is_current_in_circle_scope = this._isCurrentInCricleScope();
        var has_goal = this.mainPanel.HasGoal();
        for (var step_idx = 1; step_idx <= times; step_idx++) {
            if (step_idx == times) {
                step_speend_x = this.mainPanel.basketball_speed_x - this.mainPanel.basketball_speed_x / times * (times - 1);
                step_speend_y = this.mainPanel.basketball_speed_y - this.mainPanel.basketball_speed_y / times * (times - 1);
            }
            var temp_last_x = this.m_basket_ball.x;
            var temp_last_y = this.m_basket_ball.y;
            this.m_basket_ball.x += step_speend_x / HitConst.Factor;
            this.m_basket_ball.y += step_speend_y / HitConst.Factor;
            this.m_basket_ball.y = Math.min(this.m_basket_ball.y, this.mainPanel.m_floor.y - this.m_basket_ball.height);
            if (this._hitManager.CheckHit()) {
                this.m_basket_ball.x = temp_last_x;
                this.m_basket_ball.y = temp_last_y;
                break;
            }
            if (is_current_in_circle_scope) {
                if (!has_goal) {
                    has_goal = this._checkGoal(new egret.Point(temp_last_x, temp_last_y), new egret.Point(this.m_basket_ball.x, this.m_basket_ball.y));
                    if (has_goal) {
                        this.mainPanel.SetGoal(true);
                    }
                }
            }
        }
        if (this._hitManager.GetHitType() == HitType.Floor) {
            this.m_basket_ball.x += this.mainPanel.basketball_speed_x / HitConst.Factor;
        }
        else if (this._hitManager.GetHitType() != HitType.None) {
            if (this._hitManager.GetHitType() == this._last_hit_type) {
                // this.m_basket_ball.y = this.m_basket_ball.y - 2
                console.log("####连续碰撞#####", this.mainPanel.basketball_speed_y);
            }
        }
        this._last_hit_type = this._hitManager.GetHitType();
    };
    return PlayerBallMi;
}());
__reflect(PlayerBallMi.prototype, "PlayerBallMi");
//# sourceMappingURL=PlayerBallMi.js.map