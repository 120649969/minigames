class ScoreFireEffectDisplayObject extends egret.DisplayObjectContainer{

	private _bitmap:egret.Bitmap

	private _origin_scale:number = 0.8
	private _target_scale:number = 0

	public is_yellow:boolean = true
	private _container:egret.DisplayObjectContainer
	private _scoreFireEffect:ScoreFireEffect
	public constructor(container, effect) {
		super()
		this._container = container
		this._scoreFireEffect = effect
		this.visible = false
	}

	public Init():void
	{
		if(this.is_yellow){
			let new_bitmap = new egret.Bitmap()
			new_bitmap.texture = RES.getRes("qiu12_png")
			new_bitmap.anchorOffsetX = new_bitmap.width / 2
			new_bitmap.anchorOffsetY = new_bitmap.height / 2
			this._bitmap = new_bitmap
			this.addChild(new_bitmap)
		} else {
			let new_bitmap = new egret.Bitmap()
			new_bitmap.texture = RES.getRes("qiu13_png")
			new_bitmap.anchorOffsetX = new_bitmap.width / 2
			new_bitmap.anchorOffsetY = new_bitmap.height / 2
			this._bitmap = new_bitmap
			this.addChild(new_bitmap)
		}
	}

	public ReCreate():void
	{
		
		this._bitmap.scaleX = this._bitmap.scaleY = this._origin_scale
		this._bitmap.visible = true
		this._bitmap.x = this._bitmap.y = 0

		this.visible = true
		this.PayAnimation()
	}

	public PayAnimation():void
	{
		if(this.is_yellow){
			this._bitmap.alpha = 0.8
			this._bitmap.scaleX = this._bitmap.scaleY = 0.4
			this._bitmap.x = this._container.width / 2 + Math.random() * 20 * BasketUtils.GetRandomPositive()
			this._bitmap.y = this._container.height - 10
			let random_target_x = this._container.width / 2 - 10 + Math.random() * BasketUtils.GetRandomPositive() * 10
			let random_target_y = this._container.width * 1 / 4 + Math.random() * BasketUtils.GetRandomPositive() * 10
			let __this = this
			egret.Tween.get(this._bitmap).to({x:random_target_x, y:random_target_y, alpha:0.1, scaleX:0, scaleY:0}, 2 * 1000).call(function(){
				__this._scoreFireEffect.OnDestoryEffectItem(__this)
			}.bind(this))
		} else {
			this._bitmap.alpha = 0.4
			this._bitmap.scaleX = this._bitmap.scaleY = 0.7
			this._bitmap.x = this._container.width / 2 + Math.random() * 25 * BasketUtils.GetRandomPositive()
			this._bitmap.y = this._container.height - 15
			let random_target_x = this._container.width / 2 - 20 + Math.random() * BasketUtils.GetRandomPositive() * 10
			let random_target_y = 0 + Math.random() * BasketUtils.GetRandomPositive() * 10
			let __this = this
			egret.Tween.get(this._bitmap).to({x:random_target_x, y:random_target_y, alpha:0.1, scaleX:0, scaleY:0}, 2 * 1000).call(function(){
				__this._scoreFireEffect.OnDestoryEffectItem(__this)
			}.bind(this))
		}
	}

	public Update():boolean
	{
		return false
	}
}

class ScoreFireEffect extends BaseEffect{
	private _playerBall:PlayerBall
	private _cacheFires:Array<ScoreFireEffectDisplayObject> = []
	private _usingFires:Array<ScoreFireEffectDisplayObject> = []
	private _last_point:egret.Point = new egret.Point()
	private _container:egret.DisplayObjectContainer;

	private _hasInit:boolean = false
	public constructor(playerBall:PlayerBall) {
		super(playerBall)
		this._playerBall = playerBall
	}

	public SetContainer(container:egret.DisplayObjectContainer):void
	{
		this._container = container
		this._createFires()
	}

	private _createFires():void
	{
		for(let index = 0; index < 150; index ++)
		{
			let new_fire = new ScoreFireEffectDisplayObject(this._container, this)
			new_fire.is_yellow = index % 2 == 0
			new_fire.Init()
			this.addChild(new_fire)
			this._cacheFires.push(new_fire)
		}
		this._container.addChild(this)
		this._container.setChildIndex(this, 1)
	}

	public FirstGenerate():void
	{
		if(this._hasInit){
			return
		}
		this._hasInit = true
		for(let index = 0; index < 80; index ++)
		{
			this._showNextItem()
		}
	}

	public OnDestoryEffectItem(item):void
	{
		let index = this._usingFires.indexOf(item)
		if(index < 0){
			return
		}
		this._usingFires.splice(index, 1)
		this._cacheFires.push(item)
	}

	public Update(need_create:boolean):void
	{
		this._showNextItem()
	}

	private _showNextItem():void
	{
		if(this._cacheFires.length < 0){
			return
		}
		let new_fire = this._cacheFires.shift()
		this._usingFires.push(new_fire)
		new_fire.ReCreate()
		this.setChildIndex(new_fire, 1)
	}
}