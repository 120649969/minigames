
class BaseGameObject extends eui.Component{
	public degree_on_plate:number = 0

	public constructor() {
		super()
	}
}

class PropObject extends BaseGameObject{

	public behit_rect:eui.Rect
	public type:number
	
	public constructor() {
		super()
		this.skinName = "PropSkin"
	}
}