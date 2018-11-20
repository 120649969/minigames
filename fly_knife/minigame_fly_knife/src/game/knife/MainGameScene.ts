class MainGameScene extends eui.Component{

	private m_touch_layer:eui.Group
	private m_this_knife_object:KnifeObject
	private m_container_layer:eui.Group
	private m_ball:eui.Image

	public constructor() {
		super()
		this.skinName = "MainSceneSkin"
	}


	protected createChildren(): void {
		super.createChildren();
	}

	public StartGame():void
	{
		this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)

		this.m_touch_layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
	}


	private _onEnterFrame(event:egret.Event):void
	{

	}

	private _onTouchBegin(event:egret.TouchEvent):void
	{
		if(this.m_this_knife_object){
			if(this.m_this_knife_object.is_moving){
				return
			}
			if(this.m_this_knife_object.is_end){
				return
			}
			this.m_this_knife_object.StartTouchMove()
		}
	}

	public GenerateNextKnife():void
	{
		this.m_this_knife_object = new KnifeObject()
		this.m_container_layer.addChild(this.m_this_knife_object)
		this.m_this_knife_object.StartBirthMove()
	}

	public NextRound():void
	{
		
	}

	private _playBallEnterAnimation(callback:Function):void
	{
		this.m_ball.scaleX = this.m_ball.scaleY = 0
		egret.Tween.get(this.m_ball).to({scaleX : 1.2, scaleY : 1.2}, 0.25 * 1000).call(function(){
			if(callback){
				callback()
			}
		})
	}
}