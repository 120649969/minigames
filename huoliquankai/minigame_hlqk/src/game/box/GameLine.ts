
class BaseGameBoxLine extends eui.Component{
	public all_boxs:Array<GameBox> = []
	public line_index = 0
	public hit_rect:eui.Rect

	public point_line:GamePoint
	public is_valid:boolean

	
	public constructor() {
		super()
	}

	public init():void
	{
		for(let index = 0; index < this.getBoxCount(); index++)
		{
			this.all_boxs.push(this['box_' + (index + 1)])
		}
	}

	public getBoxCount():number
	{
		return 0
	}

}

class GameBox3Line extends BaseGameBoxLine{
	
	public constructor() {
		super()
		this.skinName = "BoxLine3Skin"
		this.init()
	}

	public getBoxCount():number
	{
		return GameConst.Three_Count
	}
}

class GameBox4Line extends BaseGameBoxLine{
	
	public constructor() {
		super()
		this.skinName = "BoxLine4Skin"
		this.init()
	}

	public getBoxCount():number
	{
		return GameConst.Four_Count
	}
}