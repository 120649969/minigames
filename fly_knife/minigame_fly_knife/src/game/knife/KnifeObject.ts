class KnifeObject extends egret.DisplayObjectContainer{

	public is_moving:boolean = false
	public is_end:boolean = false

	public constructor() {
		super()

		let new_bitmap = new egret.Bitmap()
		new_bitmap.texture = RES.getRes("nife_png")
		new_bitmap.anchorOffsetX = new_bitmap.width / 2
		new_bitmap.anchorOffsetY = new_bitmap.height / 2

		this.addChild(new_bitmap)

		this.is_moving = false
		this.is_end = false
	}

	public StartTouchMove():void
	{
		this.is_moving = true
	}

	public StartBirthMove():void
	{

	}
}