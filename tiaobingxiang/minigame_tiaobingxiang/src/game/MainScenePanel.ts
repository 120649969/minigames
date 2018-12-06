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

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
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

			this._setProgress(10)

			this.StartGame()
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

		private _setProgress(percent:number):void
		{
			let rate = percent / 100
			let other_rect = new egret.Rectangle(0, 0, this.m_other_progress.width * rate, this.m_other_progress.height)
			this.m_other_progress.mask = other_rect
			let me_rect = new egret.Rectangle(this.m_other_progress.width * rate, 0, this.m_me_progress.width * (1 - rate), this.m_me_progress.height)
			this.m_me_progress.mask = me_rect
		}

		private _updateBg():void
		{
			let last_bg = this.m_img_bgs[this.m_img_bgs.length - 1]
			let global_point = last_bg.localToGlobal(0, 0)
			if(global_point.y >= this.height){
				this.m_img_bgs.splice(this.m_img_bgs.length - 1)
				this.m_img_bgs.unshift(last_bg)
			}
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
			CommonUtils.performDelay(function(){
				GamePlatform.onFinished()
			}.bind(this), platform_finish_delay_time * 1000, this)
		}

		public GetMaxY():number
		{
			return this.height - 60
		}

		public StartGame():void
		{
			this.last_box_y = this.GetMaxY()
			this.current_box_y = this.GetMaxY()
			this.mainPlayer = new GamePlayer(this)
			this.addChild(this.mainPlayer)
			this.mainPlayer.y = this.current_box_y
			this.mainPlayer.x = this.width / 2

			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)

			let __this = this
			CommonUtils.performDelay(function(){
				__this.GenerateNextBox()
			}, 2 * 1000, this)
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
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
				let has_update = false
				this.mainPlayer.Update(function(time_scale){
					has_update = true
					if(__this.currentBox)
					{
						__this.currentBox.Update(time_scale)
					}
				})
				if(!has_update)
				{
					if(this.currentBox)
					{
						let time_scale = 1 / 30
						for(let index = 0; index < 30; index ++)
						{
							this.currentBox.Update(time_scale)
						}
						
					}
					
				}
			}
		}
		
		public currentBox:GameBox
		public mainPlayer:GamePlayer
		private _is_left_to_right:boolean = true
		public current_box_y = 0
		public last_box_y = 0
		private m_container:eui.Group
		public GenerateNextBox():void
		{
			if(this.currentBox && !this.currentBox.isOver){
				return
			}

			if(this.currentBox && this.currentBox.isReStart)
			{
				this.currentBox.ReStart()
				return
			}

			let newBox = new GameBox(this)
			this.currentBox = newBox
			if(this._is_left_to_right){
				this.currentBox.x = 0 - this.currentBox.width
				this.currentBox.speed_x = 20
				this.mainPlayer.move_speed_x = 30
			} else {
				this.currentBox.x = this.width + this.currentBox.width
				this.currentBox.speed_x = -20
				this.mainPlayer.move_speed_x = -30
			}
			this.last_box_y = this.current_box_y
			this.currentBox.y = this.current_box_y

			this.currentBox.init_x = this.currentBox.x
			this.currentBox.init_y = this.currentBox.y
			this.current_box_y -= this.currentBox.height
			this._is_left_to_right = !this._is_left_to_right
			this.m_container.addChild(this.currentBox)
		}
	}
}