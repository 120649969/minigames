class PlayerBall {

	public m_basket_ball : eui.Group;
	public mainPanel : MainScenePanel;

	private _hitManagerNew:HitManagerNew;
	private _tweenDir:number = 0
	private _last_x:number = 0;
	private _last_y:number = 0;

	private _rotate_time = 0.8
	private _last_hit_type = HitType.None

	public constructor(_ball:eui.Group, _mainPanel:MainScenePanel) {
		this.m_basket_ball = _ball;
		this.mainPanel = _mainPanel;
		this._hitManagerNew = _mainPanel.getHitManagerNew();
	}

	private _updateRotationTween():void
	{
		if(!this.mainPanel.HasTouchBegin()){
			return
		}
		if(this._tweenDir == 0){
			if(this.mainPanel._basketball_speed_x < 0){
				egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:-180}, this._rotate_time * 1000).to({rotation:-360}, this._rotate_time * 1000)
				this._tweenDir = -1
			} else{
				egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:180}, this._rotate_time * 1000).to({rotation:360}, this._rotate_time * 1000)
				this._tweenDir = 1
			}
			return
		}
		if(this.mainPanel._basketball_speed_x < 0 && this._tweenDir > 0){
			this.mainPanel.m_image_ball.rotation = 0
			this._tweenDir = -1;
			egret.Tween.removeTweens(this.mainPanel.m_image_ball)
			egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:-180}, this._rotate_time * 1000).to({rotation:-360}, this._rotate_time * 1000)
		}else if(this.mainPanel._basketball_speed_x > 0 && this._tweenDir < 0){
			this._tweenDir = 1;
			this.mainPanel.m_image_ball.rotation = 0
			egret.Tween.removeTweens(this.mainPanel.m_image_ball)
			egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:180}, this._rotate_time * 1000).to({rotation:360}, this._rotate_time * 1000)
		}
	}

	private _adjustBallPosition():void
	{
		let is_change_pos = false
		let target_x = 0
		if(this.mainPanel.m_basket_ball.x < 0 - this.mainPanel.m_basket_ball.width){ //超出了左边边界
			target_x = this.mainPanel.m_basket_ball.x + this.mainPanel.stage.stageWidth
			is_change_pos = true
		} else if(this.mainPanel.m_basket_ball.x > this.mainPanel.stage.stageWidth) { //超出了右边边界
			target_x = this.mainPanel.m_basket_ball.x - this.mainPanel.stage.stageWidth
			is_change_pos = true
		}
		if(is_change_pos){ //超过了边界才开始下一轮
			if(this.mainPanel.HasGoal()){
				this.mainPanel.AutoEnterNextRound();
			}else{
				this.mainPanel.m_basket_ball.x = target_x
			}
		}
	}

	private _adjustSpeed():void
	{
		if(!this.mainPanel.HasTouchBegin()){
			return
		}
		if(this.mainPanel.IsFaceLeft()){
			if(this.mainPanel._basketball_speed_x > HitConst.Max_Speed_X * -1){
				this.mainPanel._basketball_speed_x -= HitConst.Frame_Speed_X
			}
			this.mainPanel._basketball_speed_x = Math.max(this.mainPanel._basketball_speed_x, HitConst.Max_Speed_X * -1)
		} else {
			if(this.mainPanel._basketball_speed_x < HitConst.Max_Speed_X){
				this.mainPanel._basketball_speed_x += HitConst.Frame_Speed_X
			}
			this.mainPanel._basketball_speed_x = Math.min(this.mainPanel._basketball_speed_x, HitConst.Max_Speed_X)
		}
	}

	//检测是否进球
	private _checkGoal(firstPoint:egret.Point, secondPoint:egret.Point):boolean
	{
		let global_circle_scope_left_top_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x, this.mainPanel.m_circle_scope.y)
		let global_circle_scope_right_down_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x + this.mainPanel.m_circle_scope.width, this.mainPanel.m_circle_scope.y + this.mainPanel.m_circle_scope.height)
		
		if(!this.mainPanel.IsFaceLeft())
		{
			HitConst.SwapPointXY(global_circle_scope_left_top_point, global_circle_scope_right_down_point)
		}
		
		let last_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(firstPoint.x,firstPoint.y);
		let last_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(firstPoint.x + this.m_basket_ball.width, firstPoint.y + this.m_basket_ball.height)
		let last_global_ball_center_point = new egret.Point((last_global_ball_left_top_point.x + last_global_ball_right_down_point.x) / 2, (last_global_ball_left_top_point.y + last_global_ball_right_down_point.y) / 2)
		this._last_x = this.m_basket_ball.x
		this._last_y = this.m_basket_ball.y
		if(last_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || last_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10)
		{
			return false;
		}

		let current_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x, secondPoint.y);
		let current_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x + this.m_basket_ball.width, secondPoint.y + this.m_basket_ball.height);
		let current_global_ball_center_point = new egret.Point((current_global_ball_left_top_point.x + current_global_ball_right_down_point.x) / 2, (current_global_ball_left_top_point.y + current_global_ball_right_down_point.y) / 2)
		if(current_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10)
		{
			return false;

		}
		let global_circle_center_point = new egret.Point((global_circle_scope_left_top_point.x + global_circle_scope_right_down_point.x) / 2, (global_circle_scope_left_top_point.y + global_circle_scope_right_down_point.y) / 2)
		if(last_global_ball_center_point.y <= global_circle_center_point.y && current_global_ball_center_point.y >= global_circle_center_point.y)
		{
			console.log("#########进球了###")
			return true;
		}
		return false;
	}

	private _isCurrentInCricleScope():boolean
	{
		let global_circle_scope_left_top_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x, this.mainPanel.m_circle_scope.y)
		let global_circle_scope_right_down_point = this.mainPanel.m_circle_scope.parent.localToGlobal(this.mainPanel.m_circle_scope.x + this.mainPanel.m_circle_scope.width, this.mainPanel.m_circle_scope.y + this.mainPanel.m_circle_scope.height)

		if(!this.mainPanel.IsFaceLeft())
		{
			HitConst.SwapPointXY(global_circle_scope_left_top_point, global_circle_scope_right_down_point)
		}
		let current_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(this.m_basket_ball.x, this.m_basket_ball.y);
		let current_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(this.m_basket_ball.x + this.m_basket_ball.width, this.m_basket_ball.y + this.m_basket_ball.height);
		if(current_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10)
		{
			return false
		}
		return true;
	}

	private _is_new_round:boolean = false;
	public EnterNextRound():void
	{
		this._is_new_round = true;
	}

	public Update():void
	{
		this._adjustSpeed();
		this._updateRotationTween()
		if(this._is_new_round){
			if(this.mainPanel.m_basket_ball.x > 0 && this.mainPanel.m_basket_ball.x < this.mainPanel.stage.stageWidth){
				this._is_new_round = false
			}
		}
		if(!this._is_new_round &&  !this.mainPanel.IsInAutoEnterNextRound()){
			this._adjustBallPosition()
		}
		let delta_speed_y = this.mainPanel._gravity + this.mainPanel._current_impluse.y;
		this.mainPanel._baskball_speed_y += delta_speed_y;
		this.mainPanel._baskball_speed_y = Math.max(this.mainPanel._baskball_speed_y, -20);

		this.mainPanel._current_impluse.y = 0

		let total_speed = Math.sqrt(Math.pow(this.mainPanel._basketball_speed_x, 2) + Math.pow(this.mainPanel._baskball_speed_y, 2));
		let step_speed = 2
		
		let times = Math.ceil(total_speed / step_speed)
		let step_speend_x = this.mainPanel._basketball_speed_x / times
		let step_speend_y = this.mainPanel._baskball_speed_y / times
		
		let is_current_in_circle_scope = this._isCurrentInCricleScope();
		let has_goal = this.mainPanel.HasGoal();
		for(let step_idx = 1; step_idx <= times; step_idx++)
		{
			if(step_idx == times)
			{
				step_speend_x = this.mainPanel._basketball_speed_x - this.mainPanel._basketball_speed_x / times * (times - 1)
				step_speend_y = this.mainPanel._baskball_speed_y - this.mainPanel._baskball_speed_y / times * (times - 1)
			}

			let temp_last_x = this.m_basket_ball.x
			let temp_last_y = this.m_basket_ball.y
			this.m_basket_ball.x += step_speend_x;
			this.m_basket_ball.y += step_speend_y;

			this.m_basket_ball.y = Math.min(this.m_basket_ball.y, this.mainPanel.m_floor.y - this.m_basket_ball.height);
			if(this._hitManagerNew.CheckHit())
			{
				this.m_basket_ball.x = temp_last_x
				this.m_basket_ball.y = temp_last_y
				break
			}

			if(is_current_in_circle_scope)
			{
				if(!has_goal)
				{
					has_goal = this._checkGoal(new egret.Point(temp_last_x, temp_last_y), new egret.Point(this.m_basket_ball.x, this.m_basket_ball.y))
					if(has_goal)
					{
						this.mainPanel.SetGoal(true);
					}
				}
			}
		}

		if(this._hitManagerNew.GetHitType() == HitType.Floor){
			this.m_basket_ball.x += this.mainPanel._basketball_speed_x
		}else if(this._hitManagerNew.GetHitType() != HitType.None) {
			if(this._hitManagerNew.GetHitType() == this._last_hit_type){
				if(Math.abs(this.mainPanel._baskball_speed_y) < 5){
					this.mainPanel._baskball_speed_y = this.mainPanel._baskball_speed_y / Math.abs(this.mainPanel._baskball_speed_y) * 5 * -1
				} else{
					if(Math.abs(this.mainPanel._baskball_speed_y) > 10){
						this.mainPanel._baskball_speed_y = this.mainPanel._baskball_speed_y / Math.abs(this.mainPanel._baskball_speed_y) * 10 * -1
					} else{
						this.mainPanel._baskball_speed_y = this.mainPanel._baskball_speed_y * -1
					}
				}
				// this.mainPanel._baskball_speed_y *= -2;
				console.log("####连续碰撞#####", this.mainPanel._baskball_speed_y)
			}
		}
		this._last_hit_type = this._hitManagerNew.GetHitType()
	}
}