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

	private _playerBall:PlayerBall;
	private _hitManager:HitManager;
	private _hitManagerNew:HitManagerNew

	public getHitManager():HitManager
	{
		return this._hitManager
	}

	public getHitManagerNew():HitManagerNew
	{
		return this._hitManagerNew
	}

	private initUI():void
	{
		this._hitManager = new HitManager(this);
		this._hitManagerNew = new HitManagerNew(this);
		this._playerBall = new PlayerBall(this.m_basket_ball, this)
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
		this._playerBall.Update()
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

		this._basketball_speed_x = this._touchdown_impluse.x

		//下面是供测试使用的代码
		// let localX = event.stageX;
		// let localY = event.stageY;
		// this.m_basket_ball.x = localX;
		// this.m_basket_ball.y = localY;
		// console.log(localX, localY)
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