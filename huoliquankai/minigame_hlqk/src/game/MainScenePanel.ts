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
		public img_high:eui.Image

		private _gameLogicComponent:GameLogicComponent
		private _commonUIComponent:CommonUIComponent

		public m_bg_layer1:eui.Group
		public all_img_bgs:Array<eui.Image> = []
		public prop_container:eui.Group
		public m_bullet_layer:eui.Group
		public m_prop_layer:eui.Group
		private label_broken_score:eui.BitmapLabel

		public img_black_bg:eui.Image

		public m_player:GamePlayer
		
		public constructor() {
			super()
			this.skinName = "MainSceneSkin"

			for(let index = 0; index < GameConst.BG_IN_SCENE; index++)
			{
				this.all_img_bgs.push(this['img_bg_' + (index + 1)])
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
			if(GameController.instance.serverModel.left_time < Const.GAME_TIME / 2){
				this.img_black_bg.visible = true
			}
		}

		public UpdateScore():void
		{
			this.label_my_score.text = GameController.instance.serverModel.myRole.score.toString()
			this.label_other_score.text = GameController.instance.serverModel.otherRole.score.toString()
			this.img_high.visible = false
			if(GameController.instance.serverModel.myRole.score > GameController.instance.serverModel.otherRole.score){
				this.img_high.visible = true
				this.img_high.x = this.width - this.img_high.width / 2
			}else if(GameController.instance.serverModel.myRole.score < GameController.instance.serverModel.otherRole.score){
				this.img_high.visible = true
				this.img_high.x = this.img_high.width / 2
			}
		}

		public ShowBrokenScore(score:number):void
		{
			this.label_broken_score.text = score.toString() + '+s'
			this.label_broken_score.scaleX = this.label_broken_score.scaleY = 5
			this.label_broken_score.visible = true
			let __this = this
			egret.Tween.removeTweens(this.label_broken_score)
			egret.Tween.get(this.label_broken_score).to({scaleX:0.8, scaleY:0.8}, 0.2 * 1000).to({scaleX:1, scaleY:1}, 0.1 * 1000).call(function(){
				CommonUtils.performDelay(function(){
					__this.label_broken_score.visible = false
				}, 0.5 * 1000, this)
			})
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
			if(this.m_touch_layer){
				this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
				this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._TouchMove, this)
				this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._TouchEnd, this)
			}
			GameController.instance.StartGame()
			this._gameLogicComponent.OnStart()
		}

		private last_stage_point:egret.Point = new egret.Point()
		private last_timer:number
		private _onTouchBegin(event:egret.TouchEvent):void
		{
			this._commonUIComponent.OnTouchStart(event.stageX, event.stageY)
			let mainPlayer = this._gameLogicComponent.mainPlayer
			let local_point = mainPlayer.GetNode().parent.globalToLocal(event.stageX, event.stageY)
			this.last_stage_point.x = local_point.x
			this.last_stage_point.y = local_point.y
			this.last_timer = egret.getTimer()
		}

		private _TouchMove(event:egret.TouchEvent):void
		{
			let mainPlayer = this._gameLogicComponent.mainPlayer
			
			let local_point = mainPlayer.GetNode().parent.globalToLocal(event.stageX, event.stageY)
			let delta_x = local_point.x - this.last_stage_point.x
			this.last_stage_point.x = local_point.x
			this.last_stage_point.y = local_point.y
			if(mainPlayer && !mainPlayer.is_stop)
			{
				let target_x = mainPlayer.GetNode().x + delta_x
				target_x = Math.min(target_x, this.width - mainPlayer.GetNode().width)
				target_x = Math.max(target_x, 0)
				mainPlayer.GetNode().x = target_x
			}
			this.last_timer = egret.getTimer()
		}

		private _TouchEnd(event:egret.TouchEvent):void
		{
		}
	}
}
