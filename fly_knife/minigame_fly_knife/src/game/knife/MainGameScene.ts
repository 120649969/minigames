class MainGameScene extends eui.Component{

	private m_touch_layer:eui.Group
	private m_knife_object:KnifeObject
	private m_container_layer:eui.Group
	public m_plate_container:eui.Group
	private m_example_knife:eui.Image
	public m_plate_image:eui.Image
	public m_plate_object:PlateObject

	public constructor() {
		super()
		this.skinName = "MainSceneSkin"
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	private _onAddToStage(event:egret.Event):void
	{
		this.StartGame()
	}

	protected createChildren(): void {
		super.createChildren();
	}

	public StartGame():void
	{
		this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)

		this.m_plate_object = new PlateObject(this)
		this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)

		this.validateNow()
		this.m_plate_object.EnterNextBigRound()
		this.NextRound()
	}


	private _onEnterFrame(event:egret.Event):void
	{
		if(this.m_knife_object){
			this.m_knife_object.Update()
		}

		this.m_plate_object.Update()
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

	public NextRound():void
	{
		this.m_plate_object.EnterNextRound()
		this.GenerateNextKnife()
	}
}