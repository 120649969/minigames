module ui {
	export class MainScenePanel extends ui.Window{

		public m_floor:eui.Group
		public m_basket_container_back:eui.Group
		public m_basket_container_pre:eui.Group
		public m_board_scope:eui.Group
		public m_net_scope:eui.Group
		public m_basket_ball:eui.Group
		public m_top:eui.Group
		public m_container:eui.Group
		public m_image_ball:eui.Image
		public m_right_line:eui.Group
		public m_left_line:eui.Group
		public m_circle_scope:eui.Group  //篮圈
		public m_board_top_circle:eui.Group
		public m_board_down_circle:eui.Group
		public img_board_back:eui.Image
		public img_board_pre:eui.Image
		public img_net_pre:eui.Image
		public img_net_back:eui.Image
		public m_decision_container:eui.Group
		public img_board_body:eui.Image
		public img_icon_me:eui.Image
		public img_icon_other:eui.Image
		public m_content_container:eui.Group
		public img_shadow:eui.Image
		public img_ready_go_bg:eui.Image
		public img_go:eui.Image
		public img_ready:eui.Image
		public label_combo:eui.BitmapLabel
		public img_score_type:eui.Image
		public label_add_score:eui.Label
		public m_top_ui:eui.Group
		public btn_help:eui.Button
		public score_fire_container:eui.Group
		public img_time_progress:eui.Image
		public label_score_me:eui.Label
		public label_score_other:eui.Label
		public label_left_time:eui.Label
		public img_juesha:eui.Image
		public img_guide_circle:eui.Image
		public img_guide_hand:eui.Image
		public m_guide_group:eui.Group
		public img_help:eui.Image
		public btn_debug:eui.Button
		public m_offline_tips:eui.Group

		private _playerBall:PlayerBall
		private _hitManager:HitManager

		private _is_first_round:boolean = true
		private _hasTouchBegin:boolean = false
		private _hasThisRoundTouch:boolean = false
		private _is_face_left:boolean = true
		private _has_goal:boolean = false

		public serverModel:ServerModel = new ServerModel()
		private _timer:egret.Timer
		private _is_game_over:boolean = false
		private _allScores:Array<number> = new Array()
		private _hasInitGame:boolean = false
		private _random_container_y:number = 0
		private _hasGameStarted:boolean = false;
		private _waiting_join:boolean = false  //等待匹配进入有一个1秒的停留时间
		private is_connecting:boolean = false
		private _is_ya_shao:boolean = false

		private _board_pre_display:dragonBones.EgretArmatureDisplay
		private _board_back_display:dragonBones.EgretArmatureDisplay
		private _net_pre_display:dragonBones.EgretArmatureDisplay
		private _net_back_display:dragonBones.EgretArmatureDisplay
		
		public constructor() {
			super();
			this.skinName = "MainScene";
			this._initBtnListener()
			this.m_content_container.visible = false
			this.img_shadow.visible = false
			this.label_combo.visible = false
			this.label_add_score.visible = false
			this.img_score_type.visible = false
			this.label_left_time.visible = false
		}

		public resizeStage():void
		{
			super.resizeStage()
			let design_height = Const.MIN_HEIGHT
			let target_y = (design_height - this.height) / 2
			this.m_top_ui.y = target_y
			if(this._hasGameStarted){
				this.validateNow()
				this._hitManager.UpateHitData()
			}
		}

		private _initBtnListener():void
		{
			this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
			let __this = this
			this.btn_help.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				__this.img_help.visible = true
				__this.img_help.scaleX = __this.img_help.scaleY = 0
				egret.Tween.get(__this.img_help).to({"scaleX": 1, "scaleY": 1}, 0.2 *1000)
				event.stopPropagation()
			}.bind(this), this)

			this.btn_help.addEventListener(egret.TouchEvent.TOUCH_END, function(event:egret.Event){
			egret.Tween.get(__this.img_help).to({"scaleX": 0, "scaleY": 0}, 0.1 *1000).call(function(){
					__this.img_help.visible = false
				})
			}.bind(this), this)

			this.btn_help.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function(event:egret.Event){
				egret.Tween.get(__this.img_help).to({"scaleX": 0, "scaleY": 0}, 0.1 *1000).call(function(){
					__this.img_help.visible = false
				})
			}.bind(this), this)

			this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				// let debugPanel = new DebugPanel()
				// this.addChild(debugPanel)
				event.stopPropagation()
			}.bind(this), this)
		}

		private _addParticle():void
		{
			var texture=RES.getRes("newParticleY_png");
			var config=RES.getRes("newParticleY_json");
			let  lizi_item=new particle.GravityParticleSystem(texture,config);
			this.addChild(lizi_item);
			lizi_item.start();
			lizi_item.x = this.width / 2 - Math.random() * 50
			lizi_item.y = this.height / 2 - Math.random() * 50
		}

		//真正开始游戏
		public StartGame():void
		{
			this._showGuide()
			this._hasGameStarted = true
			this._is_first_round = true
			this._hasTouchBegin = false //整个游戏是否点击
			this._hasThisRoundTouch = false //每个回合是否点击
			this._has_goal = false //是否进球
			this._is_game_over = false

			this.img_shadow.visible = true
			this.m_basket_ball.visible = true
			this.label_left_time.visible = true

			if(!this._hasInitGame){
				this._hitManager = new HitManager(this)
				this._playerBall = new PlayerBall(this.m_basket_ball, this)
				this._hasInitGame = true
			} else {
				this._playerBall.Restart()
			}
			
			this._clearTimer()
			this._startTimer()
			this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.serverModel.left_time = Const.GAME_TIME

			if(this.serverModel.myRole.icon.indexOf("baidu") > 0){
			} else {
				// if(this.serverModel.myRole.icon){
				// 	this.img_icon_me.source = this.serverModel.myRole.icon
				// }
				// if(this.serverModel.otherRole.icon){
				// 	this.img_icon_other.source = this.serverModel.otherRole.icon
				// }
			}

			this.NextRound()
			this.UpdateScore()
		}

		private _showGuide():void
		{
			let value = egret.localStorage.getItem("guide4")
			if(value){
				return
			}

			let __this = this
			this.img_guide_circle.visible = true
			this.img_guide_circle.scaleX = this.img_guide_circle.scaleY = 1
			egret.Tween.get(this.img_guide_circle, {loop:true}).to({scaleX:2, scaleY:2}, 0.5 * 1000).call(function(){
				__this.img_guide_circle.scaleX = __this.img_guide_circle.scaleY = 1
			})

			this.img_guide_hand.visible = true
			this.img_guide_hand.scaleX = this.img_guide_hand.scaleY = 2
			this.m_guide_group.scaleX = this.m_guide_group.scaleY = 1
			this.m_guide_group.visible = true
			egret.Tween.get(__this.img_guide_hand, {loop:true}).to({scaleX:1.6, scaleY:1.6}, 0.3 * 1000).call(function(){
				egret.Tween.get(__this.m_guide_group).to({scaleX:0.98, scaleY:0.98}, 0.2 * 1000, egret.Ease.sineIn).to({scaleX:1, scaleY:1}, 0.2 * 1000)
			}).to({scaleX:1, scaleY:1}, 0.2 * 1000).call(function(){
				__this.img_guide_hand.scaleX = __this.img_guide_hand.scaleY = 2
			})
			
			// egret.localStorage.setItem("guide4", "true")
		}

		private _startTimer():void
		{
			var timer:egret.Timer = new egret.Timer(1000, Const.GAME_TIME);
			//注册事件侦听器
			timer.addEventListener(egret.TimerEvent.TIMER,this._on_timer_tick,this);
			//开始计时
			timer.start();
			this._timer = timer
		}

		private _on_timer_tick():void
		{
			this.serverModel.left_time -= 1
			this.UpdateScore()
			if(this.serverModel.left_time <= 0 && !this._is_game_over)
			{
				this._on_game_over()
			}
			if(this.serverModel.left_time == 0 && !this._is_ya_shao){
				SoundManager.getInstance().playSound("last_one_second_mp3")
			} else if(this.serverModel.left_time <= 5){
				SoundManager.getInstance().playSound("dead_line_tips_mp3")
			}
		}

		private _clearTimer():void
		{
			if(this._timer)
			{
				this._timer.stop();
			}
		}

		protected createChildren(): void {
			super.createChildren();
			this._addAnimation()
		}

		//游戏结束
		private _on_game_over():void
		{
			if(this._is_game_over)
			{
				return
			}
			this._is_game_over = true
			this.m_basket_ball.visible = false;
			this.img_shadow.visible = false;
			this._playerBall.OnGameOver()
			this._clearTimer()

			//延迟一点时间弹出去
			let platform_finish_delay_time = 2
			BasketUtils.performDelay(function(){
				GamePlatform.onFinished()
			}.bind(this), platform_finish_delay_time * 1000, this)
			
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		}

		public SetGoal(has_global, score:number):void
		{
			this._has_goal = has_global
			if(has_global){
				this._allScores.push(score)
				if(GameNet.isConnected() || Config.debug){
					this.AddScore(score)
					GameNet.reqShoot(score)
				}
				this._playerBall.UpdateCurrentAfterImage()
				this.NextRound()
			}
		}

		public AddScore(score:number):void
		{
			this.serverModel.myRole.score += score
			this.UpdateScore()
		}

		public UpdateScore():void
		{
			this.label_score_me.text = this.serverModel.myRole.score.toString();
			this.label_score_other.text = this.serverModel.otherRole.score.toString();
			this.label_left_time.text = this.serverModel.left_time.toString();
			let percent = this.serverModel.left_time / Const.GAME_TIME
			let start_y = 10
			let down_height = percent * (this.img_time_progress.height - 2 * start_y)
			this.img_time_progress.mask = new egret.Rectangle(0, this.img_time_progress.height - start_y - down_height, this.img_time_progress.width, down_height)

			if(this._hasGameStarted){
				this.label_score_me.anchorOffsetX = this.label_score_me.width / 2
				this.label_score_other.anchorOffsetX = this.label_score_other.width / 2
				this._playerBall.UpdateScoreFire()
			}
		}

		//进球后马上修改判定框位置
		private _updateDecisionPosition():void
		{
			let scale_rate = 1
			if(this._is_face_left){
				this.m_decision_container.x = 0
				scale_rate = 1
			}else{
				this.m_decision_container.x = this.stage.stageWidth
				scale_rate = -1
			}
			
			this.m_decision_container.y = this._random_container_y
			this.m_decision_container.scaleX = Math.abs(this.m_decision_container.scaleX) * scale_rate;
		}

		//进球后，延迟一定时间调整篮筐篮架位置
		private _updateBasketContainerPosition():void
		{
			let scale_rate = 1
			if(this._is_face_left){
				this.m_basket_container_pre.x = 0
				this.m_basket_container_back.x = 0
				scale_rate = 1
			}else{
				this.m_basket_container_pre.x = this.stage.stageWidth
				this.m_basket_container_back.x = this.stage.stageWidth
				scale_rate = -1
			}
			
			this.m_basket_container_pre.y = this._random_container_y
			this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_pre.scaleX) * scale_rate;

			this.m_basket_container_back.y = this._random_container_y
			this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX) * scale_rate;
		}

		public NextRound():void
		{
			this.SetGoal(false, 0);
			this._is_face_left = !this._is_face_left
			this._random_container_y = this.stage.stageHeight / 2 - Math.random() * 200
			if(this._is_first_round){
				this._is_face_left = true
			}

			this._hasThisRoundTouch = false;
			if(!this._is_first_round)
			{
				this._updateDecisionPosition()
				let __this = this
				BasketUtils.performDelay(function(){
					__this._updateBasketContainerPosition()
				}.bind(this), 0.4 * 1000, this)
			}
			
			this.validateNow() //立马刷新，要不然当前帧计算判定框信息会出现问题

			if(this._is_first_round){
				let random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
				let random_ball_y = this.m_floor.y - 300
				this.m_basket_ball.x = random_ball_x
				this.m_basket_ball.y = random_ball_y
			}
			
			this._is_first_round = false
			this._hitManager.UpateHitData()
			this._playerBall.EnterNextRound()

		}

		private _onEnterFrame(event : egret.Event):void
		{
			if(!this._hasGameStarted){
				return
			}
			if(this._is_game_over){
				this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
				return
			}
			
			this._playerBall.Update()
		}

		private _onTouchBegin(event : egret.TouchEvent):void
		{
			this.img_guide_circle.visible = false
			this.img_guide_hand.visible = false
			this.m_guide_group.visible = false
			if(!this._hasGameStarted){
				return
			}
			if(!this._hasTouchBegin)
			{
				this._hasTouchBegin = true;
			}

			this._hasThisRoundTouch = true
			if(this.m_basket_ball.y <= this.m_top.y)  //超过了一定的位置后，点击无效
			{
				return;
			}
			
			SoundManager.getInstance().playSound("touch_down_mp3")
			this._playerBall.OnPushDown()
		}

		/********************以下是各种动画******************* */
		private _addAnimation():void
		{
			let armatureDisplay = BasketUtils.createDragonBones("board_pre_ske_json", "board_pre_tex_json", "board_pre_tex_png", "boad_pre_armature")
			this.img_board_pre.parent.addChild(armatureDisplay)
			armatureDisplay.x = this.img_board_pre.x
			armatureDisplay.y = this.img_board_pre.y + 20
			this._board_pre_display = armatureDisplay

			let armatureDisplay2 = BasketUtils.createDragonBones("board_back_ske_json", "board_back_tex_json", "board_back_tex_png", "boad_back_armature")
			this.img_board_back.parent.addChild(armatureDisplay2)
			armatureDisplay2.x = this.img_board_back.x
			armatureDisplay2.y = this.img_board_back.y
			this._board_back_display = armatureDisplay2

			let armatureDisplay3 = BasketUtils.createDragonBones("net_back_ske_json", "net_back_tex_json", "net_back_tex_png", "net_back_armature")
			this.img_net_back.parent.addChild(armatureDisplay3)
			armatureDisplay3.x = this.img_net_back.x
			armatureDisplay3.y = this.img_net_back.y
			this.img_net_back.parent.setChildIndex(armatureDisplay3, 1)
			this._net_back_display = armatureDisplay3

			let armatureDisplay4 = BasketUtils.createDragonBones("net_pre_ske_json", "net_pre_tex_json", "net_pre_tex_png", "net_pre_armature")
			this.img_net_pre.parent.addChild(armatureDisplay4)
			armatureDisplay4.x = this.img_net_pre.x
			armatureDisplay4.y = this.img_net_pre.y
			this.img_net_pre.parent.setChildIndex(armatureDisplay4, 1)
			this._net_pre_display = armatureDisplay4

			this.img_board_pre.visible = false
			this.img_board_back.visible = false
			this.img_net_back.visible = false
			this.img_net_pre.visible = false
		}

		//篮筐抖动
		public PlayShakeAnimation()
		{
			if(this._net_pre_display.animation.isPlaying){
				return
			}
			this._board_pre_display.animation.play('lanban', 1)
			this._board_back_display.animation.play('lanban', 1)
			this._net_pre_display.animation.play('lanban', 1)
			this._net_back_display.animation.play('lanban', 1)
		}

		//进球动画
		public PlayGoalAnimation()
		{
			this._board_pre_display.animation.stop()
			this._board_back_display.animation.stop()
			this._board_pre_display.animation.play('normal', -1)
			this._board_back_display.animation.play('normal', -1)
			this._net_pre_display.animation.stop()
			this._net_pre_display.animation.play('jinqu', 1)
			this._net_back_display.animation.stop()
			this._net_back_display.animation.play('jinqu', 1)
		}

		//篮筐变黑
		public PlayBlackNetAnimation()
		{
			BasketUtils.SetColor(this._net_back_display, 0x000000)
			BasketUtils.SetColor(this._net_pre_display, 0x000000)
			BasketUtils.SetColor(this.img_board_body, 0x000000)
			BasketUtils.SetColor(this._board_pre_display, 0x000000)
			BasketUtils.SetColor(this._board_back_display, 0x000000)
			let __this = this
			BasketUtils.performDelay(function(){
				__this._net_back_display.filters = []
				__this._net_pre_display.filters = []
				__this.img_board_body.filters = []
				__this._board_pre_display.filters = []
				__this._board_back_display.filters = []
			}.bind(this), 1000 *0.3, this)
		}

		public PlayNetAnimation(hitNetType:HitNetType)
		{
			if(this._net_pre_display.animation.isPlaying){
				return
			}

			if(hitNetType == HitNetType.LEFT){
				if(this.IsFaceLeft()){
					this._net_pre_display.animation.play('right', 1)
					this._net_back_display.animation.play('right', 1)
				} else {
					this._net_pre_display.animation.play('left', 1)
					this._net_back_display.animation.play('left', 1)
				}
			} else {
				if(this.IsFaceLeft()){
					this._net_pre_display.animation.play('left', 1)
					this._net_back_display.animation.play('left', 1)
				} else {
					this._net_pre_display.animation.play('right', 1)
					this._net_back_display.animation.play('right', 1)
				}
			}
		}

		//连击
		public ShowComboAnimation(combo_count:number):void
		{
			this.label_combo.text = combo_count.toString() + 'xc'
			this.label_combo.scaleX = this.label_combo.scaleY = 0.2
			let __this = this
			this.label_combo.visible = true
			this._playComboEffect(this.label_combo)
		}

		private _playComboEffect(displayObject:egret.DisplayObject):void
		{
			egret.Tween.get(displayObject)
			.to({scaleX:1.5, scaleY:1.5}, 0.2 * 1000, egret.Ease.sineInOut)
			.to({scaleX:1, scaleY:1}, 0.1 * 1000)
			.call(function(){
				BasketUtils.performDelay(function(){
					displayObject.visible = false
				}.bind(this), 0.7 * 1000, this)
			}.bind(this), this)
		}
		private _playFlyEffect(displayObject:egret.DisplayObject):void
		{
			egret.Tween.get(displayObject)
			.to({scaleX:1.5, scaleY:1.5}, 0.2 * 1000, egret.Ease.sineInOut)
			.to({scaleX:1, scaleY:1}, 0.1 * 1000)
			.call(function(){
				BasketUtils.performDelay(function(){
					let cur_x = displayObject.x
					let cur_y = displayObject.y
					egret.Tween.get(displayObject).to({x:cur_x, y:cur_y - 100, alpha:0}, 0.4 * 1000).call(function(){
						displayObject.visible = false
					}.bind(this))
				}.bind(this), 0.7 * 1000, this)
			}.bind(this), this)
		}

		//得分特效
		public ShowScoreAnimation(score:number, lianxu_count:number):void
		{
			let is_juesha = false
			let img_path = BasketUtils.GetScorePng(score, lianxu_count);
			if(score == BasketScore.YA_SHAO_GOAL){
				img_path = BasketUtils.YA_SHAO_Png
				let add_score = score
				if(lianxu_count > 1){
					add_score = BasketScore.LIANXU_KONG_XING_GOAL
				}
				let curr_score = this.serverModel.myRole.score
				let last_score = curr_score - add_score
				let other_score = this.serverModel.otherRole.score
				if(last_score < other_score && curr_score > other_score){
					// img_path = BasketUtils.JUE_SHA_Png
					is_juesha = true
				}
				SoundManager.getInstance().playSound("yashao_mp3")

				this._is_ya_shao = true
			}

			this.img_score_type.source = img_path
			this.img_score_type.anchorOffsetX = this.img_score_type.width / 2
			this.img_score_type.anchorOffsetY = this.img_score_type.height
			this.img_score_type.visible = true
			this.img_score_type.alpha = 1
			this.img_score_type.scaleX = this.img_score_type.scaleY = 0.5

			if(score == BasketScore.YA_SHAO_GOAL){
				if(is_juesha){
					this.img_juesha.visible = true
				}
				
				let global_point = this.img_juesha.localToGlobal(this.img_juesha.width / 2, 0)
				let local_point = this.img_score_type.parent.globalToLocal(global_point.x, global_point.y)
				
				this.img_score_type.x = local_point.x
				this.img_score_type.y = local_point.y - 20
				this._playComboEffect(this.img_score_type)
			} else {
				let global_right_line_point = this.m_right_line.localToGlobal(-50, 0)
				let local_point = this.img_score_type.parent.globalToLocal(global_right_line_point.x, global_right_line_point.y)

				this.img_score_type.x = local_point.x
				this.img_score_type.y = local_point.y - 20
				this.img_juesha.visible = false
				this._playFlyEffect(this.img_score_type)
			}

			

			if(is_juesha){
				this.img_juesha.scaleX = this.img_juesha.scaleY = 0.5
				this._playComboEffect(this.img_juesha)
			}
			
			if(score != BasketScore.YA_SHAO_GOAL){
				this.label_add_score.text = '+ ' + score.toString()
				this.label_add_score.scaleX = this.label_add_score.scaleY = 0.5
				this.label_add_score.visible = true
				this.label_add_score.alpha = 1
				this.label_add_score.anchorOffsetX = this.label_add_score.width / 2
				this.label_add_score.anchorOffsetY = this.label_add_score.height
				this.label_add_score.x = this.img_score_type.x
				this.label_add_score.y = this.img_score_type.y - 70

				this._playFlyEffect(this.label_add_score)
			}
		}

		//播放准备动画
		public PlayReadyAnimation():void
		{
			this.m_content_container.visible = true
			this.m_basket_ball.visible = false
			this.img_ready_go_bg.visible = true
			this.img_ready.visible = true
			let __this = this
			this.img_ready_go_bg.scaleY = 0.9
			egret.Tween.get(this.img_ready_go_bg).to({scaleY:1.0}, 0.5 * 1000).call(function(){
				egret.Tween.get(this.img_ready_go_bg).to({alpha : 0.5}, 0.5 * 1000).call(function(){
					__this.img_go.visible = true
					__this.img_go.scaleX = __this.img_go.scaleY = 6.0
					egret.Tween.get(this.img_go).to({scaleX:1, scaleY:1}, 0.5 * 1000)
					.to({alpha:0}, 1 * 1000).call(function(){
						__this.img_go.visible = false
						__this.StartGame()
					}.bind(this), this)
				}.bind(this), this).to({alpha:0}, 1 * 1000)

				egret.Tween.get(this.img_ready).to({alpha : 0}, 1 * 1000)
			}.bind(this), this)
			SoundManager.getInstance().playSound("ready_go_mp3")
		}

		/**************************以下的网络交互************************** */
		private onShootJoinPush(msgId, body):void
		{
		}

		private _real_join(body):void
		{
			GamePlatform.onStarted(function(){}.bind(this)); //onStarted
			if(body['player_list'])
			{
				// log("####", body)
				let player_list:Array<Object> = body['player_list'] as Array<Object>
				if(player_list && player_list.length > 0)
				{
					for(let index = 0; index < player_list.length; index ++)
					{
						this.serverModel.AddRole(player_list[index])
					}
					
					this.PlayReadyAnimation()
				}
			}
		}

		private onShootGameStartPush(msgId, body):void
		{
			if(!this._waiting_join){
				this._real_join(body)
				return	
			}
			let __this = this
			BasketUtils.performDelay(function(){
				__this._real_join(body)
			}.bind(this), 1 * 1000, this)
		}

		private onShootGameStatusPush(msgId, body):void
		{

		}

		private onShootSecondPush(msgId, body):void
		{
			let second = body['second']
			let left_time = Const.GAME_TIME - second
			if(Math.abs(left_time - this.serverModel.left_time) > 2){
				this.serverModel.left_time = left_time
			}
		}

		private onGameOverPush(msgId, body):void
		{
			this._on_game_over()
		}

		private onShootScorePush(msgId, body):void
		{
			this.serverModel.UpdateRoleScore(body)
			this.UpdateScore()
		}

		
		private onDisconnected():void
		{
			this.m_offline_tips.visible = true
			if(this._is_game_over){
				return
			}
			GameNet.onDisconnected = this.onDisconnected.bind(this)
			if(this.is_connecting){
				let __this = this
				BasketUtils.performDelay(function(){
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
			let total = 0
			for(let index = 0; index < this._allScores.length; index++)
			{
				total += this._allScores[index]
			}
			await GameNet.reqReEnter(total)
			this.is_connecting = false
			this.m_offline_tips.visible = false
		}

		private onReEnterPush(msgId, body)
		{
			this.serverModel.ReEnterUpdateRoleInfo(body.player_list, body.score)
			this.UpdateScore()
		}

		public onOpen():void
		{
			super.onOpen()

			if(Config.debug){
				this._createDebug()
				return
			}
			let protocol = io.GameNet.GAME_PROTOCOL;
			GameNet.on(protocol.CMD_H5_SHOOT_JOIN_PUSH, this.onShootJoinPush.bind(this));
			GameNet.on(protocol.CMD_H5_SHOOT_GAME_START_PUSH, this.onShootGameStartPush.bind(this));  //游戏开始推送
			GameNet.on(protocol.CMD_H5_SHOOT_GAME_STATUS_PUSH, this.onShootGameStatusPush.bind(this)); //游戏状态推送
			GameNet.on(protocol.CMD_H5_SHOOT_SECOND_PUSH, this.onShootSecondPush.bind(this)); //游戏时间推送
			GameNet.on(protocol.CMD_H5_SHOOT_GAME_OVER_PUSH, this.onGameOverPush.bind(this)); // 游戏结束推送
			GameNet.on(protocol.CMD_H5_SHOOT_SCORE_PUSH, this.onShootScorePush.bind(this)); //游戏分数推送
			GameNet.on(protocol.CMD_H5_SHOOT_REENTER_PUSH, this.onReEnterPush.bind(this))
			GameNet.onDisconnected = this.onDisconnected.bind(this)

			GamePlatform.onInit(); //onInit
			this.run();
			this._waiting_join = true
			let __this = this
			BasketUtils.performDelay(function(){
				__this._waiting_join = false
			}.bind(this), 1 * 1000, this)
			GamePlatform.onWaiting(function(){}.bind(this)); //onWaiting
		}

		private async run() {
			await GameNet.connectServer();
			await GameNet.reqLogin(User.roomId);
			await GameNet.reqJoin();
		}

		private _createDebug():void
		{
			let role_info_me = {}
			role_info_me['Id'] = User.openId
			role_info_me['level'] = 1
			role_info_me['nickname'] = "User1"
			role_info_me['icon'] = ""
			this.serverModel.AddRole(role_info_me)
			let role_info_other = {}
			role_info_me['Id'] = User.openId + 1
			role_info_me['level'] = 2
			role_info_me['nickname'] = "User2"
			role_info_me['icon'] = ""
			this.serverModel.AddRole(role_info_other)
			this.PlayReadyAnimation()
		}

		public onClose():void {
			let protocol = io.GameNet.GAME_PROTOCOL;
			GameNet.off(protocol.CMD_H5_SHOOT_JOIN_PUSH);
			GameNet.off(protocol.CMD_H5_SHOOT_GAME_START_PUSH);  //游戏开始推送
			GameNet.off(protocol.CMD_H5_SHOOT_GAME_STATUS_PUSH); //游戏状态推送
			GameNet.off(protocol.CMD_H5_SHOOT_SECOND_PUSH); //游戏时间推送
			GameNet.off(protocol.CMD_H5_SHOOT_GAME_OVER_PUSH); // 游戏结束推送
			GameNet.off(protocol.CMD_H5_SHOOT_SCORE_PUSH); //游戏分数推送
			GameNet.off(protocol.CMD_H5_SHOOT_REENTER_PUSH)
			super.onClose();
		}

		public HasTouchBegin():boolean
		{
			return this._hasTouchBegin
		}

		public GetHitManager():HitManager
		{
			return this._hitManager
		}

		public HasThisRoundTouch():boolean
		{
			return this._hasThisRoundTouch
		}

		public IsFaceLeft()
		{
			return this._is_face_left
		}

		public HasGoal():boolean
		{
			return this._has_goal
		}

		public GetAllScores():Array<number>
		{
			return this._allScores
		}

		public GetPlayerBall():PlayerBall
		{
			return this._playerBall
		}
	}
}