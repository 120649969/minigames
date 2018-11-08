class HitManager {

	private mainPanel:MainScenePanel
	private _isOnFloor:boolean = false;
	private _hitType:HitType = HitType.None
	public constructor(_mainPanel:MainScenePanel) {
		this.mainPanel = _mainPanel
	}

	public IsOnFloor():boolean
	{
		return this._isOnFloor;
	}

	public GetHitType():HitType
	{
		return this._hitType
	}

	public _getLastHitType():HitType
	{
		return this.mainPanel.GetPlayerBall().getLastHitType()
	}

	private _global_right_line_circle_point:egret.Point = new egret.Point()
	private _global_right_line_radius:number = 0;

	private _global_left_line_circle_point:egret.Point = new egret.Point()
	private _global_left_line_radius:number = 0;

	private _global_board_top_circle_point:egret.Point = new egret.Point()
	private _global_borad_top_radius:number = 0;
	
	private _global_board_down_circle_point:egret.Point = new egret.Point()
	private _global_borad_down_radius:number = 0;

	private _global_board_line_left_top_point:egret.Point = new egret.Point();
	private _global_board_line_right_down_point:egret.Point = new egret.Point()

	private _global_left_top_net_scope_point:egret.Point = new egret.Point()
	private _global_right_down_net_scope_point:egret.Point = new egret.Point()

	public EnterNextRound():void
	{
		let right_line_right_point:egret.Point = new egret.Point();
		this.mainPanel.m_right_line.parent.localToGlobal(this.mainPanel.m_right_line.x + this.mainPanel.m_right_line.width, this.mainPanel.m_right_line.y , right_line_right_point);
		let right_line_left_point:egret.Point = new egret.Point();
		this.mainPanel.m_right_line.parent.localToGlobal(this.mainPanel.m_right_line.x, this.mainPanel.m_right_line.y, right_line_left_point);

		this._global_right_line_circle_point.x = (right_line_left_point.x + right_line_right_point.x) / 2
		this._global_right_line_circle_point.y = (right_line_left_point.y + right_line_right_point.y) / 2

		if(this._global_right_line_radius == 0){
			let right_circle = Math.abs(this._global_right_line_circle_point.x - right_line_left_point.x)
			this._global_right_line_radius = right_circle
		}

		let left_line_right_point:egret.Point = new egret.Point();
		this.mainPanel.m_left_line.parent.localToGlobal(this.mainPanel.m_left_line.x + this.mainPanel.m_left_line.width, this.mainPanel.m_left_line.y , left_line_right_point);
		let left_line_left_point:egret.Point = new egret.Point();
		this.mainPanel.m_left_line.parent.localToGlobal(this.mainPanel.m_left_line.x, this.mainPanel.m_left_line.y, left_line_left_point);

		this._global_left_line_circle_point.x = (left_line_left_point.x + left_line_right_point.x) / 2
		this._global_left_line_circle_point.y = (left_line_left_point.y + left_line_right_point.y) / 2

		if(this._global_left_line_radius == 0){
			let left_circle = Math.abs(this._global_left_line_circle_point.x - left_line_left_point.x)
			this._global_left_line_radius = left_circle
		}

		let left_top_point:egret.Point = new egret.Point()
		this.mainPanel.m_board_top_circle.localToGlobal(0, 0, left_top_point);
		this.mainPanel.m_board_top_circle.localToGlobal(this.mainPanel.m_board_down_circle.width / 2, this.mainPanel.m_board_down_circle.height / 2, this._global_board_top_circle_point);
		if(this._global_borad_top_radius == 0){
			let left_circle = Math.abs(this._global_board_top_circle_point.x - left_top_point.x)
			this._global_borad_top_radius = left_circle
		}

		left_top_point = new egret.Point()
		this.mainPanel.m_board_down_circle.localToGlobal(0, 0, left_top_point);
		this.mainPanel.m_board_down_circle.localToGlobal(this.mainPanel.m_board_down_circle.width / 2, this.mainPanel.m_board_down_circle.height / 2, this._global_board_down_circle_point);
		if(this._global_borad_down_radius == 0){
			let left_circle = Math.abs(this._global_board_down_circle_point.x - left_top_point.x)
			this._global_borad_down_radius = left_circle
		}

		this.mainPanel.m_net_scope.localToGlobal(0, 0, this._global_left_top_net_scope_point)
		this.mainPanel.m_net_scope.localToGlobal(this.mainPanel.m_net_scope.width, this.mainPanel.m_net_scope.height, this._global_right_down_net_scope_point)
		
		this.mainPanel.m_board_scope.parent.localToGlobal(this.mainPanel.m_board_scope.x, this.mainPanel.m_board_scope.y + 20, this._global_board_line_left_top_point);
		this.mainPanel.m_board_scope.parent.localToGlobal(this.mainPanel.m_board_scope.x + this.mainPanel.m_board_scope.width, this.mainPanel.m_board_scope.y + this.mainPanel.m_board_scope.height - 20, this._global_board_line_right_down_point);
	}

	private _global_ball_circle_radius:number = 0;
	private _global_ball_left_top_point:egret.Point = new egret.Point()
	private _global_ball_right_down_point:egret.Point = new egret.Point()
	private _global_ball_center_point:egret.Point = new egret.Point()


	private _updateBallPoints():void
	{
		this.mainPanel.m_basket_ball.localToGlobal(0, 0, this._global_ball_left_top_point);
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width, this.mainPanel.m_basket_ball.width, this._global_ball_right_down_point);
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.width / 2, this._global_ball_center_point);
		this._global_ball_circle_radius = Math.abs(this._global_ball_center_point.x - this._global_ball_left_top_point.x)
	}

	public CheckHit():boolean
	{
		this._updateBallPoints()
		this._hitType = HitType.None
		if(this.CheckHitFloor())
		{
			return true
		}


		if(this.CheckHitRightCirlce())
		{
			return true;
		}


		if(this.CheckHitLeftCircle())
		{
			return true;
		}

		if(this.CheckHitBoardCircle())
		{
			return true;
		}

		if(this.CheckHitBoardLines())
		{
			return true;
		}
		return false;
	}

	private _Temp_Hit_Vec:egret.Point = new egret.Point()
	private _Temp_Dot_Vec:egret.Point = new egret.Point()

	private HandleBallHit(localBallHitPoint:egret.Point, hitType:HitType)
	{
		let restition = HitConst.getHitRestitution(hitType)
		let friction = HitConst.getHitFriction(hitType)
		
		let speed_vec = new egret.Point(this.mainPanel.GetPlayerBall().basketball_speed_x, this.mainPanel.GetPlayerBall().basketball_speed_y);

		let global_ball_center_point = this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.height / 2);
		let global_hit_point = this.mainPanel.m_basket_ball.localToGlobal(localBallHitPoint.x, localBallHitPoint.y)

		let hit_vec = this._Temp_Hit_Vec
		hit_vec.x = global_hit_point.x - global_ball_center_point.x
		hit_vec.y = global_hit_point.y - global_ball_center_point.y
		hit_vec.normalize(1)

		let dot_vallue = (speed_vec.x * hit_vec.x + speed_vec.y * hit_vec.y)
		let dot_vec = this._Temp_Dot_Vec
		dot_vec.x = dot_vallue * hit_vec.x
		dot_vec.y = dot_vallue * hit_vec.y

		let vertical_vec_x = speed_vec.x - dot_vec.x
		let vertical_vec_y = speed_vec.y - dot_vec.y

		let restitution_dot_vec_x = restition * dot_vec.x
		let restitution_dot_vec_y = restition * dot_vec.y

		let friction_vec_x = friction * vertical_vec_x
		let friction_vec_y = friction * vertical_vec_y

		let target_speed = new egret.Point(restitution_dot_vec_x + friction_vec_x, restitution_dot_vec_y + friction_vec_y)


		if(hitType != HitType.Floor){
			if(Math.abs(target_speed.x) < 1 * HitConst.Factor){  //这类调整一下速度，避免x速度太小，不能移动
				let rate = 1
				if(target_speed.x != 0){
					rate = target_speed.x / Math.abs(target_speed.x)
				}
				target_speed.x = 1 * HitConst.Factor * rate
			}

			if(target_speed.y < 0 && Math.abs(target_speed.y) < HitConst.Gravity){
				let target_y = -1 * HitConst.Gravity - 2 * HitConst.Factor
				target_speed.y = target_y
			}
		}
		this._hitType = hitType

		this.mainPanel.GetPlayerBall().basketball_speed_x = target_speed.x
		this.mainPanel.GetPlayerBall().basketball_speed_y = target_speed.y
	}

	private CheckHitFloor():boolean
	{
		let curr_y = this.mainPanel.m_basket_ball.y;
		if(curr_y >= this.mainPanel.m_floor.y - this.mainPanel.m_basket_ball.height)
		{
			this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.height), HitType.Floor);

			//掉到地上，解决x速度太快的问题。
			this.mainPanel.GetPlayerBall().basketball_speed_x = Math.max(this.mainPanel.GetPlayerBall().basketball_speed_x, -1 * HitConst.Max_Speed_X)
			this.mainPanel.GetPlayerBall().basketball_speed_x = Math.min(this.mainPanel.GetPlayerBall().basketball_speed_x, HitConst.Max_Speed_X)

			if(this.mainPanel.HasThisRoundTouch() && !this.mainPanel.HasGoal()){
				if(this.mainPanel.IsFaceLeft()){
					this.mainPanel.GetPlayerBall().basketball_speed_x = HitConst.Max_Speed_X * -1;
				} else {
					this.mainPanel.GetPlayerBall().basketball_speed_x = HitConst.Max_Speed_X;
				}
			}

			//进球掉到地板上x速度太慢而停下来的问题，这里给一个小的速度
			if(this.mainPanel.HasGoal() && Math.abs(this.mainPanel.GetPlayerBall().basketball_speed_x) < 3 * HitConst.Factor){
				this.mainPanel.GetPlayerBall().basketball_speed_x = 3 * HitConst.Factor * this.mainPanel.GetPlayerBall().basketball_speed_x / Math.abs(this.mainPanel.GetPlayerBall().basketball_speed_x)
			}
			return true;
		}
		return false;
	}

	//在确保了这条线在球的矩形碰撞范围内，更具体的检测
	private _check_ball_hit_line(left_point:egret.Point, right_point:egret.Point)
	{
		let delta_y = this._global_ball_center_point.y - left_point.y
		let line_cirle_width = Math.sqrt(Math.pow(this._global_ball_circle_radius, 2) - Math.pow(delta_y, 2))
		if(this._global_ball_center_point.x > right_point.x){
			if(this._global_ball_center_point.x - right_point.x > line_cirle_width){
				return false
			}
		} else if(this._global_ball_center_point.x < left_point.x){
			if(left_point.x - this._global_ball_center_point.x > line_cirle_width){
				return false
			}
		}
		return true
	}

	/**********************新的圆形判定框  begin******************************* */

	private _Temp_Point:egret.Point = new egret.Point()
	private CheckHitBoardLines():boolean
	{
		if(!this.mainPanel.IsFaceLeft())
		{
			HitConst.SwapPointXY(this._global_board_line_left_top_point, this._global_board_line_right_down_point)
		}

		if(!this._check_ball_in_rect(this._global_board_line_left_top_point, this._global_board_line_right_down_point))
		{
			return false;
		}

		//去除x,y都满足。但是组合起来就不满足的情况
		if(this._global_ball_center_point.y > this._global_board_line_right_down_point.y)  //在下方
		{
			this._Temp_Point.x = this._global_board_line_left_top_point.x
			this._Temp_Point.y = this._global_board_line_right_down_point.y
			if(!this._check_ball_hit_line(this._Temp_Point, this._global_board_line_right_down_point))
			{
				return false
			}
		}
		else if(this._global_ball_center_point.y < this._global_board_line_left_top_point.y) //在上方
		{
			this._Temp_Point.x = this._global_board_line_right_down_point.x
			this._Temp_Point.y = this._global_board_line_left_top_point.y
			if(!this._check_ball_hit_line( this._global_board_line_left_top_point, this._Temp_Point))
			{
				return false
			}
		}
		
		//以下都满足碰撞
		let is_top = this._global_ball_center_point.y < this._global_board_line_left_top_point.y
		let is_down = this._global_ball_center_point.y > this._global_board_line_right_down_point.y
		//左右两边的碰撞
		if(this._global_ball_center_point.x < this._global_board_line_left_top_point.x || this._global_ball_center_point.x > this._global_board_line_right_down_point.x){
			let is_right = this._global_ball_center_point.x > this._global_board_line_right_down_point.x
			if(is_right){
				this.HandleBallHit(new egret.Point(0, this.mainPanel.m_basket_ball.height / 2), HitType.Board_Left_Right)
			}else{
				this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width, this.mainPanel.m_basket_ball.height / 2), HitType.Board_Left_Right)
			}
			return true;
		}
		return false;
	}

	private CheckHitBoardCircle():boolean
	{
		let distance = Math.sqrt(Math.pow(this._global_ball_center_point.x - this._global_board_top_circle_point.x, 2) + Math.pow(this._global_ball_center_point.y - this._global_board_top_circle_point.y, 2))
		if(distance <= this._global_borad_top_radius + this._global_ball_circle_radius){
			let hit_vec = new egret.Point(this._global_board_top_circle_point.x - this._global_ball_center_point.x, this._global_board_top_circle_point.y - this._global_ball_center_point.y)
			hit_vec.normalize(1)

			let global_hit_point = new egret.Point(this._global_ball_center_point.x + hit_vec.x * this._global_ball_circle_radius, this._global_ball_center_point.y + hit_vec.y * this._global_ball_circle_radius)
			let local_hit_point = new egret.Point()
			this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)

			this.HandleBallHit(local_hit_point, HitType.Board_Top);
			return true
		}

		distance = Math.sqrt(Math.pow(this._global_ball_center_point.x - this._global_board_down_circle_point.x, 2) + Math.pow(this._global_ball_center_point.y - this._global_board_down_circle_point.y, 2))
		if(distance <= this._global_borad_down_radius + this._global_ball_circle_radius){
			let hit_vec = new egret.Point(this._global_board_down_circle_point.x - this._global_ball_center_point.x, this._global_board_down_circle_point.y - this._global_ball_center_point.y)
			hit_vec.normalize(1)

			let global_hit_point = new egret.Point(this._global_ball_center_point.x + hit_vec.x *  this._global_ball_circle_radius, this._global_ball_center_point.y + hit_vec.y *  this._global_ball_circle_radius)
			let local_hit_point = new egret.Point()
			this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)

			this.HandleBallHit(local_hit_point, HitType.Board_Top);
			return true
		}

		return false;
	}

	private CheckHitCirle(globalCenterPoint:egret.Point, circle_radius:number, hitType:HitType):boolean
	{
		let distance = Math.sqrt(Math.pow(this._global_ball_center_point.x - globalCenterPoint.x, 2) + Math.pow(this._global_ball_center_point.y - globalCenterPoint.y, 2))
		if(distance > circle_radius + this._global_ball_circle_radius){
			return false
		}

		let hit_vec = new egret.Point(globalCenterPoint.x - this._global_ball_center_point.x, globalCenterPoint.y - this._global_ball_center_point.y)
		hit_vec.normalize(1)

		let global_hit_point = new egret.Point(this._global_ball_center_point.x + hit_vec.x * this._global_ball_circle_radius, this._global_ball_center_point.y + hit_vec.y * this._global_ball_circle_radius)
		let local_hit_point = new egret.Point()
		this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)

		this.HandleBallHit(local_hit_point, hitType);

		return true;
	}

	private CheckHitRightCirlce():boolean
	{
		return this.CheckHitCirle(this._global_right_line_circle_point, this._global_right_line_radius, HitType.Right_Line)
	}

	private CheckHitLeftCircle():boolean
	{
		return this.CheckHitCirle(this._global_left_line_circle_point, this._global_left_line_radius, HitType.Left_Line)
	}

	/**********************新的圆形判定框  end******************************* */

	private _check_ball_in_rect(left_top_point:egret.Point, right_down_point:egret.Point):boolean
	{
		//is right ok
		if(this._global_ball_left_top_point.x > right_down_point.x)
		{
			return false;
		}
		//is left ok
		if(this._global_ball_right_down_point.x < left_top_point.x)
		{
			return false;
		}

		//is top ok
		if(this._global_ball_right_down_point.y < left_top_point.y)
		{
			return false;
		}

		//is down ok
		if(this._global_ball_left_top_point.y > right_down_point.y)
		{
			return false;
		}

		return true
	}

	public CheckHitNet():HitNetType
	{
		if(!this.mainPanel.IsFaceLeft())
		{
			HitConst.SwapPointXY(this._global_left_top_net_scope_point, this._global_right_down_net_scope_point)
		}

		if(!this._check_ball_in_rect(this._global_left_top_net_scope_point, this._global_right_down_net_scope_point))
		{
			return  HitNetType.NONE
		}

		if(this._global_ball_center_point.x < this._global_left_top_net_scope_point.x){
			return HitNetType.LEFT
		}

		if(this._global_ball_center_point.x > this._global_right_down_net_scope_point.x){
			return HitNetType.RIGHT
		}

		return HitNetType.CENTER
	}
}