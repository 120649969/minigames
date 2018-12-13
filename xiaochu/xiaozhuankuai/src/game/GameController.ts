class GameController {

	private _mainScenePanel:ui.MainScenePanel
	private static _instance:GameController

	private _timer:egret.Timer
	public serverModel:ServerModel = new ServerModel()

	public is_game_over:boolean = false
	private _myMoveObject:MyMoveObject

	public constructor() {
	}

	public static get instance():GameController
	{
		if(!GameController._instance)
		{
			GameController._instance = new GameController()
		}
		return GameController._instance
	}

	public SetMainScenePanel(mainPanel:ui.MainScenePanel):void
	{
		this._mainScenePanel = mainPanel

		this._myMoveObject = new MyMoveObject(mainPanel)
	}

	public GetMoveObject():MyMoveObject
	{
		return this._myMoveObject
	}
	
	public GetMainScenePanel():ui.MainScenePanel
	{
		return this._mainScenePanel
	}

	public StartGame():void
	{
		this._mainScenePanel.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		this._startTimer()
	}
	
	private _onEnterFrame():void
	{
		this._mainScenePanel.GetCommonUIComponent().OnEnterFrame()
		this._mainScenePanel.GetGameLogicComponent().OnEnterFrame()
		// GameBoxLineManager.instance.Update()
		// this._myMoveObject.Move()
	}

	private _startTimer():void
	{
		var timer:egret.Timer = new egret.Timer(1000, GameConst.GAME_TIME);
		//注册事件侦听器
		timer.addEventListener(egret.TimerEvent.TIMER,this._on_timer_tick,this);
		//开始计时
		timer.start()
		this._timer = timer
	}

	private _on_timer_tick():void
	{
		this.serverModel.left_time -= 1
		this.serverModel.left_time = Math.max(this.serverModel.left_time, 0)
		this._mainScenePanel.UpdateTime()
	}

	private _clearGame():void
	{
		this._clearTimer()
		this._mainScenePanel.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
	}

	private _clearTimer():void
	{
		if(this._timer)
		{
			this._timer.stop();
			this._timer = null
		}
	}

	public GameOver():void
	{
		if(this.is_game_over){
			return
		}
		this.is_game_over = true
		this._clearGame()
		GamePlatform.onCalculating()
		CommonUtils.performDelay(function(){
			GamePlatform.onFinished()
		}.bind(this), 2 * 1000, this)
	}
}