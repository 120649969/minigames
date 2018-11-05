class MainScenePanel extends eui.Component{

	public m_bg: eui.Image;
	public m_floor : eui.Group;
	public m_basket_container : eui.Group;
	public m_board_scope: eui.Group;
	public m_skip_board_scope : eui.Group;
	public m_net_scope: eui.Group;
	public m_joint_scope: eui.Group;
	public m_big_basketcircle_scope: eui.Group;
	public m_small_basketcircle_scope: eui.Group;
	public m_basket_ball: eui.Group;
	public m_top: eui.Group;
	public m_btn_reset : eui.Button;
	public m_container : eui.Group;
	public m_right_scope : eui.Group;
	public m_left_scope : eui.Group;
	public m_image_ball:eui.Image
	public m_right_line:eui.Group
	public m_left_line:eui.Group
	public m_circle_scope:eui.Group  //篮圈

	public _gravity:number = 1.2;
	public _basketball_speed_x:number = 0.0;
	public _baskball_speed_y:number = 0.0;

	private _touchdown_impluse:egret.Point = new egret.Point(-5.0, -16.0);

	private _is_game_end:boolean = false;
	private _last_time:number;
	public _current_impluse:egret.Point = new egret.Point();
	private _ballCircleRadius:number = 0;

	private _isStart:boolean = false;
	private _isStop:boolean = false;

	public constructor() {
		super();
		this.skinName = "MainScene";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event:egret.Event):void
	{
		this._isStart = true;
		this._last_time = egret.getTimer();
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this._ballCircleRadius = 25;

		this.initGame();
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

	private _playerBall:PlayerBall;
	private _hitManager:HitManager;
	private _hitManagerNew:HitManagerNew

	private _auto_enter_next_round:boolean = false;
	private _is_first_round:boolean = true;
	private _hasTouchBegin:boolean = false;
	private _is_face_left:boolean = true;
	private _has_goal:boolean = false;
	private _left_basket_container_x:number;
	private _left_basket_container_y:number;
	private _right_basket_container_x:number;
	private _right_basket_container_y:number;

	public getHitManager():HitManager
	{
		return this._hitManager
	}

	public getHitManagerNew():HitManagerNew
	{
		return this._hitManagerNew
	}

	private initGame():void
	{
		this._hitManager = new HitManager(this);
		this._hitManagerNew = new HitManagerNew(this);
		this._playerBall = new PlayerBall(this.m_basket_ball, this)

		this._left_basket_container_x = this.m_basket_container.x;
		this._left_basket_container_y = this.m_basket_container.y;
		this._right_basket_container_x = this.stage.stageWidth;
		this._right_basket_container_y = this._left_basket_container_y;
		this.NextRound();
	}

	public IsFaceLeft()
	{
		return this._is_face_left
	}

	public HasGoal():boolean
	{
		return this._has_goal
	}

	public SetGoal(has_global):void
	{
		this._has_goal = has_global;

		if(has_global){
			let __this = this;
			setTimeout(function(){
				__this._auto_enter_next_round =  true
			}.bind(this), 2 * 1000)
		}
	}


	public NextRound():void
	{
		this.SetGoal(false);
		this._is_face_left = Math.floor(Math.random() * 2) == 0
		if(this._is_first_round){
			this._is_face_left = true
		}
		
		if(this._is_face_left){
			this.m_basket_container.x = this._left_basket_container_x;
			this.m_basket_container.y = this._left_basket_container_y;
			this.m_basket_container.scaleX = Math.abs(this.m_basket_container.scaleX);
		}else{
			this.m_basket_container.x = this._right_basket_container_x;
			this.m_basket_container.y = this._right_basket_container_y;
			this.m_basket_container.scaleX = Math.abs(this.m_basket_container.scaleX) * -1;
		}

		if(!this._is_first_round){
			if(this._is_face_left){
				let random_ball_x = this.stage.stageWidth + Math.random() * 30;
				let random_ball_y = this.m_floor.y - Math.random() * 30 - 200 - this.m_basket_ball.height;
				this.m_basket_ball.x = random_ball_x
				this.m_basket_ball.y = random_ball_y
				this._basketball_speed_x = HitConst.Max_Speed_X * -1;
			} else {
				let random_ball_x = 0 - Math.random() * 30;
				let random_ball_y = this.m_floor.y - Math.random() * 30 - 200 - this.m_basket_ball.height;
				this.m_basket_ball.x = random_ball_x
				this.m_basket_ball.y = random_ball_y
				this._basketball_speed_x = HitConst.Max_Speed_X;
			}
		}else{
			let random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
			let random_ball_y = this.m_floor.y - 200
			this.m_basket_ball.x = random_ball_x
			this.m_basket_ball.y = random_ball_y
		}
		
		this._is_first_round = false;
	}

	private onEnterFrame(event : egret.Event):void
	{
		if(this._isStop)
		{
			return;
		}
		if(this._auto_enter_next_round){
			this._auto_enter_next_round = false;
			this.NextRound();
		}
		this._playerBall.Update()
	}

	private onTouchBegin(event : egret.TouchEvent):void
	{
		if(!this._hasTouchBegin)
		{
			this._hasTouchBegin = true;
		}
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

		this._basketball_speed_x = HitConst.Max_Speed_X * (this._is_face_left ? -1 : 1);
	}

	

	//和篮网的碰撞
	public checkHitNet():void
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

	public isLeft():boolean
	{
		return true;
	}
}