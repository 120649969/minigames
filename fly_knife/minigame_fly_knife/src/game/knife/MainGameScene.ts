class MainGameScene extends eui.Component{

	private m_touch_layer:eui.Group
	private m_knife_object:KnifeObject
	private m_container_layer:eui.Group
	public m_plate_container:eui.Group
	private m_example_knife:eui.Image
	public m_plate_image:eui.Image
	public m_plate_object:PlateObject
	private labelResult:eui.Label
	private btn_test:eui.Button

	private _all_knife_imgs:Array<eui.Image> = []
	private fly_up:egret.tween.TweenGroup

	public constructor() {
		super()
		this.skinName = "MainSceneSkin"
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
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
			// let wait = __this.m_plate_object.CalculateNextEmptyPlace()
			// console.log("###等待时间#####", wait)
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

	public NextBigRound():void
	{
		this.labelResult.visible = false
		let new_configs = {}

		let sub_configs = []
		let new_config = {}
		new_config['direction'] = 1
		new_config['rotate_speed'] = 6
		new_config['duration'] = 10000
		sub_configs.push(new_config)


		new_configs['sub_configs'] = sub_configs
		new_configs['count'] = 3 + Math.ceil(Math.random() * 4)

		this.m_plate_object.EnterNextBigRound(new_configs)
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

	public ShowResult(isWin:boolean):void
	{
		if(isWin){
			this.labelResult.text = "恭喜您 闯关成功"
		} else {
			this.labelResult.text = "恭喜您 闯关失败"
		}
		this.labelResult.visible = true
		this.fly_up.play(1)
		this.fly_up.removeEventListener('complete', this._onPlayFlyUpCompelete, this);
		this.fly_up.addEventListener('complete', this._onPlayFlyUpCompelete, this);
	}

	private _onPlayFlyUpCompelete():void
	{
		this.NextBigRound()
	}
}