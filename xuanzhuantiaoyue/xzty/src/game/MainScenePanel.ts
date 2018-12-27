module ui {

	export class MainScenePanel extends ui.BaseGameScene{

		public battleContainer:eui.Group
		public uiContainer:eui.Group
		public btn_change:eui.Button
		public backgroundContainer:eui.Group

		public backgrounds:Array<eui.Group> = []
		
		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
			for(let index = 0; index < GameConst.BG_NUM; index++)
			{
				this.backgrounds.push(this['background' + (index + 1)])
			}
		}

		public GetGameLogicComponent():GameLogicComponent
		{
			return this._gameLogicComponent as GameLogicComponent
		}

		public onOpen():void
		{
			super.onOpen()
			
			GameController.instance.SetMainScenePanel(this)
			this._commonUIComponent = new CommonUIComponent()
			this._gameLogicComponent = new GameLogicComponent()
			NetManager.instance.StartConnectServer()
		}

		public StartGame():void
		{
			super.StartGame()
			this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			this._commonUIComponent.OnTouchStart(event.stageX, event.stageY)
			this.GetGameLogicComponent().OnTouchJump()
		}
	}
}