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
		public label_other_score:eui.Label
		public label_my_score:eui.Label
		public label_add_line:eui.BitmapLabel
		public label_time:eui.BitmapLabel
		public label_combo:eui.BitmapLabel
		public label_combo_score:eui.BitmapLabel

		public m_addline_tips:eui.Group
		public m_game_container:eui.Group
		public m_combo_group:eui.Group
		public m_effect_container:eui.Group

		public m_leaf:eui.Image
		public m_line_light:eui.Image
		public m_fixline:FixLine

		public m_floor:eui.Group
		public m_line:eui.Rect
		public m_start:eui.Group
		public m_rotate_line:eui.Rect
		public m_ui_down:eui.Group

		public m_skill_add_line:eui.Group
		public m_skill_invalid_ball:eui.Group
		public m_add_line_mask:eui.Rect
		public m_invalid_ball_mask:eui.Rect
		
		private _gameLogicComponent:GameLogicComponent
		private _commonUIComponent:CommonUIComponent

		private mBoxLines:Array<BallLine> = []
		private btn_debug:eui.Button

		private m_skill_tips:eui.Group
		private skill_add_line_tips:eui.Image
		private skill_valid_ball_tips:eui.Image

		public is_add_line_skill_open:boolean = false
		public is_invalid_ball_skill_open:boolean = false
		public is_in_add_line_cd:boolean = false
		public is_in_invalid_skill_cd:boolean = false

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
			let __this = this
			this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
				// ui.WindowManager.getInstance().open("DebugPanel")
				__this.PlayFailAnimation(function(){
					console.log("#####PlayFailAnimation#####")
				})
			}.bind(this), this)

			if(!DEBUG){
				this.btn_debug.visible = false
			}
			CommonUtils.GrayDisplayObject(this.m_skill_add_line)
			CommonUtils.GrayDisplayObject(this.m_skill_invalid_ball)

			
			this.m_skill_add_line.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
				if(!__this.is_add_line_skill_open){
					return
				}
				if(__this.is_in_add_line_cd){
					return
				}
				__this.is_in_add_line_cd = true
				CommonUtils.performDelay(function(){
					__this.is_in_add_line_cd = false
				}, 30 * 1000, __this)
				GameNet.reqUseProp(SKILL_PROP_TYPE.ADD_LINE)
				CommonUtils.addSkillArcMask(this.m_add_line_mask, 30 * 1000, function(){
					__this.is_in_add_line_cd = false
				})
			}.bind(this), this)

			this.m_skill_invalid_ball.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
				if(!__this.is_invalid_ball_skill_open){
					return
				}
				if(__this.is_in_invalid_skill_cd){
					return
				}
				__this.is_in_invalid_skill_cd = true
				CommonUtils.performDelay(function(){
					__this.is_in_invalid_skill_cd = false
				}, 30 * 1000, __this)
				GameNet.reqUseProp(SKILL_PROP_TYPE.INVALID_BALL)
				CommonUtils.addSkillArcMask(this.m_invalid_ball_mask, 30 * 1000,function(){
					__this.is_in_invalid_skill_cd = false
				})
			}.bind(this), this)
		}

		public OpenAddLineSkill():void
		{
			this.m_skill_add_line.filters = []
			this.is_add_line_skill_open = true
		}

		public OpenInvalidBallSkill():void
		{
			this.m_skill_invalid_ball.filters = []
			this.is_invalid_ball_skill_open = true
		}

		public ShowMoveDownSkillTips():void
		{
			this.m_skill_tips.visible = true
			this.skill_add_line_tips.visible = true
			let __this = this
			CommonUtils.performDelay(function(){
				__this.m_skill_tips.visible = false
				__this.skill_add_line_tips.visible = false
			}, 2 * 1000, this)
		}

		public ShowValidBallSkillTips():void
		{
			this.m_skill_tips.visible = true
			this.skill_valid_ball_tips.visible = true
			let __this = this
			CommonUtils.performDelay(function(){
				__this.m_skill_tips.visible = false
				__this.skill_valid_ball_tips.visible = false
			}, 2 * 1000, this)
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
			this.m_game_container.mask = new egret.Rectangle(0, -80, this.m_game_container.width, this.m_game_container.height)

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
			this.PlayLineLightMoveAnimation()
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

		public PlayLineLightMoveAnimation():void
		{
			this.m_line_light.visible = true
			let left_x = 0
			let right_x = this.width - this.m_line_light.width
			egret.Tween.get(this.m_line_light, {loop:true}).to({x:right_x}, 3 * 1000).to({x:left_x}, 3 * 1000)
		}

		public PlayCombAnimation(combo_times:number):void
		{
			this.label_combo.text = "x" + combo_times.toString()
			this.m_combo_group.visible = true
			this.m_combo_group.x = this.width / 2
			this.m_combo_group.y = this.height / 2
			this.m_combo_group.scaleX = this.m_combo_group.scaleY = 3
			let __this = this
			egret.Tween.get(this.m_combo_group).to({scaleX:0.8, scaleY:0.8}, 0.2 * 1000).to({scaleX:1, scaleY:1}, 0.1 * 1000).call(function(){
				CommonUtils.performDelay(function(){
					 __this.m_combo_group.visible = false
				}, 0.5 * 1000, __this)
			})

			if(combo_times > 1){
				this.label_combo_score.visible = true
				this.label_combo_score.text = "x" + (combo_times - 1) * 8
				this.label_combo_score.x = this.width / 2
				this.label_combo_score.y = this.height / 2 - 200
				this.label_combo_score.alpha = 1
				egret.Tween.get(this.label_combo_score).to({y:this.height / 2 - 240}, 0.4 * 1000).to({y:this.height / 2 - 280, alpha:0}, 0.4 * 1000).call(function(){
					__this.label_combo_score.visible = false
				}, this)
			}
		}

		public PlayFlyUpNumberAnimation(balls:Array<Ball>):void
		{
			for(let ball of balls)
			{
				let label = new eui.BitmapLabel()
				label.font = "combo_fnt"
				label.textAlign = "center"
				label.text = "x10"
				label.scaleX = label.scaleY = 0.8
				this.m_effect_container.addChild(label)
				let global_point = ball.localToGlobal(ball.width / 2, ball.height / 2)
				let local_point = this.m_effect_container.globalToLocal(global_point.x, global_point.y)
				label.anchorOffsetX = label.width / 2
				label.anchorOffsetY = label.height / 2
				label.x = local_point.x
				label.y = local_point.y

				egret.Tween.get(label).to({y:local_point.y - 40}, 0.4 * 1000).to({y:local_point.y - 80, alpha:0}, 0.4 * 1000).call(function(){
					label.parent.removeChild(label)
				}, this)
			}
		}

		public PlayResultAnimation(callback:Function):void
		{
			if(GameController.instance.is_win){
				this.PlayWinAnimation(callback)
			}else if(GameController.instance.is_fail){
				this.PlayFailAnimation(callback)
			}else{
				this.PlayEqualAnimation(callback)
			}
		}

		public PlayWinAnimation(callback:Function):void
		{
			SoundManager.getInstance().playSound("win_mp3")
			let armatureDisplay = CommonUtils.createDragonBones("win_ske_json", "win_tex_json", "win_tex_png", "win_armature")
			this.addChild(armatureDisplay)
			armatureDisplay.x = this.stage.stageWidth / 2
			armatureDisplay.y = this.stage.stageHeight / 2
			armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				armatureDisplay.visible = false
				if(callback){
					callback()
				}
			}, this)
			armatureDisplay.animation.play("win_animation", 1)
		}

		public PlayFailAnimation(callback:Function):void
		{
			SoundManager.getInstance().playSound("fail_mp3")
			let armatureDisplay = CommonUtils.createDragonBones("fail_ske_json", "fail_tex_json", "fail_tex_png", "fail_armature")
			this.addChild(armatureDisplay)
			

			let global_line_point = this.m_line.localToGlobal(0, 0)
			let local_point = this.globalToLocal(global_line_point.x, global_line_point.y)

			armatureDisplay.x = this.stage.stageWidth / 2
			armatureDisplay.y = local_point.y
			armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				armatureDisplay.visible = false
				if(callback){
					callback()
				}
			}, this)
			armatureDisplay.animation.play("fail_animation", 1)
		}

		public PlayEqualAnimation(callback:Function):void
		{
			if(callback){
				callback()
			}
		}
	}
}