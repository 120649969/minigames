module ui {
	export class MainScenePanel extends ui.Window{

		public m_floor : eui.Group;
		public m_basket_container_back : eui.Group;
		public m_basket_container_pre : eui.Group;
		public m_board_scope: eui.Group;
		public m_net_scope: eui.Group;
		public m_basket_ball: eui.Group;
		public m_top: eui.Group;
		public m_container : eui.Group;
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

		public img_time_progress:eui.Image
		public label_score_me:eui.Label
		public label_score_other:eui.Label
		public label_left_time:eui.Label

		private btn_debug:eui.Button
		private _playerBall:PlayerBall
		private _hitManager:HitManager

		private _is_first_round:boolean = true;
		private _hasTouchBegin:boolean = false;
		private _hasThisRoundTouch:boolean = false;
		private _is_face_left:boolean = true;
		private _has_goal:boolean = false;

		public serverModel:ServerModel = new ServerModel()
		private _timer:egret.Timer;
		private _is_game_over:boolean = false;
		private _allScores:Array<number> = new Array()
		private _hasInitGame:boolean = false;

		private _board_pre_display:dragonBones.EgretArmatureDisplay
		private _board_back_display:dragonBones.EgretArmatureDisplay
		private _net_pre_display:dragonBones.EgretArmatureDisplay
		private _net_back_display:dragonBones.EgretArmatureDisplay
		private _random_container_y:number = 0

		public constructor() {
			super();
			this.skinName = "MainScene";
			this._initBtnListener()
			this.m_content_container.visible = false
			this.img_shadow.visible = false
			this.label_combo.visible = false
			this.label_add_score.visible = false
			this.img_score_type.visible = false
		}

		public resizeStage():void
		{
			super.resizeStage()
			let design_height = Const.MIN_HEIGHT
			let target_y = (design_height - this.height) / 2
			this.m_top_ui.y = target_y
			if(this._hasGameStarted){
				this.validateNow()
				this._hitManager.EnterNextRound()
			}
		}

		private _initBtnListener():void
		{
			this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
			let __this = this
			this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				//将例子系统添加到舞台
				let debugPanel = new DebugPanel()
				__this.addChild(debugPanel)
				event.stopPropagation();
			}.bind(this), this)
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
				egret.Tween.get(this.img_ready_go_bg).to({alpha : 0.5}, 1 * 1000).call(function(){
					__this.img_go.visible = true
					__this.img_go.scaleX = __this.img_go.scaleY = 6.0
					egret.Tween.get(this.img_go).to({scaleX:1, scaleY:1}, 0.5 * 1000)
					.to({alpha:0}, 2 * 1000).call(function(){
						__this.img_go.visible = false
						__this.StartGame()
					}.bind(this), this)
				}.bind(this), this).to({alpha:0}, 1 * 1000)

				egret.Tween.get(this.img_ready).to({alpha : 0}, 1 * 1000)
			}.bind(this), this)
		}

		//真正开始游戏
		public StartGame():void
		{
			GamePlatform.GetIcon()
			this._hasGameStarted = true
			this._is_first_round = true
			this._hasTouchBegin = false //整个游戏是否点击
			this._hasThisRoundTouch = false //每个回合是否点击
			this._has_goal = false //是否进球
			this._is_game_over = false

			this.img_shadow.visible = true
			this.m_basket_ball.visible = true

			if(!this._hasInitGame){
				this._hitManager = new HitManager(this)
				this._playerBall = new PlayerBall(this.m_basket_ball, this)
				this._hasInitGame = true
			} else {
				this._playerBall.Restart()
			}
			
			this._clearTimer()
			this._startTimer()
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.serverModel.left_time = this.serverModel.MAX_TIME

			if(this.serverModel.myRole.icon.indexOf("baidu") > 0){
			} else {
				if(this.serverModel.myRole.icon){
					this.img_icon_me.source = this.serverModel.myRole.icon
				}
				if(this.serverModel.otherRole.icon){
					this.img_icon_other.source = this.serverModel.otherRole.icon
				}
			}

			this.NextRound()
			this.UpdateScore()
			
		}

		private _startTimer():void
		{
			var timer:egret.Timer = new egret.Timer(1000, this.serverModel.MAX_TIME);
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
			if(this.serverModel.left_time == 0){
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
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			GamePlatform.onFinished(this.serverModel.myRole.score, function(){}.bind(this))
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

		public SetGoal(has_global, score:number):void
		{
			this._has_goal = has_global
			if(has_global){
				this.AddScore(score)
				this._allScores.push(score)
				GameNet.reqShoot(score)
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
			let percent = this.serverModel.left_time / this.serverModel.MAX_TIME
			let down_height = percent * this.img_time_progress.height
			this.img_time_progress.mask = new egret.Rectangle(0, this.img_time_progress.height - down_height, this.img_time_progress.width, down_height)
		}

		public GetPlayerBall():PlayerBall
		{
			return this._playerBall
		}

		
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
				}.bind(this), 1 * 1000, this);
			}
			
			this.validateNow()

			if(this._is_first_round){
				let random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
				let random_ball_y = this.m_floor.y - 300
				this.m_basket_ball.x = random_ball_x
				this.m_basket_ball.y = random_ball_y
			}
			
			this._is_first_round = false;
			
			
			this._hitManager.EnterNextRound()
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
			if(!this._hasGameStarted){
				return
			}
			if(!this._hasTouchBegin)
			{
				this._hasTouchBegin = true;
			}

			this._hasThisRoundTouch = true
			if(this.m_basket_ball.y <= this.m_top.y)
			{
				return;
			}
			
			SoundManager.getInstance().playSound("touch_down_mp3")
			this._playerBall.OnPushDown();
		}

		/********************以下是各种动画******************* */
		private _addAnimation():void
		{
			let armatureDisplay = BasketUtils.createDragonBones("board_pre_ske_json", "board_pre_tex_json", "board_pre_tex_png", "boad_pre_armature")
			this.img_board_pre.parent.addChild(armatureDisplay)
			armatureDisplay.x = this.img_board_pre.x
			armatureDisplay.y = this.img_board_pre.y
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
			if(this._board_pre_display.animation.isPlaying){
				return
			}
			this._board_pre_display.animation.play('lanban', 1)
			this._board_back_display.animation.play('lanban', 1)
			this._net_pre_display.animation.play('lanban', 1)
			this._net_back_display.animation.play('lanban', 1)
		}

		public PlayGoalAnimation()
		{
			this._net_pre_display.animation.stop();
			this._net_pre_display.animation.play('jinqu', 1)
			this._net_back_display.animation.stop();
			this._net_back_display.animation.play('jinqu', 1)
		}

		public PlayKongXingAnimation()
		{
			this._net_pre_display.animation.stop();
			this._net_pre_display.animation.play('kongxinqiu', 1)
			this._net_back_display.animation.stop();
			this._net_back_display.animation.play('kongxinqiu', 1)
		}

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
			}.bind(this), 1000 *0.5, this)
		}

		public PlayNetAnimation(hitNetType:HitNetType)
		{
			if(this._net_pre_display.animation.isPlaying){
				return
			}

			if(hitNetType == HitNetType.CENTER){
				this._net_pre_display.animation.play('up', 1)
				this._net_back_display.animation.play('up', 1)
				return
			}

			if(hitNetType == HitNetType.LEFT){
				if(this.IsFaceLeft()){
					this._net_pre_display.animation.play('R', 1)
					this._net_back_display.animation.play('R', 1)
				} else {
					this._net_pre_display.animation.play('L', 1)
					this._net_back_display.animation.play('L', 1)
				}
			} else {
				if(this.IsFaceLeft()){
					this._net_pre_display.animation.play('L', 1)
					this._net_back_display.animation.play('L', 1)
				} else {
					this._net_pre_display.animation.play('R', 1)
					this._net_back_display.animation.play('R', 1)
				}
			}
		}

		public ShowComboAnimation(combo_count:number):void
		{
			this.label_combo.text = 'cx' + combo_count.toString();
			this.label_combo.scaleX = this.label_combo.scaleY = 0.2
			let __this = this
			this.label_combo.visible = true

			egret.Tween.get(this.label_combo)
			.to({scaleX:1.5, scaleY:1.5}, 0.2 * 1000, egret.Ease.sineInOut)
			.to({scaleX:1, scaleY:1}, 0.1 * 1000)
			.call(function(){
				BasketUtils.performDelay(function(){
					__this.label_combo.visible = false
				}.bind(this), 0.7 * 1000, this)
			}.bind(this), this)
		}

		public ShowScoreAnimation(score:number, lianxu_count:number):void
		{
			this.label_add_score.text = '+ ' + score.toString()
			this.label_add_score.scaleX = this.label_add_score.scaleY = 0.5
			this.label_add_score.visible = true
			this.label_add_score.alpha = 1
			this.label_add_score.anchorOffsetX = this.label_add_score.width / 2
			this.label_add_score.anchorOffsetY = this.label_add_score.height

			let img_path = BasketUtils.GetScorePng(score, lianxu_count);
			if(this.serverModel.left_time <= 1){
				img_path = BasketUtils.YA_SHAO_Png
				let add_score = score
				if(lianxu_count > 1){
					add_score = BasketScore.LIANXU_KONG_XING_GOAL
				}
				let curr_score = this.serverModel.myRole.score
				let last_score = curr_score - add_score
				let other_score = this.serverModel.otherRole.score
				if(last_score < other_score && curr_score > other_score){
					img_path = BasketUtils.JUE_SHA_Png
				}
				SoundManager.getInstance().playSound("yashao_mp3")
			}
			this.img_score_type.source = img_path
			this.img_score_type.anchorOffsetX = this.img_score_type.width / 2
			this.img_score_type.anchorOffsetY = this.img_score_type.height
			this.img_score_type.visible = true
			this.img_score_type.alpha = 1
			this.img_score_type.scaleX = this.label_add_score.scaleY = 0.5

			let global_right_line_point = this.m_right_line.localToGlobal(-50, 0)
			let local_point = this.img_score_type.parent.globalToLocal(global_right_line_point.x, global_right_line_point.y)

			this.img_score_type.x = local_point.x
			this.img_score_type.y = local_point.y - 20

			this.label_add_score.x = this.img_score_type.x
			this.label_add_score.y = this.img_score_type.y - 70

			let __this = this
			egret.Tween.get(this.label_add_score)
			.to({scaleX:1.5, scaleY:1.5},0.2 * 1000, egret.Ease.sineInOut)
			.to({scaleX:1, scaleY:1}, 0.1 * 1000)
			.call(function(){
				BasketUtils.performDelay(function(){
					let cur_x = __this.label_add_score.x
					let cur_y = __this.label_add_score.y
					egret.Tween.get(this.label_add_score).to({x:cur_x, y:cur_y - 100, alpha:0}, 0.4 * 1000).call(function(){
						__this.label_add_score.visible = false
					}.bind(this))
				}.bind(this), 0.7 * 1000, this)
			}.bind(this), this)


			egret.Tween.get(this.img_score_type)
			.to({scaleX:1.5, scaleY:1.5}, 0.2 * 1000, egret.Ease.sineInOut)
			.to({scaleX:1, scaleY:1}, 0.1 * 1000)
			.call(function(){
				BasketUtils.performDelay(function(){
					let cur_x = __this.img_score_type.x
					let cur_y = __this.img_score_type.y
					egret.Tween.get(this.img_score_type).to({x:cur_x, y:cur_y - 100, alpha:0}, 0.4 * 1000).call(function(){
						__this.img_score_type.visible = false
					}.bind(this))
				}.bind(this), 0.7 * 1000, this)
			}.bind(this), this)
		}

		/**************************以下的网络交互************************** */
		private _hasGameStarted:boolean = false;

		private onShootJoinPush(msgId, body):void
		{
		}

		private onShootGameStartPush(msgId, body):void
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
					
					this.PlayReadyAnimation()
				}
			}
		}

		private onShootGameStatusPush(msgId, body):void
		{

		}

		private onShootSecondush(msgId, body):void
		{
			let second = body['second']
			let left_time = Const.GAME_TIME - second
			// this.serverModel.left_time = left_time
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
			GameNet.on(protocol.CMD_H5_SHOOT_SECOND_PUSH, this.onShootSecondush.bind(this)); //游戏时间推送
			GameNet.on(protocol.CMD_H5_SHOOT_GAME_OVER_PUSH, this.onGameOverPush.bind(this)); // 游戏结束推送
			GameNet.on(protocol.CMD_H5_SHOOT_SCORE_PUSH, this.onShootScorePush.bind(this)); //游戏分数推送

			GamePlatform.onInit(function(){}.bind(this)); //onInit
			this.run();
			GamePlatform.onWaiting(function(){}.bind(this)); //onWaiting
		}

		private async run() {
			await GameNet.connectServer();

			await GameNet.reqLogin(User.roomId);

			let __this = this
			await GameNet.reqJoin(function(body){
			});
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

			super.onClose();
		}
	}
}