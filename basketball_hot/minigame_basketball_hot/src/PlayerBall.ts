class PlayerBall {

	public m_basket_ball : eui.Group;
	public mainPanel : MainScenePanel;

	private _hitManager:HitManager;
	private _hitManagerNew:HitManagerNew;
	private _tweenDir:number = -1
	private _last_x:number = 0;
	private _last_y:number = 0;

	private _rotate_time = 0.8
	public constructor(_ball:eui.Group, _mainPanel:MainScenePanel) {
		this.m_basket_ball = _ball;
		this.mainPanel = _mainPanel;
		this._hitManager = _mainPanel.getHitManager();
		this._hitManagerNew = _mainPanel.getHitManagerNew();
		egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:-180}, this._rotate_time * 1000).to({rotation:-360}, this._rotate_time * 1000)
	}

	private _updateRotationTween():void
	{
		if(this.mainPanel._basketball_speed_x < 0 && this._tweenDir > 0){
			this._tweenDir = -1;
			egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:-180}, this._rotate_time * 1000).to({rotation:-360}, this._rotate_time * 1000)
		}else if(this.mainPanel._basketball_speed_x > 0 && this._tweenDir < 0){
			this._tweenDir = 1;
			egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:180}, this._rotate_time * 1000).to({rotation:360}, this._rotate_time * 1000)
		}
	}

	private _adjustBallPosition():void
	{
		if(this.mainPanel.m_basket_ball.x < 0 - this.mainPanel.m_basket_ball.width){ //超出了左边边界
			this.mainPanel.m_basket_ball.x += this.mainPanel.stage.stageWidth
		} else if(this.mainPanel.m_basket_ball.x > this.mainPanel.stage.stageWidth) { //超出了右边边界
			this.mainPanel.m_basket_ball.x -= this.mainPanel.stage.stageWidth
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
		this._last_x = this.m_basket_ball.x
		this._last_y = this.m_basket_ball.y
		if(last_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || last_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10)
		{
			return false;
		}

		let current_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x, secondPoint.y);
		let current_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x + this.m_basket_ball.width, secondPoint.y + this.m_basket_ball.height);
		if(current_global_ball_left_top_point.x < global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > global_circle_scope_right_down_point.x + 10)
		{
			return false;

		}
		let global_circle_center_point = new egret.Point((global_circle_scope_left_top_point.x + global_circle_scope_right_down_point.x) / 2, (global_circle_scope_left_top_point.y + global_circle_scope_right_down_point.y) / 2)
		if(last_global_ball_left_top_point.y <= global_circle_center_point.y && current_global_ball_left_top_point.y >= global_circle_center_point.y)
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

	public Update():void
	{

		this._updateRotationTween()
		this._adjustBallPosition()

		let delta_speed_y = this.mainPanel._gravity + this.mainPanel._current_impluse.y;
		this.mainPanel._baskball_speed_y += delta_speed_y;
		this.mainPanel._baskball_speed_y = Math.max(this.mainPanel._baskball_speed_y, -20);

		this.mainPanel._current_impluse.x = 0;
		this.mainPanel._current_impluse.y = 0

		let total_speed = Math.sqrt(Math.pow(this.mainPanel._basketball_speed_x, 2) + Math.pow(this.mainPanel._baskball_speed_y, 2));
		let step_speed = 2
		
		let times = Math.ceil(total_speed / step_speed)
		if(this._hitManager.is_next_frame_skip_times){
			times = 1;
			this._hitManager.is_next_frame_skip_times = false;
		}
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
				return
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

			// if(this._hitManager.checkHitFloor())
			// {
			// 	return
			// }

			// if(this._hitManager.checkHitBasketTopScope() || this._hitManager.checkHitBasketDownScope() || this._hitManager.checkHitBoard() || this._hitManager.checkHitBasketLeftScope())
			// {
			// 	if(this._hitManager.is_hit_resolve){
			// 		this.m_basket_ball.x = this._last_x
			// 		this.m_basket_ball.y = this._last_y
			// 		this._hitManager.is_hit_resolve = false
			// 	}
			// 	return
			// }
		}
	}
}