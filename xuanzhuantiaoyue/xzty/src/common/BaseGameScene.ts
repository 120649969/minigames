module ui {
	export class BaseGameScene extends ui.Window{

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

		protected _gameLogicComponent:BaseComponent
		protected _commonUIComponent:CommonUIComponent

		public constructor() {
			super()
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
		}

		public GetCommonUIComponent():CommonUIComponent
		{
			return this._commonUIComponent
		}

		public GetGameLogicComponent():BaseComponent
		{
			return this._gameLogicComponent
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