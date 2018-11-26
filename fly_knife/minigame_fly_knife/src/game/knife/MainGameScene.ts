module ui{
	export class MainGameScene extends ui.Window{

		private m_touch_layer:eui.Group
		private m_knife_object:KnifeObject
		private m_container_layer:eui.Group
		public m_plate_container:eui.Group
		private m_example_knife:eui.Image
		public m_plate_image:eui.Image
		public m_plate_object:PlateObject
		private labelResult:eui.Label
		private label_round:eui.Label
		private m_top_ui:eui.Group
	
		private btn_prop_knife:eui.Button
		private btn_debug:eui.Button

		private _all_knife_imgs:Array<eui.Image> = []
		private fly_up:egret.tween.TweenGroup

		public current_round:number = 0
		public all_round_configs:Array<RoundConfig> = []
		private _waiting_join:boolean = true

		public serverModel:ServerModel = new ServerModel()
		private _is_game_over:boolean = false
		private _timer:egret.Timer


		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this)

			let round_native_configs:Array<Object>  = RES.getRes("rounds_json")
			for(let index = 0; index < round_native_configs.length; index ++)
			{
				let native_config = round_native_configs[index]
				let round_config = new RoundConfig(native_config)
				this.all_round_configs.push(round_config)
			}
		}

		public resizeStage():void
		{
			super.resizeStage()
			let design_height = Const.MIN_HEIGHT
			let target_y = (design_height - this.height) / 2
			target_y = 0
			this.m_top_ui.y = target_y
		}

		private _onAddToStage(event:egret.Event):void
		{
		}

		protected createChildren(): void {
			super.createChildren();

			for(let index = 1; index <= 10; index++)
			{
				let img = this['img_knife_' + index]
				this._all_knife_imgs.push(img)
			}

			let __this = this
			this.btn_prop_knife.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				__this.m_plate_object.WaitToInsertNewKnife()
				event.stopPropagation()
			}.bind(this), this)

			this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				ui.WindowManager.getInstance().open("SettingPanel")
				event.stopPropagation()
			}.bind(this), this)

			this.m_plate_container.visible = false
			this.m_top_ui.visible = false
		}

		public StartGame():void
		{
			this.m_plate_container.visible = true
			this.m_top_ui.visible = true

			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)

			this.m_plate_object = new PlateObject(this)
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)

			this.validateNow()

			this.NextRound()
			
			this._startTimer()
		}

		public ReStartGame():void
		{
			if(this.m_knife_object){
				this.m_knife_object.Destory()
				this.m_knife_object = null
			}
			if(this._other_knife_object){
				this._other_knife_object.Destory()
				this._other_knife_object = null
			}
			this.NextRound()
		}

		public NextRound():void
		{
			this.label_round.text = "第" + (this.current_round + 1) + "关"
			this.labelResult.visible = false
			let round_config = this.all_round_configs[this.current_round]
			round_config.Reset()
			this.m_plate_object.EnterNextBigRound(round_config)
			this.GenerateNextKnife()
			for(let index = 0; index < this._all_knife_imgs.length; index++)
			{
				let img = this._all_knife_imgs[index]
				img.source = 'knifeicon12_png'
			}
		}

		public OnGetScore():void
		{
			let knife_count = this.m_plate_object.GetAllMyKnifeCount()
			let img = this._all_knife_imgs[knife_count - 1]
			img.source = 'knifeicon11_png'
		}

		private _onEnterFrame(event:egret.Event):void
		{
			if(this.m_knife_object){
				this.m_knife_object.Update()
			}

			this.m_plate_object.Update()

			if(this._other_knife_object){
				this._other_knife_object.Update()

				if(this._other_knife_object.is_end){
					this._other_knife_object = null
				}
			}
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			if(this.m_knife_object){
				if(this.m_knife_object.is_end){
					return
				}
				this.m_knife_object.StartTouchMove()
			}
		}

		public GenerateNextKnife():void
		{
			this.m_knife_object = new KnifeObject(this)
			this.m_container_layer.addChild(this.m_knife_object)
			this.m_knife_object.StartBirthMove(this.m_example_knife.x, this.m_example_knife.y)
		}

		private _other_knife_object:KnifeObject
		public GenerateOtherKnife():void
		{
			if(this._other_knife_object)
			{
				return
			}
			let new_other_knife = new KnifeObject(this)
			new_other_knife.isMe = false
			new_other_knife.x = this.m_plate_container.x + this.m_plate_container.width / 2 + 100
			new_other_knife.y = this.m_plate_container.y - this.m_plate_container.height / 2  - 100
			new_other_knife.rotation = 225
			new_other_knife.speedY = 100
			new_other_knife.speedX = -100
			new_other_knife.acceY = 0
			this.m_container_layer.addChild(new_other_knife)
			this._other_knife_object = new_other_knife
		}

		private _is_last_round_win:boolean = false
		public ShowResult(isWin:boolean):void
		{
			if(isWin){
				this.labelResult.text = "恭喜您 闯关成功"
			} else {
				this.labelResult.text = "很遗憾 闯关失败"
			}
			this._is_last_round_win = isWin
			this.labelResult.visible = true
			this.fly_up.play(1)
			this.fly_up.removeEventListener('complete', this._onPlayFlyUpCompelete, this);
			this.fly_up.addEventListener('complete', this._onPlayFlyUpCompelete, this);
		}

		private _onPlayFlyUpCompelete():void
		{
			if(this._is_last_round_win){
				this.current_round = (this.current_round + 1) % this.all_round_configs.length
				GameNet.reqSwitch()
			}
			this.NextRound()
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

		private _clearTimer():void
		{
			if(this._timer)
			{
				this._timer.stop();
				this._timer = null
			}
		}

		private _clearGame():void
		{
			this.m_plate_container.visible = false
			this._clearTimer()
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		}

		//游戏结束
		private _on_game_over():void
		{
			if(this._is_game_over)
			{
				return
			}
			
			this._is_game_over = true
			this._clearGame()

			//延迟一点时间弹出去
			let platform_finish_delay_time = 2
			KnifeUtils.performDelay(function(){
				GamePlatform.onFinished()
			}.bind(this), platform_finish_delay_time * 1000, this)
		}

		private onLevelPush():void
		{

		}

		private onRefreshPush():void
		{

		}

		private onUsePropPush():void
		{

		}

		private onDisconnected():void
		{

		}

		private onJoinPush():void
		{

		}

		private onGameStatusPush():void
		{

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

				this.StartGame()
			}
		}

		private onGameStartPush(msgId, body):void
		{
			if(!this._waiting_join){
				this._real_join(body)
				return	
			}
			let __this = this
			KnifeUtils.performDelay(function(){
				__this._real_join(body)
			}.bind(this), 1 * 1000, this)
		}

		private onGameSecondPush(msgId, body):void
		{
			let left_time = body['second']
			if(Math.abs(left_time - this.serverModel.left_time) > 2){
				this.serverModel.left_time = left_time
			}
		}

		private onGameScorePush():void
		{

		}

		private onGameOverPush():void
		{
			this._on_game_over()
		}

		private onGameReEnterPush():void
		{

		}

		public onOpen():void
		{
			super.onOpen()

			let protocol = io.GameNet.GAME_PROTOCOL;
			GameNet.on(protocol.CMD_H5_KNIFE_LEVEL_PUSH, this.onLevelPush.bind(this));
			GameNet.on(protocol.CMD_H5_KNIFE_REFRESH_PUSH, this.onRefreshPush.bind(this));
			GameNet.on(protocol.CMD_H5_KNIFE_USEPROP_PUSH, this.onUsePropPush.bind(this));

			GameNet.on(protocol.CMD_H5_JOIN_PUSH, this.onJoinPush.bind(this)); //游戏进入推送
			GameNet.on(protocol.CMD_H5_GAME_STATUS_PUSH, this.onGameStatusPush.bind(this));  //游戏状态推送
			GameNet.on(protocol.CMD_H5_GAME_START_PUSH, this.onGameStartPush.bind(this)); //游戏开始推送
			GameNet.on(protocol.CMD_H5_SECOND_PUSH, this.onGameSecondPush.bind(this)); //游戏时间推送
			GameNet.on(protocol.CMD_H5_SCORE_PUSH, this.onGameScorePush.bind(this)); //游戏分数推送
			GameNet.on(protocol.CMD_H5_GAME_OVER_PUSH, this.onGameOverPush.bind(this)); //游戏结束推送
			GameNet.on(protocol.CMD_H5_REENTER_PUSH, this.onGameReEnterPush.bind(this)); //游戏重进推送

			GameNet.onDisconnected = this.onDisconnected.bind(this)

			GamePlatform.onInit(); //onInit
			this.run();
			this._waiting_join = true
			let __this = this
			KnifeUtils.performDelay(function(){
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
