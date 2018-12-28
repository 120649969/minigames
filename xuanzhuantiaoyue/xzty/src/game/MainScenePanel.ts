module ui {

	export class MainScenePanel extends ui.BaseGameScene{

		public battleContainer:eui.Group
		public uiContainer:eui.Group
		public btn_change:eui.Button
		public backgroundContainer:eui.Group

		public backgrounds:Array<eui.Group> = []
		
		private img_lingxian:eui.Image

		private btn_debug:eui.Button
		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
			for(let index = 0; index < GameConst.BG_NUM; index++)
			{
				this.backgrounds.push(this['background' + (index + 1)])
			}

			let __this = this
			CommonUtils.Add_Btn_Click(this.btn_debug, function(){
				__this.GetGameLogicComponent().OnReceiveOtherStone()
			}, this)
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
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			if(this._commonUIComponent.OnTouchStart(event.stageX, event.stageY)){
				return
			}
			this.GetGameLogicComponent().OnTouchJump()
		}

		public UpdateScore():void
		{
			let my_score = GameController.instance.serverModel.myRole.score
			let other_score = GameController.instance.serverModel.otherRole.score
			this.label_my_score.text = my_score.toString()
			this.label_other_score.text = other_score.toString()
			if(my_score == other_score){
				this.img_lingxian.visible = false
			}else if (my_score > other_score){
				this.img_lingxian.visible = true
				this.img_lingxian.x = this.width - this.img_lingxian.width
			}else{
				this.img_lingxian.visible = true
				this.img_lingxian.x = 0
			}
		}
	}
}