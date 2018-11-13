class PlayerBall {

	public m_basket_ball : eui.Group
	public mainPanel : ui.MainScenePanel

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

	public constructor(_ball:eui.Group, _mainPanel:ui.MainScenePanel) {
		this.m_basket_ball = _ball
		this.mainPanel = _mainPanel
		this._hitManager = _mainPanel.GetHitManager()
		this._smokeEffect = new SmokeEffect(this)
		this._fireEffect = new FireEffect(this)
	}

	public GetMainScenePanel():ui.MainScenePanel
	{
		return this.mainPanel
	}

	public Restart():void
	{
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

	public GetUsingAfterImageType():AfterImageType
	{
		return this._currentAfterImageType
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
		let global_ball_left_top_point = new egret.Point()
		this.mainPanel.m_basket_ball.localToGlobal(0, 0, global_ball_left_top_point);

		let is_change_pos = false
		let target_x = 0
		if(global_ball_left_top_point.x < 0 - this.mainPanel.m_basket_ball.width){ //超出了左边边界
			target_x = global_ball_left_top_point.x + this.mainPanel.stage.stageWidth
			is_change_pos = true
		} else if(global_ball_left_top_point.x > this.mainPanel.stage.stageWidth) { //超出了右边边界
			target_x = global_ball_left_top_point.x - this.mainPanel.stage.stageWidth
			is_change_pos = true
		}
		
		if(is_change_pos){
			this.mainPanel.m_basket_ball.x = target_x
		}
	}

	private _adjustShadowPosition():void
	{
		let delta_y = Math.abs(this.mainPanel.m_basket_ball.y - this.mainPanel.m_floor.y)
		let max_delta_y = Math.abs(this.mainPanel.m_top.y - this.mainPanel.m_floor.y)
		let percent = (max_delta_y - delta_y + 1500) / (max_delta_y + 1500)
		this.mainPanel.img_shadow.scaleX = this.mainPanel.img_shadow.scaleY = percent
		this.mainPanel.img_shadow.x = this.mainPanel.m_basket_ball.x + this.mainPanel.m_basket_ball.width / 2
		this.mainPanel.img_shadow.y = this.mainPanel.m_floor.y
	}

	//现在风速为0
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
		
		let last_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(firstPoint.x,firstPoint.y);
		let last_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(firstPoint.x + this.m_basket_ball.width, firstPoint.y + this.m_basket_ball.height)
		let last_global_ball_center_point = new egret.Point((last_global_ball_left_top_point.x + last_global_ball_right_down_point.x) / 2, (last_global_ball_left_top_point.y + last_global_ball_right_down_point.y) / 2)
		if(last_global_ball_left_top_point.x < this._global_circle_scope_left_top_point.x - 10 || last_global_ball_right_down_point.x > this._global_circle_scope_right_down_point.x + 10)
		{
			return false;
		}

		let current_global_ball_left_top_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x, secondPoint.y);
		let current_global_ball_right_down_point = this.mainPanel.m_basket_ball.parent.localToGlobal(secondPoint.x + this.m_basket_ball.width, secondPoint.y + this.m_basket_ball.height);
		let current_global_ball_center_point = new egret.Point((current_global_ball_left_top_point.x + current_global_ball_right_down_point.x) / 2, (current_global_ball_left_top_point.y + current_global_ball_right_down_point.y) / 2)
		if(current_global_ball_left_top_point.x < this._global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > this._global_circle_scope_right_down_point.x + 10)
		{
			return false;
		}
		if(last_global_ball_center_point.y <= this._global_circle_scope_center_point.y && current_global_ball_center_point.y >= this._global_circle_scope_center_point.y)
		{
			console.log("#########进球了###")
			return true;
		}
		return false;
	}

	private _isCurrentInCricleScope():boolean
	{
		let current_global_ball_left_top_point = this.mainPanel.m_basket_ball.localToGlobal(0, 0);
		let current_global_ball_right_down_point = this.mainPanel.m_basket_ball.localToGlobal(this.m_basket_ball.width, this.m_basket_ball.height);
		if(current_global_ball_left_top_point.x < this._global_circle_scope_left_top_point.x - 10 || current_global_ball_right_down_point.x > this._global_circle_scope_right_down_point.x + 10)
		{
			return false
		}
		return true;
	}

	private _global_circle_scope_left_top_point:egret.Point = new egret.Point()
	private _global_circle_scope_right_down_point:egret.Point =  new egret.Point()
	private _global_circle_scope_center_point:egret.Point = new egret.Point()
	
	public EnterNextRound():void
	{
		this._global_circle_scope_left_top_point = this.mainPanel.m_circle_scope.localToGlobal(0, 0)
		this._global_circle_scope_right_down_point = this.mainPanel.m_circle_scope.localToGlobal(this.mainPanel.m_circle_scope.width, this.mainPanel.m_circle_scope.height)

		if(!this.mainPanel.IsFaceLeft())
		{
			HitConst.SwapPointXY(this._global_circle_scope_left_top_point, this._global_circle_scope_right_down_point)
		}

		this._global_circle_scope_center_point.x = (this._global_circle_scope_left_top_point.x + this._global_circle_scope_right_down_point.x) / 2
		this._global_circle_scope_center_point.y = (this._global_circle_scope_left_top_point.y + this._global_circle_scope_right_down_point.y) / 2
	}

	public OnGameOver():void
	{
		if(this._smokeEffect)
		{
			this._smokeEffect.visible = false
		}
		if(this._fireEffect)
		{
			this._fireEffect.visible = false
		}
	}

	public OnPushDown():void
	{
		if(this.basketball_speed_y > 0)
		{
			this.basketball_speed_y = 0;
		}
		this._push_acce_y = HitConst.PUSH_DOWN_IMPLUSE_Y
		this.basketball_speed_x = HitConst.Max_Speed_X * (this.mainPanel.IsFaceLeft() ? -1 : 1)
		this._recent_hit = false
	}

	//计算分数
	private _calcuteScore():number
	{
		if(this._recent_hit)
		{
			return BasketScore.NORMAL_GOAL
		}

		let last_score = 0
		let all_scores = this.mainPanel.GetAllScores()
		if(all_scores.length > 0){
			last_score = all_scores[all_scores.length - 1]
		}
		if(last_score == BasketScore.KONG_XING_GOAL || last_score == BasketScore.LIANXU_KONG_XING_GOAL)
		{
			return BasketScore.LIANXU_KONG_XING_GOAL
		}
		return BasketScore.KONG_XING_GOAL
	}

	private _check_this_move_goal(last_x:number, last_y:number):boolean
	{
		let has_goal = this._checkGoal(new egret.Point(last_x, last_y), new egret.Point(this.m_basket_ball.x, this.m_basket_ball.y))
		if(!this.mainPanel.HasGoal() && has_goal){
			let get_score = this._calcuteScore()
			if(this._recent_hit){
				if(this._currentAfterImageType == AfterImageType.Smoke){
					this._smokeEffect.SetGoal(get_score)
				}
				this.mainPanel.SetGoal(true, get_score)
			} else {
				if(this._currentAfterImageType == AfterImageType.Fire){
					this._fireEffect.SetGoal(get_score)
				}
				this.mainPanel.SetGoal(true, get_score)
			}
		}
		if(has_goal){
			if(this._recent_hit){
				this.mainPanel.PlayGoalAnimation()
			} else {
				this.mainPanel.PlayKongXingAnimation()
			}
			this._playJoinSound()
		}
		return false;
	}

	private last_speed_y = 0
	public Update():void
	{
		
		this._adjustSpeed();
		this._updateRotationTween()
		this._adjustBallPosition()
		this._adjustShadowPosition()

		this.last_speed_y = this.basketball_speed_y
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
		

		let thisHitType = this._hitManager.GetHitType()

		this._playHitSound(thisHitType)

		if(thisHitType != HitType.None && thisHitType != HitType.Board_Left_Right && thisHitType != HitType.Board_Top)
		{
			this._recent_hit = true
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
		this._last_hit_type = thisHitType
	}

	//碰撞的声音
	public _playHitSound(hitType:HitType):void
	{
		if(hitType == HitType.None){
			return
		}
		if(hitType == HitType.Right_Line || hitType == HitType.Left_Line)
		{
			SoundManager.getInstance().playSound("hit_board_mp3")
			return
		}

		if(hitType == HitType.Floor && this._last_hit_type == HitType.None && this.last_speed_y > 0 && Math.abs(this.last_speed_y) > 2 * HitConst.Factor)
		{
			SoundManager.getInstance().playSound("hit_floor_mp3")
			return
		}

	}

	public _playJoinSound():void
	{
		if(this._recent_hit){
			SoundManager.getInstance().playSound("hit_board_join_mp3")
		} else {
			SoundManager.getInstance().playSound("kongxing_join_mp3")
		}
	}

	public getLastHitType():HitType
	{
		return this._last_hit_type
	}

	//更新当前的残影类型
	//显示分数和combo
	public UpdateCurrentAfterImage():void
	{
		let allScores = this.mainPanel.GetAllScores()
		let last_score = allScores[allScores.length - 1]
		if(last_score == BasketScore.NORMAL_GOAL){
			this.SetUsingAfterImageType(AfterImageType.None)
			this.mainPanel.ShowScoreAnimation(BasketScore.NORMAL_GOAL, 1)
		} else {
			if(this._currentAfterImageType == AfterImageType.None){
				this.SetUsingAfterImageType(AfterImageType.Smoke)
				this.mainPanel.ShowScoreAnimation(BasketScore.KONG_XING_GOAL, 1)
			}else{
				let kongxing_count = 1
				for(let index = allScores.length - 2; index >= 0; index--)
				{
					if(allScores[index] == BasketScore.KONG_XING_GOAL || allScores[index] == BasketScore.LIANXU_KONG_XING_GOAL){
						kongxing_count++
					} else {
						break
					}
				}
				if(kongxing_count > 1){
					this.SetUsingAfterImageType(AfterImageType.Fire)
					this._fireEffect.SetFireStep(FireStep.Step_2)
				} else {
					this.SetUsingAfterImageType(AfterImageType.Fire)
					this._fireEffect.SetFireStep(FireStep.Step_1)
				}

				if(kongxing_count > 1){
					this.mainPanel.ShowComboAnimation(kongxing_count)
					this.mainPanel.ShowScoreAnimation(BasketScore.LIANXU_KONG_XING_GOAL, kongxing_count)
				} else {
					this.mainPanel.ShowScoreAnimation(BasketScore.KONG_XING_GOAL, 1)
				}
			}
		}
	}
}