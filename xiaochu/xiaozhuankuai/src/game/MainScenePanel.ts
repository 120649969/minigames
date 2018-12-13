module ui {
	export class MainScenePanel extends ui.Window{

		public box_line_container:egret.DisplayObjectContainer
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

		private _gameLogicComponent:GameLogicComponent
		private _commonUIComponent:CommonUIComponent

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
		}

		public resizeStage():void
		{
			super.resizeStage()
			this.validateNow()
		}

		//连接到了服务器回调
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
			GameController.instance.StartGame()
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			let isStop = this._commonUIComponent.OnTouch(event.stageX, event.stageY)
			if(isStop)
			{
				return
			}
			this._gameLogicComponent.OnTouch(event.stageX, event.stageY)
		}

		//更新时间显示
		public UpdateTime():void
		{

		}

		public UpdateScore():void
		{

		}

		public onOpen():void
		{
			super.onOpen()
			GameController.instance.SetMainScenePanel(this)
			
			GameBoxLineManager.instance
			this._commonUIComponent = new CommonUIComponent()
			this._gameLogicComponent = new GameLogicComponent()

			NetManager.instance.StartConnectServer()
		}

		public GetCommonUIComponent():CommonUIComponent
		{
			return this._commonUIComponent
		}

		public GetGameLogicComponent():GameLogicComponent
		{
			return this._gameLogicComponent
		}
	}
}