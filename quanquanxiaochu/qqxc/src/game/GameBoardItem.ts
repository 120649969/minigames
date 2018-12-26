class GameBoardItem extends eui.Component{

	public gameCirlce:GameCircle
	public hit_rect:eui.Rect

	public constructor() {
		super()
		this.skinName = "BoardItemSkin"
		this.gameCirlce.ClearAll()
	}

	public ReSet():void
	{
		this.gameCirlce.ClearAll()
	}

	public CanPutInCircle(gameCircle:GameCircle):boolean
	{
		for(let index = 0; index < GameConst.CIRCLE_COUNT; index++)
		{
			let type1 = this.gameCirlce.shapeTyps[index]
			let type2 = gameCircle.shapeTyps[index]
			if(type1 != ShapeTypes.TYPE_NONE && type2 != ShapeTypes.TYPE_NONE)
			{
				return false
			}
		}
		return true
	}
	
	public PutInCircle(gameCircle:GameCircle):void
	{
		this.gameCirlce.AddGameCircle(gameCircle)
		gameCircle.parent.removeChild(gameCircle)
	}
	
	public CheckHitMoveCircle(gameCircle:GameCircle):boolean
	{
		return this.hit_rect.getBounds().intersects(gameCircle.hit_rect.getTransformedBounds(this.hit_rect))
	}

	public IsContain(shapeType:ShapeTypes):boolean
	{7
		return this.gameCirlce.shapeTyps.indexOf(shapeType) >= 0
	}

	public RemoveColor(color):number
	{
		return this.gameCirlce.RemoveColor(color)
	}
}