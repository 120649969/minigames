class MainScenePanel extends eui.Component{

	public m_floor : eui.Group;
	public m_basket_container_back : eui.Group;
	public m_basket_container_pre : eui.Group;
	public m_board_scope: eui.Group;
	public m_net_scope: eui.Group;
	public m_basket_ball: eui.Group;
	public m_top: eui.Group;
	public m_container : eui.Group;
	public m_image_ball:eui.Image
	public m_right_line:eui.Group
	public m_left_line:eui.Group
	public m_circle_scope:eui.Group  //篮圈
	public m_board_top_circle:eui.Group
	public m_board_down_circle:eui.Group

	private _isUsingMi:boolean = true;
	private btn_debug:eui.Button
	private _playerBall:PlayerBall
	private _hitManager:HitManager

	private _auto_enter_next_round:boolean = false;
	private _is_first_round:boolean = true;
	private _hasTouchBegin:boolean = false;
	private _hasThisRoundTouch:boolean = false;
	private _is_face_left:boolean = true;
	private _has_goal:boolean = false;
	private _left_basket_container_x:number;
	private _left_basket_container_y:number;
	private _right_basket_container_x:number;
	private _right_basket_container_y:number;

	public constructor() {
		super();
		this.skinName = "MainScene";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	private _onAddToStage(event:egret.Event):void
	{
		this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
		this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);

		let __this = this
		this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
			let debugPanel = new DebugPanel()
			__this.addChild(debugPanel)
			event.stopPropagation();
		}.bind(this), this)
		this._initGame();
	}

	public HasTouchBegin():boolean
	{
		return this._hasTouchBegin
	}

	public GetHitManagerMi():HitManager
	{
		return this._hitManager
	}

	public HasThisRoundTouch():boolean
	{
		return this._hasThisRoundTouch
	}

	private _initGame():void
	{

		this._hitManager = new HitManager(this);
		this._playerBall = new PlayerBall(this.m_basket_ball, this);

		this._left_basket_container_x = this.m_basket_container_back.x;
		this._left_basket_container_y = this.m_basket_container_back.y;
		this._right_basket_container_x = this.stage.stageWidth;
		this._right_basket_container_y = this._left_basket_container_y;
		this._nextRound();
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
	}

	public AutoEnterNextRound():void
	{
		this._auto_enter_next_round =  true
	}

	public IsInAutoEnterNextRound():boolean
	{
		return this._auto_enter_next_round
	}

	public GetPlayerBall():PlayerBall
	{
		return this._playerBall
	}

	public _nextRound():void
	{
		this.SetGoal(false);
		this._is_face_left = Math.floor(Math.random() * 2) == 0
		// this._is_face_left = !this._is_face_left
		if(this._is_first_round){
			this._is_face_left = true
		}

		this._hasThisRoundTouch = false;
		if(this._is_face_left){
			this.m_basket_container_pre.x = this._left_basket_container_x;
			this.m_basket_container_pre.y = this._left_basket_container_y;
			this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX);

			this.m_basket_container_back.x = this._left_basket_container_x;
			this.m_basket_container_back.y = this._left_basket_container_y;
			this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX);
		}else{

			this.m_basket_container_pre.x = this._right_basket_container_x;
			this.m_basket_container_pre.y = this._right_basket_container_y;
			this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;

			this.m_basket_container_back.x = this._right_basket_container_x;
			this.m_basket_container_back.y = this._right_basket_container_y;
			this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;
		}

		if(this._is_first_round){
			let random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
			let random_ball_y = this.m_floor.y - 200
			this.m_basket_ball.x = random_ball_x
			this.m_basket_ball.y = random_ball_y
		}
		
		this._is_first_round = false;
		
		this.validateNow()
		this._hitManager.EnterNextRound()
		this._playerBall.EnterNextRound()
		
	}

	private _onEnterFrame(event : egret.Event):void
	{
		if(this._auto_enter_next_round){
			this._nextRound();
			this._auto_enter_next_round = false;
		}
		this._playerBall.Update()
	}

	private _onTouchBegin(event : egret.TouchEvent):void
	{
		if(!this._hasTouchBegin)
		{
			this._hasTouchBegin = true;
		}

		this._hasThisRoundTouch = true
		if(this.m_basket_ball.y <= this.m_top.y)
		{
			return;
		}
		
		this._playerBall.OnPushDown();
	}

	

	//和篮网的碰撞
	// public checkHitNet():void
	// {
	// 	let temp_global_point:egret.Point = new egret.Point();
	// 	this.m_basket_ball.localToGlobal(this.m_basket_ball.width / 2, this.m_basket_ball.width / 2, temp_global_point);

	// 	let localPoint:egret.Point = new egret.Point();
	// 	this.m_basket_container.globalToLocal(temp_global_point.x, temp_global_point.y, localPoint);

	// 	if(localPoint.x <= this.m_net_scope.x + this.m_net_scope.width + this._ballCircleRadius && localPoint.x >= this.m_net_scope.x - this._ballCircleRadius)
	// 	{
	// 		if(localPoint.y <= this.m_net_scope.y + this.m_net_scope.height + this._ballCircleRadius && localPoint.y >= this.m_net_scope.y + this.m_net_scope.height / 2)
	// 		{
	// 			console.log("#####hit net#####")
	// 		}
	// 	}
	// }
}