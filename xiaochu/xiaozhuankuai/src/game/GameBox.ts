class GameBox extends eui.Component{

	public position:number = -1
	private imgBox:eui.Image

	public constructor(type:GAME_BOX_LINE_TYPE) {
		super()
		this.skinName = "GameBoxSkin"
		if(type == GAME_BOX_LINE_TYPE.NORMAL){
			this.imgBox.source = "normal_png"
		} else{
			this.imgBox.source = "hard_png"
		}
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
	}
}