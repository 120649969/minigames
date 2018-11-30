
class BaseGameObject extends eui.Component{
	public degree_on_plate:number = 0

	public constructor() {
		super()
	}
}

class PropObject extends BaseGameObject{

	public behit_rect:eui.Rect
	public type:number
	private img:eui.Image

	private _prop_armature:dragonBones.EgretArmatureDisplay
	public constructor() {
		super()
		this.skinName = "PropSkin"
	}

	protected createChildren(): void {
		super.createChildren()

		let armatureDisplay = KnifeUtils.createDragonBones("prop_ske_json", "prop_tex_json", "prop_tex_png", "prop_armature")
		this.addChild(armatureDisplay)
		armatureDisplay.x = this.width / 2
		armatureDisplay.y = this.height / 2
		armatureDisplay.visible = false
		this._prop_armature = armatureDisplay

		let __this = this
		armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			__this.visible = false
		}, this)

		armatureDisplay.rotation = 180
	}

	public PlayBrokenAnimation():void
	{
		this.img.visible = false
		this._prop_armature.visible = true
		this._prop_armature.animation.play("prop_animation", 1)
	}
}