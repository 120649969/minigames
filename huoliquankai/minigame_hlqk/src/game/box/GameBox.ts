class GameBox extends eui.Component{

	public label_max:eui.BitmapLabel
	public label_cur:eui.BitmapLabel

	public img_normal:eui.Image
	public img_broken:eui.Image

	public max_life:number
	public constructor() {
		super()
		this.skinName = "BoxSkin"
	}

	public ReSet():void
	{
		this.img_broken.visible = false
		this.img_normal.visible = true
	}

}