class PlayerBall {

	public m_basket_ball : eui.Group
	public mainPanel : MainScenePanel

	private _hitManager:HitManager
	private _tweenDir:number = 0

	private _rotate_time = 0.8
	private _last_hit_type = HitType.None
	private _push_acce_y:number = 0

	public basketball_speed_x:number = 0.0
	public basketball_speed_y:number = 0.0

	public _clear_hit_timer:egret.Timer
	public _recent_hit:boolean = false

	private _smokeEffect:SmokeEffect
	private _fireEffect:FireEffect

	public constructor(_ball:eui.Group, _mainPanel:MainScenePanel) {
		this.m_basket_ball = _ball
		this.mainPanel = _mainPanel
		this._hitManager = _mainPanel.GetHitManager()
		this._smokeEffect = new SmokeEffect(this)
		this._fireEffect = new FireEffect(this)
	}

	public Restart():void
	{
		this._restartHitTimer()
		
		this._last_hit_type = HitType.None
		this.basketball_speed_x = 0
		this.basketball_speed_y = 0
		this._push_acce_y = 0
		this._tweenDir = 0
		egret.Tween.removeTweens(this.mainPanel.m_image_ball)
		this.mainPanel.m_image_ball.rotation = 0
	}

	private _currentAfterImageType:AfterImageType = AfterImageType.None
	public SetUsingAfterImageType(type:AfterImageType):void
	{
		if(this._currentAfterImageType == type)
		{
			return
		}

		this._currentAfterImageType = type
	}

	private _restartHitTimer()
	{
		if(this._clear_hit_timer){
			this._clear_hit_timer.stop()
			this._clear_hit_timer.start()
			return
		}
		this._clear_hit_timer = new egret.Timer(2000)
		this._clear_hit_timer.addEventListener(egret.TimerEvent.TIMER,this._clearHitTick,this);
	}

	//2秒后自动清理碰撞信息
	private _clearHitTick():void
	{
		this._recent_hit = false
	}

	private _updateAfterImage():void
	{
		if(this._currentAfterImageType == AfterImageType.Smoke){
			this._smokeEffect.Update(true)
		} else {
			this._smokeEffect.Update(false)
		}
		
		if(this._currentAfterImageType == AfterImageType.Fire){
			this._fireEffect.Update(true)
		} else {
			this._fireEffect.Update(false)
		}
	}

	private _updateRotationTween():void
	{
		if(!this.mainPanel.HasTouchBegin()){
			return
		}
		if(this._tweenDir == 0){
			if(this.basketball_speed_x < 0){
				egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:-180}, this._rotate_time * 1000).to({rotation:-360}, this._rotate_time * 1000)
				this._tweenDir = -1
			} else{
				egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:180}, this._rotate_time * 1000).to({rotation:360}, this._rotate_time * 1000)
				this._tweenDir = 1
			}
			return
		}
		if(this.basketball_speed_x < 0 && this._tweenDir > 0){
			this.mainPanel.m_image_ball.rotation = 0
			this._tweenDir = -1;
			egret.Tween.removeTweens(this.mainPanel.m_image_ball)
			egret.Tween.get(this.mainPanel.m_image_ball, {loop:true}).to({rotation:-180}, this._rotate_time * 1000).to({rotation:-360}, this._rotate_time * 1000)
		}else if(this.basketball_speed_x > 0 && this._tweenDir < 0){
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
			this.mainPanel.m_basket_ball.x = target_x
		}
	}

	private _adjustSpeed():void
	{
		if(!this.mainPanel.HasThisRoundTouch() || this.mainPanel.HasGoal()){
			return
		}
		if(this.mainPanel.IsFaceLeft()){
			if(this.basketball_speed_x > HitConst.Max_Speed_X * -1){
				this.basketball_speed_x -= HitConst.Frame_Speed_X
			}
			this.basketball_speed_x = Math.max(this.basketball_speed_x, HitConst.Max_Speed_X * -1)
		} else {
			if(this.basketball_speed_x < HitConst.Max_Speed_X){
				this.basketball_speed_x += HitConst.Frame_Speed_X
			}
			this.basketball_speed_x = Math.min(this.basketball_speed_x, HitConst.Max_Speed_X)
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

	public EnterNextRound():void
	{
	}

	public OnPushDown():void
	{
		if(this.basketball_speed_y > 0)
		{
			this.basketball_speed_y = 0;
		}
		this._push_acce_y = HitConst.PUSH_DOWN_IMPLUSE_Y
		this.basketball_speed_x = HitConst.Max_Speed_X * (this.mainPanel.IsFaceLeft() ? -1 : 1)
	}

	private _check_this_move_goal(last_x:number, last_y:number):boolean
	{
		let has_goal = this._checkGoal(new egret.Point(last_x, last_y), new egret.Point(this.m_basket_ball.x, this.m_basket_ball.y))
		if(!this.mainPanel.HasGoal() && has_goal){
			if(this._recent_hit){
				this.mainPanel.SetGoal(true, BasketScore.NORMAL_GOAL)
			} else {
				this.mainPanel.SetGoal(true, BasketScore.KONG_XING_GOAL)
			}
					
			// if(Math.floor(Math.random() * 2) == 0){
				// this.SetUsingAfterImageType(AfterImageType.Fire)
			// }
		}
		if(has_goal){
			if(this._recent_hit){
				this.mainPanel.PlayGoalAnimation()
			} else {
				this.mainPanel.PlayKongXingAnimation()
			}
		}
		return false;
	}

	public Update():void
	{
		
		this._adjustSpeed();
		this._updateRotationTween()
		this._adjustBallPosition()
		
		let start_speed_y = this.basketball_speed_y
		let acce_speed_y = HitConst.Gravity + this._push_acce_y  //y方向的加速度
		this.basketball_speed_y += acce_speed_y;
		this.basketball_speed_y = Math.max(this.basketball_speed_y, HitConst.MIN_SPEED_Y)
		this._push_acce_y = 0 //重置瞬间加速度

		let total_speed = Math.sqrt(Math.pow(this.basketball_speed_x, 2) + Math.pow(this.basketball_speed_y, 2)) / HitConst.Factor
		let step_speed = 2
		
		let times = Math.ceil(total_speed / step_speed)
		let step_speend_x = this.basketball_speed_x / times
		let step_speend_y = this.basketball_speed_y / times
		
		//篮球此刻是否在判断入网的x范围
		let is_current_in_circle_scope = this._isCurrentInCricleScope()
		for(let step_idx = 1; step_idx <= times; step_idx++)
		{
			let temp_last_x = this.m_basket_ball.x
			let temp_last_y = this.m_basket_ball.y
			this.m_basket_ball.x += step_speend_x / HitConst.Factor

			if(this.m_basket_ball.y < this.mainPanel.m_floor.y - this.m_basket_ball.height - 30){
				let start_y = start_speed_y + (step_idx - 1) * step_speend_y
				let end_y = start_speed_y + (step_idx) * step_speend_y
				this.m_basket_ball.y += (start_y + end_y) / 2 / HitConst.Factor / times;
				// if(Math.abs((start_y + end_y) / 2 / HitConst.Factor / times) > 4){
				// 	console.log("###这次的速度#########", (start_y + end_y) / 2 / HitConst.Factor / times)
				// }
			} else {
				this.m_basket_ball.y += step_speend_y / HitConst.Factor
			}
			
			let hit_result = this._hitManager.CheckHit()
			if(hit_result){
				this.m_basket_ball.x = temp_last_x
				this.m_basket_ball.y = temp_last_y
				
				if(this._hitManager.GetHitType() !=  HitType.Floor){
					//如果不是和地面碰撞，沿着球的新速度方向移动至少5个像素，而且x，y两个方向最少移动2个像素，保证分离
					let percent = (times - step_idx) / times
					let new_total_speed = Math.sqrt(Math.pow(this.basketball_speed_x, 2) + Math.pow(this.basketball_speed_y, 2)) / HitConst.Factor;
					if(percent == 0){
						percent = 1
					}
					new_total_speed *= percent
					let copy_new_total_speed = new_total_speed
					if(copy_new_total_speed < 5){
						copy_new_total_speed = 5
					}
					let delta_x = (this.basketball_speed_x * percent / HitConst.Factor)  * copy_new_total_speed / new_total_speed
					let delta_y = (this.basketball_speed_y * percent / HitConst.Factor) * copy_new_total_speed / new_total_speed
					if(Math.abs(delta_x) < 2 && delta_x!= 0){
						delta_x = delta_x / Math.abs(delta_x) * 2
					}
					if(Math.abs(delta_y) < 2 && delta_y!= 0){
						delta_y = delta_y / Math.abs(delta_y) * 2
					}
					temp_last_x = this.m_basket_ball.x
					temp_last_y = this.m_basket_ball.y
					this.m_basket_ball.x += delta_x  
					this.m_basket_ball.y += delta_y
					if(is_current_in_circle_scope)
					{
						this._check_this_move_goal(temp_last_x, temp_last_y)
					}
				}
				break
			}

			if(is_current_in_circle_scope)
			{
				this._check_this_move_goal(temp_last_x, temp_last_y)
			}
		}

		// console.log("######", this.mainPanel.m_basket_ball.x, this.mainPanel.m_basket_ball.y, this.basketball_speed_x, this.basketball_speed_y)
		//掉在地板上，因为和地板碰撞，上面的碰撞过程不会移动位置。但是x方向是需要移动位置的。所以在这里处理一下
		if(this._hitManager.GetHitType() == HitType.Floor){  
			this.m_basket_ball.x += this.basketball_speed_x / HitConst.Factor
		}
		this._last_hit_type = this._hitManager.GetHitType()

		let thisHitType = this._hitManager.GetHitType()

		if(thisHitType != HitType.None)
		{
			this._recent_hit = true
			this._restartHitTimer()
		}

		if(thisHitType == HitType.Left_Line || thisHitType == HitType.Right_Line)
		{
			this.mainPanel.PlayShakeAnimation()
		}

		let hitNetType = this._hitManager.CheckHitNet()
		if(hitNetType != HitNetType.NONE)
		{
			this.mainPanel.PlayNetAnimation(hitNetType)
		}

		this._updateAfterImage()
	}

	public getLastHitType():HitType
	{
		return this._last_hit_type
	}

	//更新当前的残影类型
	public UpdateCurrentAfterImage():void
	{
		let allScores = this.mainPanel.GetAllScores()
		let last_score = allScores[allScores.length - 1]
		if(last_score == BasketScore.NORMAL_GOAL){
			if(this._currentAfterImageType != AfterImageType.None){
				this.SetUsingAfterImageType(AfterImageType.None)
			}else{
				if(Math.floor(Math.random() * 3) == 0){
					this.SetUsingAfterImageType(AfterImageType.Smoke)
				}
			}
		} else {
			if(this._currentAfterImageType == AfterImageType.None){
				this.SetUsingAfterImageType(AfterImageType.Smoke)
			}else{
				let kongxing_count = 0
				for(let index = allScores.length - 2; index >= 0; index--)
				{
					if(allScores[index] == BasketScore.KONG_XING_GOAL){
						kongxing_count++
					} else {
						break
					}
				}
				if(kongxing_count >= 2){
					this.SetUsingAfterImageType(AfterImageType.Fire)
					this._fireEffect.SetFireStep(FireStep.Step_2)
				} else {
					this.SetUsingAfterImageType(AfterImageType.Fire)
					this._fireEffect.SetFireStep(FireStep.Step_1)
				}
			}
		}
	}
}