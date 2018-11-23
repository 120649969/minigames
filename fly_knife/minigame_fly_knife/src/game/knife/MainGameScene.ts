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
		private btn_test:eui.Button
		private btn_debug:eui.Button

		private _all_knife_imgs:Array<eui.Image> = []
		private fly_up:egret.tween.TweenGroup

		public current_round:number = 0
		public all_round_configs:Array<RoundConfig> = []

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
			this.btn_test.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				__this.m_plate_object.WaitToInsertNewKnife()
				event.stopPropagation()
			}.bind(this), this)

			this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				ui.WindowManager.getInstance().open("SettingPanel", __this)
				event.stopPropagation()
			}.bind(this), this)

			this.StartGame()
		}

		public StartGame():void
		{
			this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
			this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)

			this.m_plate_object = new PlateObject(this)
			this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)

			this.validateNow()

			this.NextBigRound()
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
			this.NextBigRound()
		}

		public NextBigRound():void
		{
			this.labelResult.visible = false
			let native_round_config = this.all_round_configs[this.current_round]
			this.m_plate_object.EnterNextBigRound(native_round_config)
			this.NextRound()
			for(let index = 0; index < this._all_knife_imgs.length; index++)
			{
				let img = this._all_knife_imgs[index]
				if(index <= this.m_plate_object.GetMaxKnifeCount() - 1){
					img.visible = true
					KnifeUtils.SetColor(img, 0x909090)
				} else {
					img.visible = false
				}
			}
		}

		public OnGetScore():void
		{
			let knife_count = this.m_plate_object.GetAllMyKnifeCount()
			let img = this._all_knife_imgs[knife_count - 1]
			img.filters = []
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
			let new_other_knife = new KnifeObject(this)
			new_other_knife.isMe = false
			new_other_knife.x = this.m_plate_container.x + this.m_plate_container.width / 2 + 100
			new_other_knife.y = this.m_plate_container.y - this.m_plate_container.height / 2  - 100
			new_other_knife.rotation = 225
			new_other_knife.speedY = 100
			new_other_knife.speedX = -100
			new_other_knife.acceY = 0
			KnifeUtils.SetColor(new_other_knife.m_img, 0x7f0000)
			this.m_container_layer.addChild(new_other_knife)
			this._other_knife_object = new_other_knife
		}

		public NextRound():void
		{
			this.m_plate_object.EnterNextRound()
			this.GenerateNextKnife()
		}

		private _isWin:boolean = false
		public ShowResult(isWin:boolean):void
		{
			if(isWin){
				this.labelResult.text = "恭喜您 闯关成功"
			} else {
				this.labelResult.text = "很遗憾 闯关失败"
			}
			this._isWin = isWin
			this.labelResult.visible = true
			this.fly_up.play(1)
			this.fly_up.removeEventListener('complete', this._onPlayFlyUpCompelete, this);
			this.fly_up.addEventListener('complete', this._onPlayFlyUpCompelete, this);
		}

		private _onPlayFlyUpCompelete():void
		{
			if(this._isWin){
				this.current_round = (this.current_round + 1) % this.all_round_configs.length
			}
			this.NextBigRound()
		}
	}
}
