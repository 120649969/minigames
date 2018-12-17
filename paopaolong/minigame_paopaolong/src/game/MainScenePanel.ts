module ui {
	export class MainScenePanel extends ui.Window{

		public m_offline_tips:eui.Group
		private m_touch_layer:eui.Group
		public btn_help:eui.Button
		public img_help:eui.Image
		public m_other_icon_bg:eui.Image
		public m_me_icon_bg:eui.Image
		public m_other_icon:eui.Image
		public m_me_icon:eui.Image
		public label_other_name:eui.Label
		public label_my_name:eui.Label
		public label_add_line:eui.BitmapLabel
		public m_addline_tips:eui.Group
		public m_game_container:eui.Group
		public m_line:eui.Rect
		public m_start:eui.Group
		public m_rotate_line:eui.Rect
		
		private _gameLogicComponent:GameLogicComponent
		private _commonUIComponent:CommonUIComponent

		private mBoxLines:Array<BallLine> = []
		private btn_debug:eui.Button

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
		}

		public resizeStage():void
		{
			super.resizeStage()
			this.validateNow()
		}

		protected createChildren(): void {
			super.createChildren()
			this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
				ui.WindowManager.getInstance().open("DebugPanel")
			}.bind(this), this)
		}

		public UpdateTime():void
		{

		}

		public UpdateScore():void
		{

		}

		public GetCommonUIComponent():CommonUIComponent
		{
			return this._commonUIComponent
		}

		public GetGameLogicComponent():GameLogicComponent
		{
			return this._gameLogicComponent
		}

		public onOpen():void
		{
			super.onOpen()
			GameController.instance.SetMainScenePanel(this)
			
			this._commonUIComponent = new CommonUIComponent()
			this._gameLogicComponent = new GameLogicComponent()

			NetManager.instance.StartConnectServer()
			this.m_game_container.mask = new egret.Rectangle(0, 0, this.m_game_container.width, this.m_game_container.height)
		}

		public OnConnectServer():void
		{
			let __this = this
			this._commonUIComponent.PlayReadyAnimation(function(){
				__this.StartGame()
			})
		}

		public StartGame():void
		{
			this._commonUIComponent.UpdateIcon()
			this._commonUIComponent.UpdateName()
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._TouchMove, this)
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_END, this._TouchEnd, this)
			GameController.instance.StartGame()

			this._gameLogicComponent.OnStart()
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			let isStop = this._commonUIComponent.OnTouchStart(event.stageX, event.stageY)
			if(isStop)
			{
				return
			}
			this._gameLogicComponent.OnTouchStart(event.stageX, event.stageY)
		}

		private _TouchMove(event:egret.TouchEvent):void
		{
			this._gameLogicComponent.OnTouchMove(event.stageX, event.stageY)
		}

		private _TouchEnd(event:egret.TouchEvent):void
		{
			this._gameLogicComponent.OnTouchEnd(event.stageX, event.stageY)
		}
	}
}