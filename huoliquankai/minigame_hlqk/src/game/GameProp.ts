class GameProp extends eui.Component{

	public img_prop:eui.Image
	public propType:GamePropType
	public constructor() {
		super()
		this.skinName = "PropSkin"
		if(Math.random() < 0.5){
			this.propType = GamePropType.SPEED
			this.img_prop.source = "jiasu_png"
		}else{
			this.propType = GamePropType.SAN
			this.img_prop.source = "san_png"
		}
	}

	public Remove():void
	{
		this.parent.removeChild(this)
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().currentPropObject = null
	}

	public Update():void
	{
		let global_point = this.localToGlobal(0, 0)
		if(global_point.y >= GameController.instance.GetMainScenePanel().height){
			this.Remove()
			return
		}
	}
}