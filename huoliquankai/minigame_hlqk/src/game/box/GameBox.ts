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

	//0-10：0.2
	//10-20：0.4
	//20-30：0.3
	//30-50: 0.1

	private _get_score():number
	{
		let random_value = Math.random()

		let cur_rate = 0
		let random_index = 0
		for(let index = 0; index < GameConst.Box_Score_Rates.length; index++)
		{
			cur_rate += GameConst.Box_Score_Rates[index]
			if(random_value <= cur_rate){
				random_index = index
				break
			}
		}
		let start_value = GameConst.Box_Scores[random_index - 1]
		let end_value = GameConst.Box_Scores[random_index]
		
		return start_value + Math.floor((end_value - start_value) * Math.random())
	}

	public ReSet():void
	{
		this.img_broken.visible = false
		this.img_normal.visible = true
		this.max_life = this._get_score()
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