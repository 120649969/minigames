//火球特效
class FireEffectDisplayObject extends egret.DisplayObjectContainer{

	private _yellowBitmap:egret.Bitmap
	private _orangeBitmap:egret.Bitmap
	private _blackBitmap:egret.Bitmap

	private origin_scale:number = 1
	private target_scale:number = 1.2

	private _in_yellow_orange_step:boolean = false
	private _in_orange_black_step:boolean = false
	private _in_black_step:boolean = false

	private _step_id:number = 0

	public is_wait_black:boolean = false
	public constructor() {
		super()

		let new_bitmap = new egret.Bitmap()

		
		new_bitmap.texture = RES.getRes("qiu13_png")
		new_bitmap.anchorOffsetX = new_bitmap.width / 2
		new_bitmap.anchorOffsetY = new_bitmap.height / 2
		this._orangeBitmap = new_bitmap
		new_bitmap.visible = false

		new_bitmap = new egret.Bitmap()
		new_bitmap.texture = RES.getRes("qiu12_png")
		new_bitmap.anchorOffsetX = new_bitmap.width / 2
		new_bitmap.anchorOffsetY = new_bitmap.height / 2
		this._yellowBitmap = new_bitmap
		new_bitmap.visible = false

		new_bitmap = new egret.Bitmap()
		new_bitmap.texture = RES.getRes("qiu1_png")
		new_bitmap.anchorOffsetX = new_bitmap.width / 2
		new_bitmap.anchorOffsetY = new_bitmap.height / 2
		this._blackBitmap = new_bitmap
		new_bitmap.visible = false
	}

	public GetYellow():egret.Bitmap
	{
		return this._yellowBitmap
	}

	public GetOrange():egret.Bitmap
	{
		return this._orangeBitmap
	}


	public GetBlack():egret.Bitmap
	{
		return this._blackBitmap
	}

	public SetXY(x, y):void
	{
		this._blackBitmap.x = this._orangeBitmap.x = this._yellowBitmap.x = x
		this._blackBitmap.y = this._orangeBitmap.y = this._yellowBitmap.y = y
	}

	public ReCreate():void
	{
		this._yellowBitmap.alpha = 1
		this._yellowBitmap.scaleX = this._yellowBitmap.scaleY = this.origin_scale
		this._yellowBitmap.visible = true

		this._orangeBitmap.alpha = Math.random() * 0.7 + 0.3
		this._orangeBitmap.scaleX = this._orangeBitmap.scaleY = this.origin_scale
		this._orangeBitmap.visible = true

		this._blackBitmap.alpha = 0.8
		this._blackBitmap.scaleX = this._blackBitmap.scaleY =this.origin_scale
		this._blackBitmap.visible = false

		this.visible = true

		this._in_yellow_orange_step = true
		this._in_orange_black_step = false
		this._in_black_step = false
	}

	
	public SetFireStep(step_id:number):void
	{
		this._step_id = step_id
		if(this._step_id == FireStep.Step_1){
			this.origin_scale = 0.7
			this.target_scale = 0.9
		} else if(this._step_id == FireStep.Step_2){
			this.origin_scale = 0.8
			this.target_scale = 1
		}
	}

	private _getYellowDeltaAlphaInYellowOrangeStep():number
	{
		if(this._step_id == FireStep.Step_1){
			return 0.1
		} else if(this._step_id == FireStep.Step_2){
			return 0.1
		}
		return 0.1
	}

	private _getRate():number
	{
		if(this._step_id == FireStep.Step_1){
			return 1.3
		} else if(this._step_id == FireStep.Step_2){
			return 1
		}
		return 1
	}

	private _random_orange_reduce_num:number = 0
	private _random_yellow_reduce_num:number = 0
	private _random_black_reduce_num:number = 0

	public Update():boolean
	{
		this._yellowBitmap.scaleX += 0.04
		this._yellowBitmap.scaleY = this._yellowBitmap.scaleX = Math.min(this._yellowBitmap.scaleX, this.target_scale) 
		this._blackBitmap.scaleX = this._blackBitmap.scaleY = this._yellowBitmap.scaleX
		this._orangeBitmap.scaleX = this._orangeBitmap.scaleY = this._yellowBitmap.scaleX

		if(this._in_yellow_orange_step)
		{
			this._yellowBitmap.alpha -= this._getYellowDeltaAlphaInYellowOrangeStep()
			if(this._yellowBitmap.alpha <= 0.7)
			{
				this._in_yellow_orange_step = false
				this._in_orange_black_step = true	
				this._random_orange_reduce_num = Math.max(Math.random() * 0.08, 0.03) * this._getRate()
				this._random_yellow_reduce_num = 0.08 * this._getRate()
			}
		}

		if(this._in_orange_black_step)
		{
			this._yellowBitmap.alpha -= this._random_yellow_reduce_num
			this._orangeBitmap.alpha -= this._random_orange_reduce_num
			if(this.is_wait_black){
				if(this._orangeBitmap.alpha <= 0.3){
					this._yellowBitmap.visible = false
					this._orangeBitmap.visible = false
					this._blackBitmap.visible = true
					this._in_black_step = true
					this._in_orange_black_step = false
					this._random_black_reduce_num = Math.max(0.02, Math.random() * 0.1) * this._getRate()
					return true
				}
			} else {
				if(this._orangeBitmap.alpha <= 0){
					return false
				}
			}
		}

		if(this._in_black_step)
		{
			this._blackBitmap.alpha -= this._random_black_reduce_num
			if(this._blackBitmap.alpha <= 0){
				return false
			}
		}

		return true
	}

	public Remove():void
	{
		this._yellowBitmap.visible = false
		this._orangeBitmap.visible = false

		this.is_wait_black = false
	}
}

class FireEffect extends BaseEffect{
	private _playerBall:PlayerBall
	private _cacheFires:Array<FireEffectDisplayObject> = []
	private _usingFires:Array<FireEffectDisplayObject> = []
	private _last_point:egret.Point = new egret.Point()

	private _yellowContainer:egret.DisplayObjectContainer
	private _orangeContainer:egret.DisplayObjectContainer
	private _blackContainer:egret.DisplayObjectContainer

	public constructor(playerBall:PlayerBall) {
		super(playerBall)
		this._playerBall = playerBall
		this._createFires()
	}

	private _createFires():void
	{
		this._yellowContainer = new egret.DisplayObjectContainer()
		this._orangeContainer = new egret.DisplayObjectContainer()
		this._blackContainer = new egret.DisplayObjectContainer()
		
		this.addChild(this._blackContainer)
		this.addChild(this._orangeContainer)
		this.addChild(this._yellowContainer)

		for(let index = 0; index < 150; index ++)
		{
			let new_fire = new FireEffectDisplayObject()
			this._yellowContainer.addChild(new_fire.GetYellow())
			this._orangeContainer.addChild(new_fire.GetOrange())
			this._blackContainer.addChild(new_fire.GetBlack())
			// this.addChild(new_fire)
			this._cacheFires.push(new_fire)
		}
		this._playerBall.m_basket_ball.parent.addChild(this)
		this._playerBall.m_basket_ball.parent.setChildIndex(this, 1)
	}

	private _step_id:number = 0
	public SetFireStep(step_id:number):void
	{
		this._step_id = step_id
	}

	public Update(need_create:boolean):void
	{
		for(let index = this._usingFires.length - 1; index >= 0; index --)
		{
			let fireDisplayObject = this._usingFires[index]
			if(!fireDisplayObject.Update())
			{
				fireDisplayObject.Remove()
				this._usingFires.splice(index, 1)
				this._cacheFires.push(fireDisplayObject)
			}
		}

		if(!need_create)
		{
			return
		}

		if(this._cacheFires.length <= 0)
		{
			return
		}

		let distance = Math.sqrt(Math.pow(this._playerBall.m_basket_ball.x - this._last_point.x, 2) + Math.pow(this._playerBall.m_basket_ball.y - this._last_point.y, 2));
		let compare_distance = (this._playerBall.m_basket_ball.height * 0.2)
		if(distance > compare_distance)
		{
			let speed_vertical_vec = new egret.Point(this._playerBall.basketball_speed_y * -1, this._playerBall.basketball_speed_x)
			speed_vertical_vec.normalize(1)
			let speed_vec = new egret.Point(this._playerBall.basketball_speed_x, this._playerBall.basketball_speed_y)
			speed_vec.normalize(1)
			let random_count = this._getRandomFireCount()
			for(let index = 0; index < random_count; index ++)
			{
				let new_fire = this._cacheFires.shift()
				new_fire.SetFireStep(this._step_id)
				new_fire.ReCreate()
				new_fire.is_wait_black = Math.floor(Math.random() * 10) <= 2
				let range = this._playerBall.m_basket_ball.width / 10
				range = 15
				let vectical_random_range = BasketUtils.GetRandomScope(-range, range)
				let vectical_move_x = vectical_random_range * speed_vertical_vec.x
				let vectical_move_y = vectical_random_range * speed_vertical_vec.y

				let speed_random_range = BasketUtils.GetRandomScope(-this._playerBall.m_basket_ball.width, 0)
				speed_random_range = BasketUtils.GetRandomScope(-10, 0)
				let speed_move_back_x = speed_random_range * speed_vec.x
				let speed_move_back_y = speed_random_range * speed_vec.y
				let x = this._playerBall.m_basket_ball.x + vectical_move_x + this._playerBall.m_basket_ball.width / 2 + speed_move_back_x
				let y = this._playerBall.m_basket_ball.y + vectical_move_y + this._playerBall.m_basket_ball.height / 2 + speed_move_back_y
				new_fire.SetXY(x, y)
				this._usingFires.push(new_fire)
				
				if(this._cacheFires.length <= 0)
				{
					break
				}
			}
			this._last_point.x = this._playerBall.m_basket_ball.x
			this._last_point.y = this._playerBall.m_basket_ball.y
		}
	}

	public SetGoal(score:number):void
	{
		this._playerBall.GetMainScenePanel().PlayBlackNetAnimation()
	}

	private _getRandomFireCount():number
	{
		let random_count = 0
		if(this._step_id == FireStep.Step_1){
			random_count = Math.ceil(Math.random() * 2) + 2
		} else if(this._step_id == FireStep.Step_2){
			random_count = Math.ceil(Math.random() * 2) + 2
		}
		return random_count
	}
}