module ui {
	export class MainScenePanel extends BaseGameScene{
		
		public mapContainer:eui.Group

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
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
	}
}