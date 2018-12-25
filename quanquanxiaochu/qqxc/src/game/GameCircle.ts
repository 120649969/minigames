class GameCircle extends eui.Component{

	public circleShapes:Array<eui.Image> = []
	public shapeTyps:Array<ShapeTypes> = []

	public isInStartPosition:boolean = true
	public hit_rect:eui.Rect

	public init_x:number
	public init_y:number
	public is_moving:boolean

	public constructor() {
		super()
		this.skinName = "GameCircleSkin"
		for(let index = 0; index < GameConst.CIRCLE_COUNT; index++)
		{
			this.circleShapes.push(this['circle_' + (index + 1)])
		}
		this.ClearAll()
	}

	public ClearAll():void
	{
		this.shapeTyps = []
		for(let index = 0; index < GameConst.CIRCLE_COUNT; index++)
		{
			this.shapeTyps.push(ShapeTypes.TYPE_NONE)
			this.circleShapes[index].visible = false
		}
	}

	private _get_valid_circle_count():number
	{
		let circle_rate_array = [0, 0.4, 0.5, 0.1]
		let circle_count_array = [0, 1, 2, 3]
		let random_rate = Math.random()
		let cur_rate = 0
		for(let index = 0; index < circle_rate_array.length; index++)
		{
			let rate = circle_rate_array[index]
			cur_rate += rate
			if(random_rate < cur_rate){
				return circle_count_array[index]
			}
		}
		return circle_count_array[1]
	}

	private _get_circle_shape_types(valid_count:number):Array<ShapeTypes>
	{
		let ret = []
		let indexes = []
		for(let index = 0; index < GameConst.CIRCLE_COUNT; index++)
		{
			indexes.push(index)
			ret.push(ShapeTypes.TYPE_NONE)
		}

		for(let index = 0; index < valid_count; index++)
		{
			let next_index_in_index = Math.floor(Math.random() * indexes.length)
			let next_index = indexes[next_index_in_index]
			indexes.splice(next_index_in_index, 1)
			ret[next_index] = Math.ceil(Math.random() * ShapeTypes.TYPE_MAX)
		}

		return ret
	}

	public Show(x, y):void
	{
		let valid_count = this._get_valid_circle_count()
		
		this.shapeTyps = this._get_circle_shape_types(valid_count)
		for(let index = 0; index < GameConst.CIRCLE_COUNT; index++)
		{
			let shape_type = this.shapeTyps[index]
			if(shape_type == ShapeTypes.TYPE_NONE){
				this.circleShapes[index].visible = false
			}else{
				this.circleShapes[index].visible = true
				this.circleShapes[index].source = (shape_type + "_" + (index + 1)) + "_png"
			}
		}
		this.init_x = x
		this.init_y = y

		this.isInStartPosition = true
		this.touchEnabled = true
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
		this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this)
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchCancel, this)
	}

	private onTouchBegin():void
	{
		if(this.is_moving){
			return
		}
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().StartDragGameCircle(this)
	}

	private onTouchEnd():void
	{
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().StopDragGameCircle(this)
	}

	private onTouchMove(event:egret.TouchEvent):void
	{
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().UpdateDragGameCircle(this, event.stageX, event.stageY)
	}

	private onTouchCancel(event:egret.TouchEvent):void
	{
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().currentDragGameCircle = null
		this.MoveBack()
	}

	public MoveBack():void
	{
		this.is_moving = true
		let __this = this
		egret.Tween.get(this).to({x:this.init_x, y:this.init_y}, 0.1 * 1000).call(function(){
			__this.is_moving = false
		})
	}

	public UpdateTouchPosition(x, y):void
	{
		this.x = x - this.width / 2
		this.y = y - this.height / 2
	}

	public AddGameCircle(gameCirlce:GameCircle):void
	{
		for(let index = 0; index < gameCirlce.shapeTyps.length; index++)
		{
			let shapeType = gameCirlce.shapeTyps[index]
			if(shapeType != ShapeTypes.TYPE_NONE){
				this.shapeTyps[index] = shapeType
				this.circleShapes[index].visible = true
				this.circleShapes[index].source = (shapeType + "_" + (index + 1)) + "_png"
				// this.circleShapes[index].source = "circle_" + shapeType + "_png"
			}
		}
	}

	public RemoveColor(color):void
	{
		for(let index = this.shapeTyps.length - 1; index >= 0; index--)
		{
			let shape = this.circleShapes[index]
			let shapeType = this.shapeTyps[index]
			if(shapeType == color){
				this.shapeTyps[index] = ShapeTypes.TYPE_NONE
				shape.visible = false
			}
		}
	}
}