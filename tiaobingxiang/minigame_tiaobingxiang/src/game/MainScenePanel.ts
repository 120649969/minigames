module ui {
	export class MainScenePanel extends ui.Window{

		private m_bg:eui.Group
		private m_img_bgs:Array<eui.Image> = []
		private m_other_icon_bg:eui.Image
		private m_me_icon_bg:eui.Image
		private m_other_icon:eui.Image
		private m_me_icon:eui.Image
		private m_other_progress:eui.Image
		private m_me_progress:eui.Image
		private m_touch_layer:eui.Group
		public serverModel:ServerModel = new ServerModel()
		private _is_game_over:boolean = false
		private _timer:egret.Timer
		public m_display_player:egret.DisplayObject
		public m_floor:eui.Rect

		private btn_debug:eui.Button
		private btn_help:eui.Button
		private img_help:eui.Image
		private _offline_score:number = 0
		private m_moveContainer:eui.Group
		private m_animationContainer:eui.Group

		private img_equal:eui.Image
		private labelScore:eui.Label
		private img_score_type:eui.Image

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
		}

		public resizeStage():void
		{
			super.resizeStage()
			this.validateNow()
			this.ResizeUpdateBg()
		}

		protected createChildren(): void {
			super.createChildren()

			this.validateNow()

			for(let index = 0; index < GameConst.M_BG_NUM; index ++)
			{
				let img_bg = this["bg_" + (index + 1)]
				this.m_img_bgs.push(img_bg)
			}

			this._addCircleMask(this.m_other_icon, this.m_other_icon_bg.x, this.m_other_icon_bg.y,this.m_other_icon_bg.width / 2 - 5)
			this._addCircleMask(this.m_me_icon, this.m_me_icon_bg.x, this.m_me_icon_bg.y, this.m_me_icon_bg.width / 2 - 5)

			if(DEBUG){
				this.btn_debug.visible = true
				this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
					WindowManager.getInstance().open("DebugPanel")
					event.stopPropagation()
				}.bind(this), this)
			}

			let __this = this
			this.btn_help.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
				if(__this.img_help.visible){
					__this.HideHelp()
				} else {
					__this.ShowHelp()
				}
				// event.stopPropagation()
			}.bind(this), this)

			this._addAnimation()

			this._updateProgress()
		}

		private ShowHelp():void
		{
			let global_btn_help_point = this.btn_help.localToGlobal(0, 0)
			let delta_y = this.height - global_btn_help_point.y
			let max_scale = (delta_y - 50) / (this.img_help.height)
			max_scale = Math.min(max_scale, 1)
			this.img_help.visible = true
			this.img_help.scaleX = this.img_help.scaleY = 0
			egret.Tween.get(this.img_help).to({"scaleX": max_scale, "scaleY": max_scale}, 0.2 *1000)
		}

		private HideHelp():void
		{
			let __this = this
			egret.Tween.get(__this.img_help).to({"scaleX": 0, "scaleY": 0}, 0.1 *1000).call(function(){
				__this.img_help.visible = false
			})
		}

		private _shadow_display:dragonBones.EgretArmatureDisplay
		private _comb_display:dragonBones.EgretArmatureDisplay
		private _ready_go_armatureDisplay:dragonBones.EgretArmatureDisplay
		private _addAnimation():void
		{
			let armatureDisplay = CommonUtils.createDragonBones("shadow_ske_json", "shadow_tex_json", "shadow_tex_png", "shadow_armature")
			this.m_animationContainer.addChild(armatureDisplay)
			this._shadow_display = armatureDisplay
			armatureDisplay.visible = false

			let __this = this
			this._shadow_display.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this._shadow_display.visible = false
			}, this)

			armatureDisplay = CommonUtils.createDragonBones("comb_ske_json", "comb_tex_json", "comb_tex_png", "comb_armature")
			this.m_animationContainer.addChild(armatureDisplay)
			this._comb_display = armatureDisplay
			armatureDisplay.visible = false
			this._comb_display.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this._comb_display.visible = false
			}, this)

			let armatureDisplay4 = CommonUtils.createDragonBones("ready_go_ske_json", "ready_go_tex_json", "ready_go_tex_png", "ready_go_armature")
			this.addChild(armatureDisplay4)
			armatureDisplay4.visible = false
			this._ready_go_armatureDisplay = armatureDisplay4
			armatureDisplay4.x = this.stage.stageWidth / 2
			armatureDisplay4.y = this.stage.stageHeight / 2
		}

		public PlayLandOnAnimation():void
		{
			this._shadow_display.visible = true
			this._shadow_display.animation.play('shadow_animation', 1)
			this._shadow_display.x = this.mainPlayer.x
			this._shadow_display.y = this.mainPlayer.y
		}

		public PlayCombAnimation():void
		{
			this._comb_display.visible = true
			this._comb_display.animation.play('comb_animation', 1)

			let last_box = this.all_boxs[this.all_boxs.length - 1]
			this._comb_display.x = last_box.x
			this._comb_display.y = last_box.y - last_box.height
		}

		public PlayReadyAnimation():void
		{
			let __this = this
			this._ready_go_armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this.StartGame()
				__this._ready_go_armatureDisplay.visible = false
			}, this)
			this._ready_go_armatureDisplay.animation.play("ready_go_animation", 1)
			this._ready_go_armatureDisplay.visible = true
			SoundManager.getInstance().playSound("ready_go_mp3");
		}

		private _init_debug_role():void
		{
			this.serverModel.AddRole({openid:User.openId.toString()})
			this.serverModel.AddRole({})
		}

		private _addCircleMask(img_icon:eui.Image, x:number, y:number, radius:number):void
		{
			let circle2:egret.Shape = new egret.Shape();
			circle2.graphics.beginFill(0x0000ff);
			circle2.graphics.drawCircle(x, y, radius);
			circle2.graphics.endFill();
			img_icon.parent.addChild(circle2);
			img_icon.mask = circle2
		}

		private m_seperator:eui.Image
		private m_shadow:eui.Image

		private _updateProgress():void
		{
			let other_score = 0
			let me_score = 0
			if(this.serverModel.otherRole && this.serverModel.myRole){
				other_score = this.serverModel.otherRole.score
				me_score = this.serverModel.myRole.score
			}
			let rate = 0.5
			if(other_score == 0 && me_score == 0){
				rate = 0.5
			} else {
				rate = (other_score) / (other_score + me_score)
			}
			let other_rect = new egret.Rectangle(0, 0, this.m_other_progress.width * rate, this.m_other_progress.height)
			this.m_other_progress.mask = other_rect
			let me_rect = new egret.Rectangle(this.m_other_progress.width * rate, 0, this.m_me_progress.width * (1 - rate), this.m_me_progress.height)
			this.m_me_progress.mask = me_rect
			this.m_seperator.x = this.m_other_progress.width * rate - this.m_seperator.width / 2
			this.img_equal.visible = false
			this.img_score_type.visible = false
			this.labelScore.visible = false
			if(other_score < me_score){
				this.labelScore.text = (me_score - other_score).toString()
				this.img_score_type.visible = true
				this.labelScore.visible = true
				this.img_score_type.source = "winnumber_png"
			} else if(other_score > me_score){
				this.labelScore.text = (other_score - me_score).toString()
				this.img_score_type.visible = true
				this.labelScore.visible = true
				this.img_score_type.source = "losenumber_png"
			} else {
				// this.labelScore.text = "旗鼓相当"
				this.img_equal.visible = true
			}
		}

		public UpdateBg():void
		{
			if(!this.mainPlayer){
				return
			}
			let global_center_buttom_point = this.mainPlayer.m_hit_rect.localToGlobal(this.mainPlayer.m_hit_rect.width / 2, this.mainPlayer.m_hit_rect.height)
			let delta_y = 0
			if(global_center_buttom_point.y < this.height / 2){
				let cur_y = this.m_moveContainer.y
				let target_y = cur_y + GameConst.BOX_HEIGHT
				egret.Tween.get(this.m_moveContainer).to({y:target_y}, 0.3 * 1000)
				delta_y = GameConst.BOX_HEIGHT
			}
			let last_bg = this.m_img_bgs[this.m_img_bgs.length - 1]
			let global_point = last_bg.localToGlobal(0, 0)
			if(global_point.y + delta_y >= this.height + 100){
				this.m_img_bgs.splice(this.m_img_bgs.length - 1)
				this.m_img_bgs.unshift(last_bg)
				last_bg.y -= last_bg.height * GameConst.M_BG_NUM
			}
		}

		public ResizeUpdateBg():void
		{
			if(!this.mainPlayer){
				return
			}
			let global_center_buttom_point = this.mainPlayer.m_hit_rect.localToGlobal(this.mainPlayer.m_hit_rect.width / 2, this.mainPlayer.m_hit_rect.height)
			let delta_y = 0
			if(global_center_buttom_point.y < this.height / 2){
				let cur_y = this.m_bg.y
				let target_y = this.height / 2
				let local_in_point = this.mainPlayer.parent.globalToLocal(0, target_y)
				delta_y = local_in_point.y - this.mainPlayer.y
				egret.Tween.get(this.m_moveContainer).to({y:this.m_moveContainer.y + delta_y}, 0.3 * 1000)
				
			}
			let last_bg = this.m_img_bgs[this.m_img_bgs.length - 1]
			let global_point = last_bg.localToGlobal(0, 0)
			if(global_point.y + delta_y >= this.height + 100){
				this.m_img_bgs.splice(this.m_img_bgs.length - 1)
				this.m_img_bgs.unshift(last_bg)
				last_bg.y -= last_bg.height * GameConst.M_BG_NUM
			}
		}

		private _startTimer():void
		{
			var timer:egret.Timer = new egret.Timer(1000, GameConst.GAME_TIME);
			//注册事件侦听器
			timer.addEventListener(egret.TimerEvent.TIMER,this._on_timer_tick,this);
			//开始计时
			timer.start();
			this._timer = timer
		}

		private labelTime:eui.Label
		private _update_time():void
		{
			this.labelTime.text = this.serverModel.left_time.toString()
		}

		private _on_timer_tick():void
		{
			this.serverModel.left_time -= 1
			this.serverModel.left_time = Math.max(this.serverModel.left_time, 0)
			this._update_time()
			//只有在未连接服务器的时候才自动结束，要不然等服务器的推送才结束
			if(this.serverModel.left_time <= 0 && !this._is_game_over && !GameNet.isConnected())
			{
				this._on_game_over()
			}

			if(this.serverModel.left_time <= 0)
			{
				this._clearGame()
			}
		}

		private _clearGame():void
		{
			this._clearTimer()
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		}

		private _clearTimer():void
		{
			if(this._timer)
			{
				this._timer.stop();
				this._timer = null
			}
		}

		//游戏结束
		private _on_game_over():void
		{
			if(this._is_game_over)
			{
				return
			}
			
			this._is_game_over = true

			//延迟一点时间弹出去
			let platform_finish_delay_time = 2
			GamePlatform.onCalculating()
			CommonUtils.performDelay(function(){
				GamePlatform.onFinished()
			}.bind(this), platform_finish_delay_time * 1000, this)
			this._clearTimer()
		}

		public GetFloorY():number
		{
			return this.m_floor.y
		}

		public AddScore(score:number):void
		{
			this.serverModel.myRole.score += score
			this._updateProgress()
			GameNet.reqChangeScore(score)
		}

		private labelComb:eui.BitmapLabel
		public ShowScoreAnimation(score:number, comb_times:number):void
		{
			this.labelComb.text = "+" + score.toString()
			this.labelComb.y = this.mainPlayer.y - this.mainPlayer.height - 50 - this.labelComb.height
			let __this = this
			__this.labelComb.visible = true
			egret.Tween.get(this.labelComb).to({y:this.labelComb.y - 100}, 0.5 * 1000).call(function(){
				__this.labelComb.visible = false
			}.bind(this), this)
			if(!GameNet.isConnected()){
				this._offline_score += score
			}
		}

		public StartGame():void
		{
			this.m_shadow.visible = true
			this._updateProgress()
			this._update_time()
			this.current_box_y = this.GetFloorY()
			this.mainPlayer = new GamePlayer(this)
			this.m_container.addChild(this.mainPlayer)
			this.mainPlayer.y = this.current_box_y
			this.mainPlayer.x = this.width / 2

			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)

			let __this = this
			CommonUtils.performDelay(function(){
				__this.GenerateNextBox()
			}, 2 * 1000, this)
			this._startTimer()

			if(!DEBUG){ 
				egret.ImageLoader.crossOrigin = "anonymous" //支持跨域
				if(this.serverModel.myRole.icon){
					this.m_me_icon.source = this.serverModel.myRole.icon
				}
				if(this.serverModel.otherRole.icon){
					this.m_other_icon.source = this.serverModel.otherRole.icon
				}
			}
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			if(this.img_help.visible){
				this.HideHelp()
				return
			}
			if(this.mainPlayer)
			{
				this.mainPlayer.OnTouch()
			}
		}

		private _onEnterFrame(event:egret.Event):void
		{
			if(this.mainPlayer)
			{
				let __this = this
				this.mainPlayer.Update(function(time_scale){
					if(__this.currentBox)
					{
						__this.currentBox.Update(time_scale)
					}
				})
			}
		}
		
		public currentBox:GameBox
		public mainPlayer:GamePlayer
		public is_left_to_right:boolean = false
		public current_box_y = 0
		private m_container:eui.Group
		public all_boxs:Array<GameBox> = []
		public box_height:number = 0
		public GenerateNextBox():void
		{
			if(this.currentBox && this.currentBox.isReStart)
			{
				this.currentBox.ReStart()
				return
			}

			if(this.currentBox && !this.currentBox.isOver){
				return
			}
			
			this.is_left_to_right = CommonUtils.GetRandomPositive() == 1 ? true : false
			let newBox = new GameBox(this)
			if(this.all_boxs.length > 0){
				this.current_box_y -= newBox.height
			}
			
			this.currentBox = newBox
			if(this.is_left_to_right){
				this.currentBox.x = 0 - this.currentBox.width / 2
				this.currentBox.speed_x = GameConst.BOX_MOVE_SPEED_X
				this.mainPlayer.move_speed_x = GameConst.PLAYER_MOVE_SPEED_INIT_X
			} else {
				this.currentBox.x = this.width + this.currentBox.width / 2
				this.currentBox.speed_x = -1 * GameConst.BOX_MOVE_SPEED_X
				this.mainPlayer.move_speed_x = -1 * GameConst.PLAYER_MOVE_SPEED_INIT_X
			}
			this.currentBox.y = this.current_box_y
			this.currentBox.init_x = this.currentBox.x
			this.currentBox.init_y = this.currentBox.y
			this.m_bg.addChild(this.currentBox)
			this.all_boxs.push(this.currentBox)
			this.box_height = this.currentBox.height
			if(this.is_left_to_right){
				this.mainPlayer.PlayLeftAnimation()
			}else{
				this.mainPlayer.PlayRightAnimation()
			}
		}

		private _real_join(body):void
		{
			GamePlatform.onStarted(function(){}.bind(this)); //onStarted
			if(body['player_list'])
			{
				let player_list:Array<Object> = body['player_list'] as Array<Object>
				if(player_list && player_list.length > 0)
				{
					for(let index = 0; index < player_list.length; index ++)
					{
						this.serverModel.AddRole(player_list[index])
					}
				}

				this.PlayReadyAnimation()
			}

			GamePlatform.registerSurrenderCallback(function(){
				GameNet.reqSurrend()
			})
		}

		private _waiting_join:boolean = false
		private onGameStartPush(msgId, body):void
		{
			if(!this._waiting_join){
				this._real_join(body)
				return	
			}
			let __this = this
			CommonUtils.performDelay(function(){
				__this._real_join(body)
			}.bind(this), 1 * 1000, this)
		}

		private onGameSecondPush(msgId, body):void
		{
			let left_time = body['second']
			if(Math.abs(left_time - this.serverModel.left_time) > 2){
				this.serverModel.left_time = left_time
			}
			this._update_time()
		}

		private onGameScorePush(msgId, body):void
		{
			this.serverModel.UpdateRoleScore(body)
			this._updateProgress()
		}

		private onGameOverPush(msgId, body):void
		{
			this._on_game_over()
		}

		private onGameReEnterPush(msgId, body):void
		{
			this._offline_score = 0
			this.serverModel.ReEnterUpdateRoleInfo(body.player_list, body.score)
			this._updateProgress()
		}

		private m_offline_tips:eui.Group
		private is_connecting:boolean = false
		private onDisconnected():void
		{
			this.m_offline_tips.visible = true
			if(this._is_game_over){
				return
			}
			GameNet.onDisconnected = this.onDisconnected.bind(this)
			if(this.is_connecting){
				let __this = this
				CommonUtils.performDelay(function(){
					if(this._is_game_over){
						return
					}
					if(GameNet.isConnected()){
						return
					}
					__this.is_connecting = true
					__this.reconnect()
				}.bind(this), 3 * 1000, this)
				return
			}
			this.is_connecting = true
			this.reconnect()
		}

		private async reconnect()
		{
			await GameNet.connectServer()
			await GameNet.reqLogin(User.roomId)
			//断线重连 同步我的分数给服务器
			await GameNet.reqReEnter(this._offline_score)
			this.is_connecting = false
			this.m_offline_tips.visible = false
		}

		private onShootGameStatusPush():void
		{
		}

		public onOpen():void
		{
			super.onOpen()

			if(Config.debug){
				this._init_debug_role()
				this.PlayReadyAnimation()
				return
			}
			let protocol = io.GameNet.GAME_PROTOCOL;
			GameNet.on(protocol.CMD_H5_GAME_START_PUSH, this.onGameStartPush.bind(this)); //游戏开始推送
			GameNet.on(protocol.CMD_H5_SECOND_PUSH, this.onGameSecondPush.bind(this)); //游戏时间推送
			GameNet.on(protocol.CMD_H5_GAME_STATUS_PUSH, this.onShootGameStatusPush.bind(this)); //游戏状态推送
			GameNet.on(protocol.CMD_H5_SCORE_PUSH, this.onGameScorePush.bind(this)); //游戏分数推送
			GameNet.on(protocol.CMD_H5_GAME_OVER_PUSH, this.onGameOverPush.bind(this)); //游戏结束推送
			GameNet.on(protocol.CMD_H5_REENTER_PUSH, this.onGameReEnterPush.bind(this)); //游戏重进推送
			GameNet.onDisconnected = this.onDisconnected.bind(this)

			GamePlatform.onInit(); //onInit
			this.run();
			this._waiting_join = true
			let __this = this
			CommonUtils.performDelay(function(){
				__this._waiting_join = false
			}.bind(this), 1 * 1000, this)
			GamePlatform.onWaiting(function(){}.bind(this)); //onWaiting
		}

		private async run() {
			await GameNet.connectServer();
			await GameNet.reqLogin(User.roomId);
			await GameNet.reqJoin();
		}
	}
}