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
		for(let type of this.gameCirlce.shapeTyps)
		{
			if(type != ShapeTypes.TYPE_NONE && gameCircle.shapeTyps.indexOf(type) >= 0)
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
	{
		return this.gameCirlce.shapeTyps.indexOf(shapeType) >= 0
	}

	public RemoveColor(color):void
	{
		this.gameCirlce.RemoveColor(color)
	}
}