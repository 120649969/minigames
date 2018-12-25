module ui {
	export class MainScenePanel extends ui.Window{

		public m_offline_tips:eui.Group
		private m_touch_layer:eui.Group
		public btn_help:eui.Button
		public img_help:eui.Image
		public label_time:eui.BitmapLabel
		public label_other_score:eui.Label
		public label_my_score:eui.Label

		public m_other_icon:eui.Image
		public m_me_icon:eui.Image
		public label_other_name:eui.Label
		public label_my_name:eui.Label

		private _gameLogicComponent:GameLogicComponent
		private _commonUIComponent:CommonUIComponent

		public allGameBoardItems:Array<GameBoardItem> = []
		public init_circle_groups:Array<eui.Group> = []

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
			for(let index = 0; index < GameConst.MAX_BOARD_ITEM_COUNT; index++)
			{
				this.allGameBoardItems.push(this['board_item_' + (index + 1)])
			}
			for(let index = 0; index < GameConst.BOARD_ITEM_IN_LINE; index++)
			{
				this.init_circle_groups.push(this['init_circle_' + (index + 1)])
			}
		}

		public resizeStage():void
		{
			super.resizeStage()
			this.validateNow()
		}

		public UpdateTime():void
		{
			GameController.instance.serverModel.left_time = Math.max(GameController.instance.serverModel.left_time, 0)
			this.label_time.text = GameController.instance.serverModel.left_time.toString()
		}

		public UpdateScore():void
		{
			this.label_my_score.text = GameController.instance.serverModel.myRole.score.toString()
			this.label_other_score.text = GameController.instance.serverModel.otherRole.score.toString()
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
		}

		public PlayResultAnimation(callback:Function):void
		{
			if(callback)
			{
				callback()
			}
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
			GameController.instance.StartGame()
			this._gameLogicComponent.OnStart()
		}

	}
}