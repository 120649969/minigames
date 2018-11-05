class HitManager {

	public mainPanel:MainScenePanel;
	private _isOnFloor:boolean;
	private _floorRestitution:number = 0.7; //地面反弹系数
	private m_basket_ball:eui.Group
	private m_basket_container:eui.Group
	private m_board_scope:eui.Group
	private m_skip_board_scope:eui.Group
	private _ballCircleRadius:number
	private m_right_scope:eui.Group
	private m_left_scope:eui.Group

	public is_hit_resolve:boolean;
	public is_next_frame_skip_times:boolean;

	public constructor(_mainPanel:MainScenePanel) {
		this.mainPanel = _mainPanel
		this.m_basket_ball = this.mainPanel.m_basket_ball
		this.m_basket_container = this.mainPanel.m_basket_container
		this.m_board_scope = this.mainPanel.m_board_scope
		this.m_skip_board_scope = this.mainPanel.m_skip_board_scope
		this.m_right_scope = this.mainPanel.m_right_scope
		this.m_left_scope = this.mainPanel.m_left_scope

		this._isOnFloor = false;

		this._ballCircleRadius = 25
	}


	//碰撞地板
	public checkHitFloor():boolean
	{
		let curr_y = this.mainPanel.m_basket_ball.y;
		if(curr_y >= this.mainPanel.m_floor.y - this.mainPanel.m_basket_ball.height * this.mainPanel.m_basket_ball.scaleY / 2.0)
		{
			if(this._isOnFloor)  //一直在地面上
			{
				return true;
			}
			//处理反弹
			let new_speed_y = this.mainPanel._baskball_speed_y * this._floorRestitution * -1;
			if(Math.abs(new_speed_y) <= 0.3)
			{
				new_speed_y = 0;
				this._isOnFloor = true
			}
			this.mainPanel._baskball_speed_y = new_speed_y;
			this.mainPanel._basketball_speed_x = 0;
			return true;
		}
		this._isOnFloor = false;
		
		return false;
	}

	//碰撞挡板
	public checkHitBoard():boolean
	{
		let global_ball_center_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);

		let board_scope_left_top_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y, board_scope_left_top_point);
		let board_scope_right_down_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_board_scope.x + this.m_board_scope.width, this.m_board_scope.y + this.m_board_scope.height, board_scope_right_down_point);

		let skip_board_scope_left_top_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_skip_board_scope.x, this.m_skip_board_scope.y, skip_board_scope_left_top_point);
		let skip_board_scope_right_down_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_skip_board_scope.x + this.m_skip_board_scope.width, this.m_board_scope.y + this.m_board_scope.height, skip_board_scope_right_down_point);

		//x无效范围
		if(global_ball_center_point.x > board_scope_right_down_point.x + this._ballCircleRadius || global_ball_center_point.x < board_scope_left_top_point.x - this._ballCircleRadius)
		{
			return false;
		}
		
		//y无效范围
		if(global_ball_center_point.y > board_scope_right_down_point.y + this._ballCircleRadius || global_ball_center_point.y < board_scope_left_top_point.y - this._ballCircleRadius)
		{
			return false
		}
		if(global_ball_center_point.y < skip_board_scope_left_top_point.y) //在挡板的上半部分附近
		{
			let top_line_circle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(global_ball_center_point.y - board_scope_left_top_point.y, 2));
			if(global_ball_center_point.x < board_scope_left_top_point.x){
				if(board_scope_left_top_point.x - global_ball_center_point.x > top_line_circle_width) //左边圆和矩形没有相交
				{
					return false
				}
			} else if(global_ball_center_point.x > board_scope_right_down_point.x){
				if(global_ball_center_point.x - board_scope_right_down_point.x > top_line_circle_width)//右边圆和矩形没有相交
				{
					return false
				}
			}

			this.is_hit_resolve = true;
			//处理上面相交过程
			if(this.mainPanel._basketball_speed_x > 0){ //可以反弹
				if(this.mainPanel._baskball_speed_y < 0){
					this.is_hit_resolve = false;
					return false;
				}
				this.mainPanel._basketball_speed_x *= 0.7;
				this.mainPanel._baskball_speed_y *= -0.7;
			} else if(this.mainPanel._basketball_speed_x == 0){
				this.mainPanel._basketball_speed_x = 5;
			} else if(this.mainPanel._basketball_speed_x < 0){
				this.mainPanel._basketball_speed_x = -3;
				this.mainPanel._baskball_speed_y = -10;
				this.is_next_frame_skip_times = true
			}

			return true;
		}

		if(global_ball_center_point.y > board_scope_right_down_point.y) //在挡板的底部附近
		{
			let down_line_circle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(global_ball_center_point.y - board_scope_right_down_point.y, 2));
			if(global_ball_center_point.x < board_scope_left_top_point.x){
				if(board_scope_left_top_point.x - global_ball_center_point.x > down_line_circle_width) //左边圆和矩形没有相交
				{
					return false
				}
			} else if(global_ball_center_point.x > board_scope_right_down_point.x){
				if(global_ball_center_point.x - board_scope_right_down_point.x > down_line_circle_width)//右边圆和矩形没有相交
				{
					return false
				}
			}

			this.is_hit_resolve = true;

			
			if(this.mainPanel._basketball_speed_x == 0){
				if(global_ball_center_point.x > board_scope_right_down_point.x){
					this.mainPanel._basketball_speed_x = 5.0;
				} else if(global_ball_center_point.x < board_scope_left_top_point.x) {
					this.mainPanel._basketball_speed_x = -5.0
				}
				this.mainPanel._baskball_speed_y *= -0.7;  //直接反弹
			} else {
				this.mainPanel._baskball_speed_y *= -1;  //直接反弹
			}
			return true;
		}

		//下面就是碰撞左右两边了
		this.is_hit_resolve = true;
		this.mainPanel._basketball_speed_x *= -1;
		return true;
	}


	//碰撞前沿的顶部
	public checkHitBasketTopScope():boolean
	{
		let global_ball_center_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);

		let right_scope_left_top_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_right_scope.x, this.m_right_scope.y, right_scope_left_top_point);
		let right_scope_right_down_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_right_scope.x + this.m_right_scope.width, this.m_right_scope.y + this.m_right_scope.height, right_scope_right_down_point);

		if(global_ball_center_point.y < right_scope_left_top_point.y) {  
			//上方，框的顶部，只有圆的下方才能和顶部碰撞，圆的上方就算和顶部碰撞了，也视作为左右两侧的碰撞

			//去除x没在范围的情况
			if(global_ball_center_point.x > right_scope_right_down_point.x + this._ballCircleRadius){
				return false
			} else if(global_ball_center_point.x < right_scope_left_top_point.x - this._ballCircleRadius) {
				return false
			}

			//去除y没在范围的情况
			let delta_y = right_scope_left_top_point.y - global_ball_center_point.y
			if(delta_y > this._ballCircleRadius){  //没有碰撞
				return false
			}else {
				//这里去没有相交的情况
				//去除y在范围，x在范围 但是不符合矩形和圆相交的情况
				let top_line_cirle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(delta_y, 2))
				if(global_ball_center_point.x > right_scope_right_down_point.x){
					if(global_ball_center_point.x - right_scope_right_down_point.x > top_line_cirle_width){
						return false
					}
				} else if(global_ball_center_point.x < right_scope_left_top_point.x){
					if(right_scope_left_top_point.x - global_ball_center_point.x > top_line_cirle_width){
						return false
					}
				}
			}
			
			if (delta_y > this._ballCircleRadius / 2) { //碰到了圆的下方，且靠近圆的底部
				this.is_hit_resolve = true
				//此时需要根据碰撞的具体位置来判断
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
					if(this.mainPanel._basketball_speed_x < 0){ //从右上左的运动
						if(this.mainPanel._baskball_speed_y < 0){
							return false;
						}
						let _rate = Math.abs(this.mainPanel._baskball_speed_y / this.mainPanel._basketball_speed_x)
						if(Math.abs(this.mainPanel._basketball_speed_x) < 3){  //如果x速度过小，反弹或者直接给一个向右的速度
							if(_rate > 1){ //陡峭就反弹
								this.mainPanel._basketball_speed_x = 5;
								this.mainPanel._baskball_speed_y *= -0.7;
							} else {
								this.mainPanel._basketball_speed_x = 5;
								this.mainPanel._baskball_speed_y *= 0.7;
							}
						}else{
							if(_rate  >= 1) { // 比较陡峭的方式来碰撞，往上反弹
								this.mainPanel._basketball_speed_x *= 0.7;
								this.mainPanel._baskball_speed_y *= -0.7;
							} else { //比较平缓的方式来碰撞，往右反弹
								this.mainPanel._basketball_speed_x *= -0.7;
								this.mainPanel._baskball_speed_y *= 0.7;
							}
							this.mainPanel._basketball_speed_x = Math.min(this.mainPanel._basketball_speed_x, -5)
							if(Math.abs(this.mainPanel._baskball_speed_y) < 5){
								this.mainPanel._baskball_speed_y = this.mainPanel._baskball_speed_y / Math.abs(this.mainPanel._baskball_speed_y) * 5
							}
						}
					} else { //从左向右的运动，这个时候需要给球加一个向右的速度
						if(this.mainPanel._basketball_speed_x == 0){
							this.mainPanel._basketball_speed_x  = 5;
						} else {
							this.mainPanel._basketball_speed_x = Math.max(this.mainPanel._basketball_speed_x, 5)
						}
						this.mainPanel._baskball_speed_y *= -0.7;
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左上方的角
					if(this.mainPanel._basketball_speed_x < 0){ //从右往左运动
						let _rate = Math.abs(this.mainPanel._baskball_speed_y / this.mainPanel._basketball_speed_x)
						if(_rate >= 1){ //比较陡峭的方式来碰撞，往上反弹
							this.mainPanel._basketball_speed_x *= 0.7;
							this.mainPanel._baskball_speed_y *= -0.7;
						} else { //比较平缓的方式来碰撞，往右反弹
							this.mainPanel._basketball_speed_x *= -0.7;
							this.mainPanel._baskball_speed_y *= 0.7;
						}
					} else { //从左向右的运动，这个时候需要给球加一个向左的速度
						if(this.mainPanel._basketball_speed_x == 0){
							this.mainPanel._basketball_speed_x = -5;
							this.mainPanel._baskball_speed_y *= 0.7;
						} else {
							this.mainPanel._basketball_speed_x *= -0.7;
							this.mainPanel._baskball_speed_y *= 0.7;
						}
						this.mainPanel._basketball_speed_x = Math.max(this.mainPanel._basketball_speed_x, -5)
					}
				} else if(global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) { //碰到了顶部的线
					if(this.mainPanel._basketball_speed_x == 0){
						this.mainPanel._basketball_speed_x = 5;
					} else {
						this.mainPanel._basketball_speed_x *= 0.7;
						this.mainPanel._baskball_speed_y *= -0.7;
						this.mainPanel._basketball_speed_x = 0.7
					}
				} else{
					this.is_hit_resolve = false
					return false;
				}
				return true;
			} else {  //碰到了圆的下方，且靠近圆的中心部分。
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
					if(Math.abs(this.mainPanel._basketball_speed_x) < 3){ //一个很缓的速度
						this.mainPanel._baskball_speed_y *= -0.7;
						this.mainPanel._basketball_speed_x = 5;
					} else {
						if(this.mainPanel._basketball_speed_x < 0){ //反弹，并且减速
							this.mainPanel._basketball_speed_x *= -3;
							this.mainPanel._baskball_speed_y = 0;
						}else{
							this.mainPanel._baskball_speed_y *= -0.7;
						}
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左上方的角
					if(Math.abs(this.mainPanel._basketball_speed_x) < 3){ //一个很缓的速度
						this.mainPanel._baskball_speed_y *= -0.7;
						this.mainPanel._basketball_speed_x = -5;
					} else {
						if(this.mainPanel._basketball_speed_x > 0){ //反弹，并且减速
							this.mainPanel._basketball_speed_x *= -3;
							this.mainPanel._baskball_speed_y = 0;
						}else{
							this.mainPanel._baskball_speed_y *= -0.7;
						}
					}
				} else{
					console.error("速度过快了")
				}
				this.is_hit_resolve = true
				return true;
			}
		}
		return false;
	}


	//碰撞前沿的底部
	public checkHitBasketDownScope():boolean
	{
		let global_ball_center_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);

		let right_scope_left_top_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_right_scope.x, this.m_right_scope.y, right_scope_left_top_point);
		let right_scope_right_down_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_right_scope.x + this.m_right_scope.width, this.m_right_scope.y + this.m_right_scope.height, right_scope_right_down_point);

		if(global_ball_center_point.y > right_scope_right_down_point.y) {  
			//下方，框的底部，只有圆的上方才能和顶部碰撞，圆的下方就算和顶部碰撞了，也视作为左右两侧的碰撞

			//去除x没在范围的情况
			if(global_ball_center_point.x > right_scope_right_down_point.x + this._ballCircleRadius){
				return false
			} else if(global_ball_center_point.x < right_scope_left_top_point.x - this._ballCircleRadius) {
				return false
			}

			//去除y没在范围的情况
			let delta_y = global_ball_center_point.y - right_scope_right_down_point.y
			if(delta_y > this._ballCircleRadius){  //没有碰撞
				return false
			}else {
				//这里去没有相交的情况
				//去除y在范围，x在范围 但是不符合矩形和圆相交的情况
				let top_line_cirle_width = Math.sqrt(Math.pow(this._ballCircleRadius, 2) - Math.pow(delta_y, 2))
				if(global_ball_center_point.x > right_scope_right_down_point.x){
					if(global_ball_center_point.x - right_scope_right_down_point.x > top_line_cirle_width){
						return false
					}
				} else if(global_ball_center_point.x < right_scope_left_top_point.x){
					if(right_scope_left_top_point.x - global_ball_center_point.x > top_line_cirle_width){
						return false
					}
				}
			}
			
			if (delta_y > this._ballCircleRadius / 2) { //碰到了圆的上方，且靠近圆的顶部
				this.is_hit_resolve = true
				//此时需要根据碰撞的具体位置来判断
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右下方的角
					if(this.mainPanel._basketball_speed_x < 0){ //从右上左的运动
						if(this.mainPanel._baskball_speed_y > 0){
							return false;
						}
						this.mainPanel._baskball_speed_y  *= -1
					} else { //从左向右的运动，这个时候需要给球加一个向右的速度
						this.mainPanel._baskball_speed_y *= -1 ;
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左下方的角
					if(this.mainPanel._basketball_speed_x < 0){ //反弹，并且减速
						this.mainPanel._baskball_speed_y *= -1;
					}else{
						this.mainPanel._baskball_speed_y = -5
						// this.mainPanel._baskball_speed_y *= -0.7;
						this.mainPanel._basketball_speed_x = -10; //底部上升，反弹到另外一方
					}
					// if(this.mainPanel._basketball_speed_x < 0){ //从右往左运动
					// 	this.mainPanel._baskball_speed_y  *= -1
					// } else { //从左向右的运动，这个时候需要给球加一个向左的速度
					// 	this.mainPanel._baskball_speed_y *= -1;
					// }
				} else if(global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) { //碰到了顶部的线
					this.mainPanel._baskball_speed_y *= -1;
				} else{
					this.is_hit_resolve = false
					return false;
				}
				return true;
			} else {  //碰到了圆的上方，且靠近圆的中间部分。
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右下方的角
					if(Math.abs(this.mainPanel._basketball_speed_x) < 3){ //一个很缓的速度
						this.mainPanel._baskball_speed_y *= -0.7;
						this.mainPanel._basketball_speed_x = 5;
					} else {
						if(this.mainPanel._basketball_speed_x < 0){ //反弹，并且减速
							this.mainPanel._basketball_speed_x *= -1;
							this.mainPanel._baskball_speed_y *= -0.7;
						}else{
							this.mainPanel._baskball_speed_y = 0
							// this.mainPanel._baskball_speed_y *= -0.7;
							this.mainPanel._basketball_speed_x *= -2; //底部上升，反弹到另外一方
						}
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左下方的角
					if(Math.abs(this.mainPanel._basketball_speed_x) < 3){ //一个很缓的速度
						this.mainPanel._baskball_speed_y *= -0.7;
						this.mainPanel._basketball_speed_x = -5;
					} else {
						if(this.mainPanel._basketball_speed_x > 0){ //反弹，并且减速
							this.mainPanel._basketball_speed_x *= -3;
							this.mainPanel._baskball_speed_y = 0;
						}else{
							this.mainPanel._baskball_speed_y *= -0.7;
						}
					}
				} else{
					console.error("速度过快了")
				}
				this.is_hit_resolve = true
				return true;
			}
		}
		return false;
	}

	public checkHitBasketLeftScope():boolean
	{

		let global_ball_center_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);

		let left_scope_left_top_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_left_scope.x, this.m_left_scope.y, left_scope_left_top_point);
		let left_scope_right_down_point:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_left_scope.x + this.m_left_scope.width, this.m_left_scope.y + this.m_left_scope.height, left_scope_right_down_point);

		if(global_ball_center_point.y > left_scope_right_down_point.y + this._ballCircleRadius || global_ball_center_point.y < left_scope_left_top_point.y - this._ballCircleRadius)
		{
			return false;
		}

		if(global_ball_center_point.x < left_scope_left_top_point.x || global_ball_center_point.x > left_scope_right_down_point.x + this._ballCircleRadius)
		{
			return false;
		}

		if(global_ball_center_point.y < left_scope_left_top_point.y)  //顶部附近
		{
			console.assert(this.mainPanel._basketball_speed_x < 0, "left scope  top ball speed_x < 0");
			if(this.mainPanel._basketball_speed_x == 0){
				this.mainPanel._basketball_speed_x = 5;
			}else{
				this.mainPanel._basketball_speed_x *= -1;
			}
			
			this.mainPanel._baskball_speed_y *= -1;
			this.is_hit_resolve = true;
			return true;
		}

		if(global_ball_center_point.y > left_scope_right_down_point.y) //底部附近
		{

			if(this.mainPanel._basketball_speed_x == 0)
			{
				this.mainPanel._baskball_speed_y *= 0.5
				this.mainPanel._basketball_speed_x = 5
			} else {
				this.mainPanel._basketball_speed_x *= -3;
				this.mainPanel._baskball_speed_y *= 0.5
			}

			this.is_hit_resolve = true;
			return true
		}
		this.mainPanel._basketball_speed_x *= -1;
		this.mainPanel._baskball_speed_y *= 0.5
		this.is_hit_resolve = true;

		return false;
	}
}