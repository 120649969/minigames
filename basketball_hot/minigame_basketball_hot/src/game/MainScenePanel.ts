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
	public img_board_back:eui.Image
	public img_board_pre:eui.Image
	public img_net_pre:eui.Image
	public img_net_back:eui.Image

	public img_time_progress:eui.Image
	public label_score_me:eui.Label
	public label_score_other:eui.Label
	public label_left_time:eui.Label

	private btn_debug:eui.Button
	private _playerBall:PlayerBall
	private _hitManager:HitManager

	private _auto_enter_next_round:boolean = false;
	private _is_first_round:boolean = true;
	private _hasTouchBegin:boolean = false;
	private _hasThisRoundTouch:boolean = false;
	private _is_face_left:boolean = true;
	private _has_goal:boolean = false;

	public serverModel:ServerModel = new ServerModel()
	private _timer:egret.Timer;
	private _is_game_over:boolean = false;

	private _hasInitGame:boolean = false;
	public constructor() {
		super();
		this.skinName = "MainScene";
		this._initBtnListener()
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	private _initBtnListener():void
	{
		this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
		let __this = this
		this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
			let debugPanel = new DebugPanel()
			__this.addChild(debugPanel)
			event.stopPropagation();
		}.bind(this), this)
	}

	public RestartGame():void
	{
		this._is_first_round = true;
		this._hasTouchBegin = false;
		this._hasThisRoundTouch = false;
		this._has_goal = false;

		if(!this._hasInitGame){
			this._hitManager = new HitManager(this);
			this._playerBall = new PlayerBall(this.m_basket_ball, this);
			this._hasInitGame = true

			
		} else {
			this._playerBall.Restart()
		}

		this._is_game_over = false;
		if(this._timer){
			this._timer.removeEventListener(egret.TimerEvent.TIMER,this._on_timer_tick,this);
			this._timer.stop();
		}
		var timer:egret.Timer = new egret.Timer(1000, this.serverModel.MAX_TIME);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER,this._on_timer_tick,this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this._on_timer_compelete,this);
        //开始计时
        timer.start();
		this._timer = timer
		this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
		this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
		this.serverModel.left_time = this.serverModel.MAX_TIME
		this._nextRound();
		this.UpdateScore()
		this.m_basket_ball.visible = true
	}

	private _onAddToStage(event:egret.Event):void
	{
		this.RestartGame()
	}

	protected createChildren(): void {
		super.createChildren();
		this._addAnimation()
	}

	private _board_pre_display:dragonBones.EgretArmatureDisplay
	private _board_back_display:dragonBones.EgretArmatureDisplay
	private _net_pre_display:dragonBones.EgretArmatureDisplay
	private _net_back_display:dragonBones.EgretArmatureDisplay

	private _addAnimation():void
	{
		let armatureDisplay = BasketUtils.createDragonBones("board_pre_ske_json", "board_pre_tex_json", "board_pre_tex_png", "boad_pre_armature")
		this.img_board_pre.parent.addChild(armatureDisplay)
		armatureDisplay.x = this.img_board_pre.x
		armatureDisplay.y = this.img_board_pre.y
		this._board_pre_display = armatureDisplay

		let armatureDisplay2 = BasketUtils.createDragonBones("board_back_ske_json", "board_back_tex_json", "board_back_tex_png", "boad_back_armature")
		this.img_board_back.parent.addChild(armatureDisplay2)
		armatureDisplay2.x = this.img_board_back.x
		armatureDisplay2.y = this.img_board_back.y
		this._board_back_display = armatureDisplay2

		let armatureDisplay3 = BasketUtils.createDragonBones("net_back_ske_json", "net_back_tex_json", "net_back_tex_png", "net_back_armature")
		this.img_net_back.parent.addChild(armatureDisplay3)
		armatureDisplay3.x = this.img_net_back.x
		armatureDisplay3.y = this.img_net_back.y
		this.img_net_back.parent.setChildIndex(armatureDisplay3, 1)
		this._net_back_display = armatureDisplay3

		let armatureDisplay4 = BasketUtils.createDragonBones("net_pre_ske_json", "net_pre_tex_json", "net_pre_tex_png", "net_pre_armature")
		this.img_net_pre.parent.addChild(armatureDisplay4)
		armatureDisplay4.x = this.img_net_pre.x
		armatureDisplay4.y = this.img_net_pre.y
		this.img_net_pre.parent.setChildIndex(armatureDisplay4, 1)
		this._net_pre_display = armatureDisplay4

		this.img_board_pre.visible = false
		this.img_board_back.visible = false
		this.img_net_back.visible = false
		this.img_net_pre.visible = false
	}

	//篮筐抖动
	public PlayShakeAnimation()
	{
		if(this._board_pre_display.animation.isPlaying){
			return
		}
		this._board_pre_display.animation.play('lanban', 1)
		this._board_back_display.animation.play('lanban', 1)
		this._net_pre_display.animation.play('lanban', 1)
		this._net_back_display.animation.play('lanban', 1)
	}

	public PlayGoalAnimation()
	{
		this._net_pre_display.animation.stop();
		this._net_pre_display.animation.play('jinqu', 1)
		this._net_back_display.animation.stop();
		this._net_back_display.animation.play('jinqu', 1)
	}

	public PlayKongXingAnimation()
	{
		this._net_pre_display.animation.stop();
		this._net_pre_display.animation.play('kongxinqiu', 1)
		this._net_back_display.animation.stop();
		this._net_back_display.animation.play('kongxinqiu', 1)
	}

	public PlayNetAnimation(hitNetType:HitNetType)
	{
		if(this._net_pre_display.animation.isPlaying){
			return
		}

		if(hitNetType == HitNetType.CENTER){
			this._net_pre_display.animation.play('up', 1)
			this._net_back_display.animation.play('up', 1)
			return
		}

		if(hitNetType == HitNetType.LEFT){
			if(this.IsFaceLeft()){
				this._net_pre_display.animation.play('R', 1)
				this._net_back_display.animation.play('R', 1)
			} else {
				this._net_pre_display.animation.play('L', 1)
				this._net_back_display.animation.play('L', 1)
			}
		} else {
			if(this.IsFaceLeft()){
				this._net_pre_display.animation.play('L', 1)
				this._net_back_display.animation.play('L', 1)
			} else {
				this._net_pre_display.animation.play('R', 1)
				this._net_back_display.animation.play('R', 1)
			}
		}
	}

	private _on_timer_tick():void
	{
		this.serverModel.left_time -= 1
		this.UpdateScore()
	}

	private _on_timer_compelete():void
	{
		console.log("game is over")
		this._is_game_over = true

		let __this = this
		setTimeout(function() {
			console.log("game restart")
			__this.RestartGame();
		}.bind(this), 2* 1000);
	}

	public HasTouchBegin():boolean
	{
		return this._hasTouchBegin
	}

	public GetHitManager():HitManager
	{
		return this._hitManager
	}

	public HasThisRoundTouch():boolean
	{
		return this._hasThisRoundTouch
	}

	public IsFaceLeft()
	{
		return this._is_face_left
	}

	public HasGoal():boolean
	{
		return this._has_goal
	}

	public SetGoal(has_global, score:number):void
	{
		this._has_goal = has_global;
		if(has_global){
			this.AddScore(score)
		}
	}

	public AddScore(score:number):void
	{
		this.serverModel.my_score += score
		this.UpdateScore()
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
		this.SetGoal(false, 0);
		let is_left = Math.floor(Math.random() * 2) == 0
		let old_left = this._is_face_left
		let has_change = is_left != this._is_face_left
		this._is_face_left = is_left
		if(this._is_first_round){
			this._is_face_left = true
			has_change = true
		}

		this._hasThisRoundTouch = false;
		if(has_change){
			if(this._is_face_left){
				let random_y = this.stage.stageHeight / 2 - Math.random() * 200
				this.m_basket_container_pre.x = 0
				this.m_basket_container_pre.y = random_y
				this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX);

				this.m_basket_container_back.x = 0
				this.m_basket_container_back.y = random_y
				this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX);

			}else{
				let random_y = this.stage.stageHeight / 2 - Math.random() * 200
				this.m_basket_container_pre.x = this.stage.stageWidth
				this.m_basket_container_pre.y = random_y
				this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;

				this.m_basket_container_back.x = this.stage.stageWidth
				this.m_basket_container_back.y = random_y
				this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;
			}
		}
		

		this.validateNow()

		if(this._is_first_round){
			let random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
			let random_ball_y = this.m_floor.y - 200
			this.m_basket_ball.x = random_ball_x
			this.m_basket_ball.y = random_ball_y
		}
		
		this._is_first_round = false;
		
		
		this._hitManager.EnterNextRound()
		this._playerBall.EnterNextRound()
	}

	private _onEnterFrame(event : egret.Event):void
	{
		if(this._is_game_over){
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.m_basket_ball.visible = false;
			return
		}
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

	public UpdateScore():void
	{
		this.label_score_me.text = this.serverModel.my_score.toString();
		this.label_score_other.text = this.serverModel.other_score.toString();
		this.label_left_time.text = this.serverModel.left_time.toString();
		let percent = this.serverModel.left_time / this.serverModel.MAX_TIME
		let down_height = percent * this.img_time_progress.height
		this.img_time_progress.mask = new egret.Rectangle(0, this.img_time_progress.height - down_height, this.img_time_progress.width, down_height)
	}

}