class MainScenePanel extends eui.Component{

	private m_bg: eui.Image;
	private m_floor : eui.Group;
	private m_basket_container : eui.Group;
	private m_board_scope: eui.Group;
	private m_net_scope: eui.Group;
	private m_joint_scope: eui.Group;
	private m_big_basketcircle_scope: eui.Group;
	private m_small_basketcircle_scope: eui.Group;
	private m_basket_ball: eui.Image;
	private m_top: eui.Group;
	private m_btn_reset : eui.Button;
	private m_container : eui.Group;

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
		this._ballCircleRadius = this.m_basket_ball.width * this.m_basket_ball.scaleX / 2 - 5;

		this.m_basket_ball.x = 360;
		this.m_basket_ball.y = 770;
		this.m_btn_reset.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.TouchEvent){
			this.m_basket_ball.x = 360;
			this.m_basket_ball.y = 770;
			this._basketball_speed_x = 0;
			this._basketball_speed_y = 0;

			this._isOnFloor = false;
			this._isStop = false
			event.stopPropagation();
		}.bind(this), this);
	}

	private initUI():void
	{
		
	}

	private _current_times = 0
	private _currnet_index = 0
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
		let step_speed = 1
		
		let times = Math.ceil(total_speed / step_speed)
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
			this.m_basket_ball.x += curr_speend_x;
			this.m_basket_ball.y += curr_speend_y;

			this.m_basket_ball.x = Math.max(this.m_basket_ball.x, 0);
			this.m_basket_ball.x = Math.min(this.m_basket_ball.x, this.stage.stageWidth);

			this.m_basket_ball.y = Math.min(this.m_basket_ball.y, this.m_floor.y - this.m_basket_ball.height * this.m_basket_ball.scaleY / 2.0);

			if(this.checkHitFloor())
			{
				return
			}

			if(this.checkHitBasketCircle())
			{
				return
			}

			if(this.checkHitBoard())
			{
				return;
			}
		}
		this.checkHitNet();
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
			return true;
		}
		return false;
	}

	private checkHitBoard():boolean
	{
		let temp_global_point:egret.Point = new egret.Point();
		this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);

		let localInContainerPoint:egret.Point = new egret.Point();
		this.m_basket_container.globalToLocal(temp_global_point.x, temp_global_point.y, localInContainerPoint);

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

				if(temp_global_point.y > center_y){ //下半部分
					this._basketball_speed_x *= 1;
					this._baskball_speed_y *= -1
				} else {  //碰到上半部分
					this._basketball_speed_x *= 1;
					this._baskball_speed_y *= -1
				}
				console.log("#####hit circle###########", this._basketball_speed_x, this._baskball_speed_y, this._current_times, this._currnet_index)
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