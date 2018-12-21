class GameBox extends eui.Component{

	public hit_rect:eui.Rect
	public label_max:eui.BitmapLabel
	public label_cur:eui.BitmapLabel
	public label_center_max:eui.BitmapLabel

	public img_deng:eui.Image
	public img_normal:eui.Image
	public img_broken:eui.Image

	public max_life:number
	public cur_life:number
	public is_valid:boolean = true

	public is_double:boolean = false
	public constructor() {
		super()
		this.skinName = "BoxSkin"
		this.ReSet()
	}

	public ReSet():void
	{
		this.img_broken.visible = false
		this.img_normal.visible = true
		this.max_life = Math.ceil(Math.random() * 20)
		this.cur_life = 0
		this.label_max.text = this.max_life.toString()
		this.label_cur.text = this.cur_life.toString()
		
		this.label_center_max.text = this.max_life.toString()

		this.label_cur.visible = false
		this.label_max.visible = false
		this.label_center_max.visible = true
		
		if(Math.random() < 0.3){
			this.img_deng.visible = true
			this.is_double = true
		}else{
			this.img_deng.visible = false
		}
	}

	public OnHitBullet():void
	{
		if(!this.is_valid){
			return
		}
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().AddScore(1)
		this.label_cur.visible = true
		this.label_max.visible = true
		this.label_center_max.visible = false
		this.cur_life += 1
		this.label_cur.text = this.cur_life.toString()
		this.img_broken.visible = true
		
		this.is_valid = this.cur_life != this.max_life
		if(!this.is_valid){
			this.visible = false
			if(this.is_double){
				GameController.instance.GetMainScenePanel().GetGameLogicComponent().AddScore(this.max_life)
				GameController.instance.GetMainScenePanel().GetGameLogicComponent().PlayFlyStarAnimation(this)
				GameController.instance.GetMainScenePanel().ShowBrokenScore(this.max_life)
			}
			GameController.instance.GetMainScenePanel().GetGameLogicComponent().PlayBrokenAnimation(this)
			SoundManager.getInstance().playSound("broken_mp3")
		}
	}

}