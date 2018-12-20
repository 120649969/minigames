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

		public m_bg_layer1:eui.Group
		public all_img_bgs:Array<eui.Image> = []
		public prop_container:eui.Group

		public m_player:eui.Image
		public constructor() {
			super()
			this.skinName = "MainSceneSkin"

			for(let index = 0; index < GameConst.BG_IN_SCENE; index++)
			{
				this.all_img_bgs.push(this['img_bg_' + (index + 1)])
			}
		}

		public UpdateTime():void
		{
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
			if(this.m_touch_layer){
				this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
				this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._TouchMove, this)
				this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_END, this._TouchEnd, this)
			}
			GameController.instance.StartGame()
			this._gameLogicComponent.OnStart()
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
		}

		private _TouchMove(event:egret.TouchEvent):void
		{
		}

		private _TouchEnd(event:egret.TouchEvent):void
		{
		}
	}
}
