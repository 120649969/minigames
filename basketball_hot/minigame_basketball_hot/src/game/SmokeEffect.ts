class SmokeDisplayObject extends egret.DisplayObjectContainer{

	private _bitmap:egret.Bitmap;
	public constructor() {
		super()
		let new_bitmap = new egret.Bitmap()
		new_bitmap.texture = RES.getRes("qiu1_png")
		new_bitmap.anchorOffsetX = new_bitmap.width / 2
		new_bitmap.anchorOffsetY = new_bitmap.height / 2
		this.addChild(new_bitmap)

		this._bitmap = new_bitmap

		this.visible = false
	}

	public ReCreate():void
	{
		this._bitmap.alpha = Math.random() * 0.1 + 0.3
		this._bitmap.scaleX = this._bitmap.scaleY = 0.9 * 1.2
		this.visible = true
	}

	public Update():boolean
	{
		this._bitmap.alpha -= 0.006
		this._bitmap.scaleX -= 0.008
		this._bitmap.scaleX = Math.max(this._bitmap.scaleX, 0.8)
		this._bitmap.scaleY = this._bitmap.scaleX
		if(this._bitmap.alpha <= 0)
		{
			this.visible = false;
			return false
		}
		return true
	}

}

class SmokeEffect extends BaseEffect{

	private _playerBall:PlayerBall
	private _cacheSmokes:Array<SmokeDisplayObject> = []
	private _usingSmokes:Array<SmokeDisplayObject> = []
	private _last_point:egret.Point = new egret.Point()
	
	public constructor(playerBall:PlayerBall) {
		super(playerBall)
		this._playerBall = playerBall
		this._createSmokes()
	}

	private _has_create_after_images:boolean = false
	private _createSmokes():void
	{
		for(let index = 0; index < 50; index ++)
		{
			let new_smoke = new SmokeDisplayObject()
			this.addChild(new_smoke)
			this._cacheSmokes.push(new_smoke)
		}
		this._playerBall.m_basket_ball.parent.addChild(this)
		this._playerBall.m_basket_ball.parent.setChildIndex(this, 1)
	}

	public Update(need_create:boolean):void
	{
		for(let index = this._usingSmokes.length - 1; index >= 0; index --)
		{
			let smokeDisplayObject = this._usingSmokes[index]
			if(!smokeDisplayObject.Update())
			{
				this._usingSmokes.splice(index, 1)
				this._cacheSmokes.push(smokeDisplayObject)
			}
		}

		if(!need_create)
		{
			return
		}

		if(this._cacheSmokes.length <= 0)
		{
			return
		}

		let distance = Math.sqrt(Math.pow(this._playerBall.m_basket_ball.x - this._last_point.x, 2) + Math.pow(this._playerBall.m_basket_ball.y - this._last_point.y, 2));
		let compare_distance = (this._playerBall.m_basket_ball.height * 0.2)
		if(distance > compare_distance)
		{
			let new_smoke = this._cacheSmokes.shift()
			new_smoke.ReCreate()
			let move_x = 0
			let move_y = 0
			new_smoke.x = this._playerBall.m_basket_ball.x + move_x + this._playerBall.m_basket_ball.width / 2
			new_smoke.y = this._playerBall.m_basket_ball.y + move_y + this._playerBall.m_basket_ball.height / 2
			this._usingSmokes.push(new_smoke)
			this._last_point.x = this._playerBall.m_basket_ball.x
			this._last_point.y = this._playerBall.m_basket_ball.y
		}
	}
}