class MainScenePanel extends eui.Component{

	private m_bg: eui.Image;
	private m_floor : eui.Group;
	private m_basket_container : eui.Group;
	private m_board_scope: eui.Group;
	private m_skip_board_scope : eui.Group;
	private m_net_scope: eui.Group;
	private m_joint_scope: eui.Group;
	private m_big_basketcircle_scope: eui.Group;
	private m_small_basketcircle_scope: eui.Group;
	private m_basket_ball: eui.Image;
	private m_top: eui.Group;
	private m_btn_reset : eui.Button;
	private m_container : eui.Group;
	private m_right_scope : eui.Group;
	private m_left_scope : eui.Group;

	private _gravity:number = 1;
	private _basketball_speed_x:number = 0.0;
	private _baskball_speed_y:number = 0.0;

	private _touchdown_impluse:egret.Point = new egret.Point(-5.0, -15.0);

	private _is_game_end:boolean = false;
	private _last_time:number;
	private _current_impluse:egret.Point = new egret.Point();

	private _isOnFloor:boolean = false;
	private _floorRestitution:number = 0.7; //地面反弹系数

	private _ballCircleRadius:number = 0;

	private _isStart:boolean = false;
	private _isStop:boolean = false;

	public constructor() {
		super();
		this.skinName = "MainScene";
		this.initUI();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event:egret.Event):void
	{
		this._isStart = true;
		this._last_time = egret.getTimer();
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this._ballCircleRadius = 25;
		

		let init_x = this.m_basket_ball.x
		let init_y = this.m_basket_ball.y
		let init_speed_x = 0
		let init_speed_y = 0
		this._basketball_speed_x = init_speed_x
		this._baskball_speed_y = init_speed_y
		this.m_btn_reset.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.TouchEvent){
			this.m_basket_ball.x = init_x;
			this.m_basket_ball.y = init_y;
			this._basketball_speed_x = init_speed_x;
			this._baskball_speed_y = init_speed_y

			this._isOnFloor = false;
			this._isStop = false
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this)
			this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
			event.stopPropagation();
		}.bind(this), this);
	}

	private initUI():void
	{
		
	}

	private _current_times = 0
	private _currnet_index = 0
	private _last_x = 0
	private _last_y = 0
	private _is_hit_resolve = false;
	private _is_next_frame_skil_times = false;
	private _updateBallCurrentState():void
	{
		let delta_speed_x = this._current_impluse.x;
		let delta_speed_y = this._gravity + this._current_impluse.y;

		this._basketball_speed_x += delta_speed_x;
		this._baskball_speed_y += delta_speed_y;
		this._baskball_speed_y = Math.max(this._baskball_speed_y, -20);
		this._basketball_speed_x = Math.max(this._basketball_speed_x, -20);
		this._basketball_speed_x = Math.min(this._basketball_speed_x, 20);

		this._current_impluse.x = 0;
		this._current_impluse.y = 0;
		let total_speed = Math.sqrt(Math.pow(this._basketball_speed_x, 2) + Math.pow(this._baskball_speed_y, 2));
		let step_speed = 2
		
		let times = Math.ceil(total_speed / step_speed)
		if(this._is_next_frame_skil_times){
			times = 1;
			this._is_next_frame_skil_times = false;
		}
		let curr_speend_x = this._basketball_speed_x / times
		let curr_speend_y = this._baskball_speed_y / times
		this._current_times = times;
		
		for(let step_idx = 1; step_idx <= times; step_idx++)
		{
			this._currnet_index = step_idx
			if(step_idx == times){
				curr_speend_x = this._basketball_speed_x - this._basketball_speed_x / times * (times - 1)
				curr_speend_y = this._baskball_speed_y - this._baskball_speed_y / times * (times - 1)
			}

			this._last_x = this.m_basket_ball.x
			this._last_y = this.m_basket_ball.y
			this.m_basket_ball.x += curr_speend_x;
			this.m_basket_ball.y += curr_speend_y;

			this.m_basket_ball.x = Math.max(this.m_basket_ball.x, 0);
			this.m_basket_ball.x = Math.min(this.m_basket_ball.x, this.stage.stageWidth);

			this.m_basket_ball.y = Math.min(this.m_basket_ball.y, this.m_floor.y - this.m_basket_ball.height * this.m_basket_ball.scaleY / 2.0);

			if(this.checkHitFloor())
			{
				return
			}

			if(this.checkHitBasketTopScope() || this.checkHitBasketDownScope() || this.checkHitBoardNew() || this.checkHitBasketLeftScope())
			{
				if(this._is_hit_resolve){
					// console.log(this.m_basket_ball.x + " toback  " + this.m_basket_ball.y)
					this.m_basket_ball.x = this._last_x
					this.m_basket_ball.y = this._last_y
					this._is_hit_resolve = false
				}
				// console.log(this.m_basket_ball.x + " to1  " + this.m_basket_ball.y)
				return
			}
			// console.log(this.m_basket_ball.x + " to2  " + this.m_basket_ball.y)
			// if(this.checkHitBasketCircle())
			// {
			// 	return
			// }
		}
		// this.checkHitNet();
	}

	private checkHitBasketLeftScope():boolean
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
			console.assert(this._basketball_speed_x < 0, "left scope  top ball speed_x < 0");
			if(this._basketball_speed_x == 0){
				this._basketball_speed_x = 5;
			}else{
				this._basketball_speed_x *= -1;
			}
			
			this._baskball_speed_y *= -1;
			this._is_hit_resolve = true;
			return true;
		}

		if(global_ball_center_point.y > left_scope_right_down_point.y) //底部附近
		{

			if(this._basketball_speed_x == 0)
			{
				this._baskball_speed_y *= 0.5
				this._basketball_speed_x = 5
			} else {
				this._basketball_speed_x *= -3;
				this._baskball_speed_y *= 0.5
			}

			this._is_hit_resolve = true;
			return true
		}
		this._basketball_speed_x *= -1;
		this._baskball_speed_y *= 0.5
		this._is_hit_resolve = true;

		return false;
	}

	private checkHitBasketDownScope():boolean
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
				this._is_hit_resolve = true
				//此时需要根据碰撞的具体位置来判断
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右下方的角
					if(this._basketball_speed_x < 0){ //从右上左的运动
						if(this._baskball_speed_y > 0){
							return false;
						}
						this._baskball_speed_y  *= -1
					} else { //从左向右的运动，这个时候需要给球加一个向右的速度
						this._baskball_speed_y *= -1 ;
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左下方的角
					if(this._basketball_speed_x < 0){ //反弹，并且减速
						this._baskball_speed_y *= -1;
					}else{
						this._baskball_speed_y = -5
						// this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = -10; //底部上升，反弹到另外一方
					}
					// if(this._basketball_speed_x < 0){ //从右往左运动
					// 	this._baskball_speed_y  *= -1
					// } else { //从左向右的运动，这个时候需要给球加一个向左的速度
					// 	this._baskball_speed_y *= -1;
					// }
				} else if(global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) { //碰到了顶部的线
					this._baskball_speed_y *= -1;
				} else{
					this._is_hit_resolve = false
					return false;
				}
				return true;
			} else {  //碰到了圆的上方，且靠近圆的中间部分。
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右下方的角
					if(Math.abs(this._basketball_speed_x) < 3){ //一个很缓的速度
						this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = 5;
					} else {
						if(this._basketball_speed_x < 0){ //反弹，并且减速
							this._basketball_speed_x *= -1;
							this._baskball_speed_y *= -0.7;
						}else{
							this._baskball_speed_y = 0
							// this._baskball_speed_y *= -0.7;
							this._basketball_speed_x *= -2; //底部上升，反弹到另外一方
						}
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左下方的角
					if(Math.abs(this._basketball_speed_x) < 3){ //一个很缓的速度
						this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = -5;
					} else {
						if(this._basketball_speed_x > 0){ //反弹，并且减速
							this._basketball_speed_x *= -3;
							this._baskball_speed_y = 0;
						}else{
							this._baskball_speed_y *= -0.7;
						}
					}
				} else{
					console.error("速度过快了")
				}
				this._is_hit_resolve = true
				return true;
			}
		}
		return false;
	}

	private checkHitBasketTopScope():boolean
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
				this._is_hit_resolve = true
				//此时需要根据碰撞的具体位置来判断
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
					if(this._basketball_speed_x < 0){ //从右上左的运动
						if(this._baskball_speed_y < 0){
							return false;
						}
						let _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x)
						if(Math.abs(this._basketball_speed_x) < 3){  //如果x速度过小，反弹或者直接给一个向右的速度
							if(_rate > 1){ //陡峭就反弹
								this._basketball_speed_x = 5;
								this._baskball_speed_y *= -0.7;
							} else {
								this._basketball_speed_x = 5;
								this._baskball_speed_y *= 0.7;
							}
						}else{
							if(_rate  >= 1) { // 比较陡峭的方式来碰撞，往上反弹
								this._basketball_speed_x *= 0.7;
								this._baskball_speed_y *= -0.7;
							} else { //比较平缓的方式来碰撞，往右反弹
								this._basketball_speed_x *= -0.7;
								this._baskball_speed_y *= 0.7;
							}
							this._basketball_speed_x = Math.min(this._basketball_speed_x, -5)
							if(Math.abs(this._baskball_speed_y) < 5){
								this._baskball_speed_y = this._baskball_speed_y / Math.abs(this._baskball_speed_y) * 5
							}
						}
					} else { //从左向右的运动，这个时候需要给球加一个向右的速度
						if(this._basketball_speed_x == 0){
							this._basketball_speed_x  = 5;
						} else {
							this._basketball_speed_x = Math.max(this._basketball_speed_x, 5)
						}
						this._baskball_speed_y *= -0.7;
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左上方的角
					if(this._basketball_speed_x < 0){ //从右往左运动
						let _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x)
						if(_rate >= 1){ //比较陡峭的方式来碰撞，往上反弹
							this._basketball_speed_x *= 0.7;
							this._baskball_speed_y *= -0.7;
						} else { //比较平缓的方式来碰撞，往右反弹
							this._basketball_speed_x *= -0.7;
							this._baskball_speed_y *= 0.7;
						}
					} else { //从左向右的运动，这个时候需要给球加一个向左的速度
						if(this._basketball_speed_x == 0){
							this._basketball_speed_x = -5;
							this._baskball_speed_y *= 0.7;
						} else {
							this._basketball_speed_x *= -0.7;
							this._baskball_speed_y *= 0.7;
						}
						this._basketball_speed_x = Math.max(this._basketball_speed_x, -5)
					}
				} else if(global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) { //碰到了顶部的线
					if(this._basketball_speed_x == 0){
						this._basketball_speed_x = 5;
					} else {
						this._basketball_speed_x *= 0.7;
						this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = 0.7
					}
				} else{
					this._is_hit_resolve = false
					return false;
				}
				return true;
			} else {  //碰到了圆的下方，且靠近圆的中心部分。
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
					if(Math.abs(this._basketball_speed_x) < 3){ //一个很缓的速度
						this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = 5;
					} else {
						if(this._basketball_speed_x < 0){ //反弹，并且减速
							this._basketball_speed_x *= -3;
							this._baskball_speed_y = 0;
						}else{
							this._baskball_speed_y *= -0.7;
						}
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左上方的角
					if(Math.abs(this._basketball_speed_x) < 3){ //一个很缓的速度
						this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = -5;
					} else {
						if(this._basketball_speed_x > 0){ //反弹，并且减速
							this._basketball_speed_x *= -3;
							this._baskball_speed_y = 0;
						}else{
							this._baskball_speed_y *= -0.7;
						}
					}
				} else{
					console.error("速度过快了")
				}
				this._is_hit_resolve = true
				return true;
			}
		}
		return false;
	}

	

	private  checkHitBasketRightScope():boolean
	{
		let curr_x = this.m_basket_ball.x
		let curr_y = this.m_basket_ball.y
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
				this._is_hit_resolve = true
				//此时需要根据碰撞的具体位置来判断
				if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
					if(this._basketball_speed_x < 0){ //从右上左的运动
						let message:string = this._basketball_speed_x + "  " + this._baskball_speed_y
						if(this._baskball_speed_y < 0){
							return false;
						}
						let _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x)
						if(Math.abs(this._basketball_speed_x) < 3){  //如果x速度过小，反弹或者直接给一个向右的速度
							if(_rate > 1){ //陡峭就反弹
								this._basketball_speed_x = 5;
								this._baskball_speed_y *= -0.7;
							} else {
								this._basketball_speed_x = 5;
								this._baskball_speed_y *= 0.7;
							}
						}else{
							if(_rate  >= 1) { // 比较陡峭的方式来碰撞，往上反弹
								this._basketball_speed_x *= 0.7;
								this._baskball_speed_y *= -0.7;
							} else { //比较平缓的方式来碰撞，往右反弹
								this._basketball_speed_x *= -0.7;
								this._baskball_speed_y *= 0.7;
							}
							this._basketball_speed_x = Math.min(this._basketball_speed_x, -5)
							if(Math.abs(this._baskball_speed_y) < 5){
								this._baskball_speed_y = this._baskball_speed_y / Math.abs(this._baskball_speed_y) * 5
							}
						}
					} else { //从左向右的运动，这个时候需要给球加一个向右的速度
						if(this._basketball_speed_x == 0){
							this._basketball_speed_x  = 5;
						} else {
							this._basketball_speed_x = Math.max(this._basketball_speed_x, 5)
						}
						this._baskball_speed_y *= -0.7;
					}
				} else if(global_ball_center_point.x  < right_scope_left_top_point.x && global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius) { //碰到了左上方的角
					if(this._basketball_speed_x < 0){ //从右往左运动
						let _rate = Math.abs(this._baskball_speed_y / this._basketball_speed_x)
						if(_rate >= 1){ //比较陡峭的方式来碰撞，往上反弹
							this._basketball_speed_x *= 0.7;
							this._baskball_speed_y *= -0.7;
						} else { //比较平缓的方式来碰撞，往右反弹
							this._basketball_speed_x *= -0.7;
							this._baskball_speed_y *= 0.7;
						}
					} else { //从左向右的运动，这个时候需要给球加一个向左的速度
						if(this._basketball_speed_x == 0){
							this._basketball_speed_x = -5;
							this._baskball_speed_y *= 0.7;
						} else {
							this._basketball_speed_x *= -0.7;
							this._baskball_speed_y *= 0.7;
						}
						this._basketball_speed_x = Math.max(this._basketball_speed_x, -5)
					}
				} else if(global_ball_center_point.x > right_scope_left_top_point.x - this._ballCircleRadius && global_ball_center_point.x < right_scope_right_down_point.x + this._ballCircleRadius) { //碰到了顶部的线
					if(this._basketball_speed_x == 0){
						this._basketball_speed_x = 5;
					} else {
						this._basketball_speed_x *= 0.7;
						this._baskball_speed_y *= -0.7;
						this._basketball_speed_x = 0.7
					}
				} else{
					this._is_hit_resolve = false
					return false;
				}
				
				return true;
			} else {  //碰到了圆的下方，且靠近圆的中心部分。
				let come_here = 0
				// if(global_ball_center_point.x  > right_scope_right_down_point.x) {  //碰到了右上方的角
				// 	if(this._basketball_speed_x < 0){ //反弹，并且减速
				// 		this._basketball_speed_x *= -0.7;
				// 		this._baskball_speed_y *= 0.7;
				// 	}else{
				// 		this._basketball_speed_x  += 0.3;
				// 		this._baskball_speed_y *= 0.7;
				// 	}
				// } else if(global_ball_center_point.x  < right_scope_left_top_point.x) { //碰到了左上方的角
				// 	if(this._basketball_speed_x < 0){ //反弹，并且减速
				// 		this._basketball_speed_x  == 0.3;
				// 		this._baskball_speed_y *= 0.7;
				// 	}else{
				// 		this._basketball_speed_x *= -0.7;
				// 		this._baskball_speed_y *= 0.7;
				// 	}
				// }
				// this._is_hit_resolve = true
				// return true;
			}
		} else if(global_ball_center_point.y > right_scope_right_down_point.y){ //下方

		} else { //左右两侧

		}
		return false;
	}


	private onEnterFrame(event : egret.Event):void
	{
		if(this._isStop)
		{
			return;
		}
		let current_time = egret.getTimer();
		let offset_time = current_time - this._last_time;
		if(offset_time <= 0){
			return
		}
		this._last_time = current_time;
		this._updateBallCurrentState();
	}

	private onTouchBegin(event : egret.TouchEvent):void
	{
		
		if(this.m_basket_ball.y <= this.m_top.y)
		{
			return;
		}
		if(this._baskball_speed_y > 0)
		{
			this._baskball_speed_y = 0;
		}
		this._current_impluse.x = this._touchdown_impluse.x;
		this._current_impluse.y = this._touchdown_impluse.y;

		//下面是供测试使用的代码
		// let localX = event.stageX;
		// let localY = event.stageY;
		// this.m_basket_ball.x = localX;
		// this.m_basket_ball.y = localY;
		// console.log(localX, localY)
	}


	private checkHitFloor():boolean
	{
		let curr_y = this.m_basket_ball.y;
		if(curr_y >= this.m_floor.y - this.m_basket_ball.height * this.m_basket_ball.scaleY / 2.0)
		{
			if(this._isOnFloor)  //一直在地面上
			{
				return true;
			}

			//处理反弹
			let new_speed_y = this._baskball_speed_y * this._floorRestitution * -1;
			if(Math.abs(new_speed_y) <= 0.3)
			{
				new_speed_y = 0;
			}
			this._baskball_speed_y = new_speed_y;
			this._basketball_speed_x = 0;
			return true;
		}
		return false;
	}

	private checkHitBoardNew():boolean
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

			this._is_hit_resolve = true;
			//处理上面相交过程
			if(this._basketball_speed_x > 0){ //可以反弹
				if(this._baskball_speed_y < 0){
					this._is_hit_resolve = false;
					return false;
				}
				this._basketball_speed_x *= 0.7;
				this._baskball_speed_y *= -0.7;
			} else if(this._basketball_speed_x == 0){
				this._basketball_speed_x = 5;
			} else if(this._basketball_speed_x < 0){
				this._basketball_speed_x = -3;
				this._baskball_speed_y = -10;
				this._is_next_frame_skil_times = true
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

			this._is_hit_resolve = true;

			
			if(this._basketball_speed_x == 0){
				if(global_ball_center_point.x > board_scope_right_down_point.x){
					this._basketball_speed_x = 5.0;
				} else if(global_ball_center_point.x < board_scope_left_top_point.x) {
					this._basketball_speed_x = -5.0
				}
				this._baskball_speed_y *= -0.7;  //直接反弹
			} else {
				this._baskball_speed_y *= -1;  //直接反弹
			}
			return true;
		}

		//下面就是碰撞左右两边了
		this._is_hit_resolve = true;
		this._basketball_speed_x *= -1;
		return true;
	}

	private checkHitBoard():boolean
	{
		let global_ball_center_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, global_ball_center_point);

		let localInContainerPoint:egret.Point = new egret.Point();
		this.m_basket_container.globalToLocal(global_ball_center_point.x, global_ball_center_point.y, localInContainerPoint);

		if(localInContainerPoint.y <= this.m_board_scope.y){  //top
			if(localInContainerPoint.y - this.m_board_scope.y <= this._ballCircleRadius && (localInContainerPoint.x <= this.m_board_scope.x + this._ballCircleRadius && localInContainerPoint.x >= this.m_board_scope.x - this._ballCircleRadius))
			{
				let topRestitution = 0.3
				this._baskball_speed_y *= -1 * topRestitution;
				let board_top_point = new egret.Point();
				this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y, board_top_point);
				this.m_basket_ball.y = Math.min(this.m_basket_ball.y, board_top_point.y - this._ballCircleRadius)
				console.log("########top####")
				return true;
			}
		}else if (localInContainerPoint.y >= this.m_board_scope.y + this.m_board_scope.height){ //down
			if(localInContainerPoint.y - (this.m_board_scope.y + this.m_board_scope.height) <= this._ballCircleRadius && (localInContainerPoint.x <= this.m_board_scope.x + this._ballCircleRadius && localInContainerPoint.x >= this.m_board_scope.x - this._ballCircleRadius))
			{
				let downRestitution = 0.3
				this._baskball_speed_y *= -1 * downRestitution;
				let board_down_point = new egret.Point();
				this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y + this.m_board_scope.height, board_down_point); 
				this.m_basket_ball.y = Math.max(this.m_basket_ball.y, board_down_point.y + this._ballCircleRadius);
				console.log("########down####")
				return true;
			}
		}else{ //center
			if(localInContainerPoint.x > this.m_board_scope.x){ //right
				if(localInContainerPoint.x <= this.m_board_scope.x + this.m_board_scope.width + this._ballCircleRadius)
				{
					this._basketball_speed_x = 0.8 * this._basketball_speed_x / Math.abs(this._basketball_speed_x) * -1;

					let right_top_point = new egret.Point();
					this.m_basket_container.localToGlobal(this.m_board_scope.x + this.m_board_scope.width, this.m_board_scope.y, right_top_point);

					let temp_temp_point = new egret.Point();
					let localInBallContainer = this.m_basket_ball.parent.globalToLocal(right_top_point.x, right_top_point.y, temp_temp_point)
					this.m_basket_ball.x = temp_temp_point.x + this._ballCircleRadius;
					return true;
				}
			} else{ //left
				if(localInContainerPoint.x <= this.m_board_scope.x + this.m_basket_ball.width * this.m_basket_ball.scaleX)
				{
					let left_top_point = new egret.Point();
					this.m_basket_container.localToGlobal(this.m_board_scope.x, this.m_board_scope.y, left_top_point);
					this.m_basket_ball.x = Math.min(this.m_basket_ball.x, left_top_point.x - this._ballCircleRadius);
					console.log("########left####")
					return true;
				}
			}
		}
		return false;
	}

	//和篮网的碰撞
	private checkHitNet():void
	{
		let temp_global_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);

		let localPoint:egret.Point = new egret.Point();
		this.m_basket_container.globalToLocal(temp_global_point.x, temp_global_point.y, localPoint);

		if(localPoint.x <= this.m_net_scope.x + this.m_net_scope.width + this._ballCircleRadius && localPoint.x >= this.m_net_scope.x - this._ballCircleRadius)
		{
			if(localPoint.y <= this.m_net_scope.y + this.m_net_scope.height + this._ballCircleRadius && localPoint.y >= this.m_net_scope.y + this.m_net_scope.height / 2)
			{
				console.log("#####hit net#####")
			}
		}
	}

	

	//和篮圈的碰撞
	private checkHitBasketCircle():boolean
	{
		let temp_global_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);
		
		let bigCircleLeftTopPoint:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_big_basketcircle_scope.x, this.m_big_basketcircle_scope.y, bigCircleLeftTopPoint);
		let bigCircleRightDownPoint:egret.Point = new egret.Point();
		this.m_basket_container.localToGlobal(this.m_big_basketcircle_scope.x + this.m_big_basketcircle_scope.width, this.m_big_basketcircle_scope.y + this.m_big_basketcircle_scope.height, bigCircleRightDownPoint);

		let condition1 = temp_global_point.x <= bigCircleRightDownPoint.x + this._ballCircleRadius
		let condition2 = temp_global_point.x >= (bigCircleLeftTopPoint.x + bigCircleRightDownPoint.x) / 2
		let temp1 = bigCircleLeftTopPoint.x
		let temp2 = bigCircleRightDownPoint.x
		let temp3 = temp_global_point.x
		if(condition1 && condition2)
		{
			let center_y = (bigCircleLeftTopPoint.y + bigCircleRightDownPoint.y) / 2
			if(temp_global_point.y < center_y + this._ballCircleRadius && temp_global_point.y > center_y - this._ballCircleRadius)
			{
				let is_down = false;
				if(temp_global_point.y < center_y){ //下半部分
					is_down = true
					if(this._baskball_speed_y > 0){
						this._basketball_speed_x *= 1;
						this._baskball_speed_y *= -1
						console.log("#####11#######", this._basketball_speed_x, this._baskball_speed_y)
					}else{
						this._basketball_speed_x *= -1;
						this._baskball_speed_y *= 1
						console.log("#####22#######", this._basketball_speed_x, this._baskball_speed_y)
					}
				} else {  //碰到上半部分
					if(temp_global_point.x < bigCircleRightDownPoint.x + this._ballCircleRadius / 2){
						console.log("#####33#######", this._basketball_speed_x, this._baskball_speed_y)
						if(this._baskball_speed_y < 0){
							this._basketball_speed_x *= 0.7;
							this._baskball_speed_y *= -0.7
							return true
						}else{
							return false;
						}
						
					}else{
						console.log("#####44#######", this._basketball_speed_x, this._baskball_speed_y)
						if(this._basketball_speed_x < 0){
							this._basketball_speed_x *= -0.7;
							this._baskball_speed_y *= 0.7
							return true
						}else{
							return false
						}
					}
				}
				console.log("#####hit circle###########", this._basketball_speed_x, this._baskball_speed_y, this._current_times, this._currnet_index, is_down)
				//this._isStop = true;
				return true;
			}
		}

		let smallCircleLeftTopPoint:egret.Point = new egret.Point()
		this.m_basket_container.localToGlobal(this.m_small_basketcircle_scope.x, this.m_small_basketcircle_scope.y, smallCircleLeftTopPoint);
		let smallCircleRightDownPoint:egret.Point = new egret.Point()
		this.m_basket_container.localToGlobal(this.m_small_basketcircle_scope.x + this.m_small_basketcircle_scope.width, this.m_small_basketcircle_scope.y + this.m_small_basketcircle_scope.height, smallCircleRightDownPoint);

		condition1 = temp_global_point.x < smallCircleRightDownPoint.x;
		condition2 = temp_global_point.x > smallCircleLeftTopPoint.x
		
		let center_y = (smallCircleLeftTopPoint.y + smallCircleRightDownPoint.y) / 2
		let condition3 = temp_global_point.y > center_y - this._ballCircleRadius;
		let condition4 = temp_global_point.y < center_y + this._ballCircleRadius;
		if(condition1 && condition2 && condition3 && condition4)
		{
			if(temp_global_point.x < smallCircleLeftTopPoint.x + this._ballCircleRadius){ //碰到了篮圈内框左侧
				this._basketball_speed_x = 1 * this._basketball_speed_x / Math.abs(this._basketball_speed_x) * -1
			} else if (temp_global_point.x < smallCircleRightDownPoint.x - this._ballCircleRadius){ //碰到了篮圈内框右侧
				this._basketball_speed_x = 1 * this._basketball_speed_x / Math.abs(this._basketball_speed_x) * -1
			} else {  //空心
				console.log("空心")
			}
			console.log("######进入了内框#######")
			return true;
		}

		return false;
	}


}