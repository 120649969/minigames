class GameBullet extends eui.Component{

	public hit_rect:eui.Component
	public is_valid:boolean = true
	public speed_x:number
	public speed_y:number

	public constructor() {
		super()
		this.skinName = "BulletSkin"
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
	}

	public ReSet():void
	{
		this.is_valid = true
		this.visible = true
	}

	public Update():void
	{
		this.x += this.speed_x
		this.y += this.speed_y
		let global_rect_right_down = this.hit_rect.localToGlobal(this.hit_rect.width, this.hit_rect.height)
		if(global_rect_right_down.y <= -100){
			this.is_valid = false
			this.visible = false
			return
		}
		if(global_rect_right_down.x < 0 || global_rect_right_down.x >= GameController.instance.GetMainScenePanel().width + this.width)
		{
			this.is_valid = false
			this.visible = false
			return
		}
		if(this.CheckHit()){
			this.is_valid = false
			this.visible = false
			return
		}
	}

	public CheckHit():boolean
	{
		let global_rect_left_top = this.hit_rect.localToGlobal(0, 0)
		let global_rect_right_down = this.hit_rect.localToGlobal(this.hit_rect.width, this.hit_rect.height)

		let game_logic_component = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
		let all_point_lines = game_logic_component.all_point_lines
		for(let point_line of all_point_lines)
		{
			let all_lines = point_line.all_lines
			let top_line = all_lines[0]
			let buttom_line = point_line.GetButtomValidGameLine()

			if(top_line && buttom_line && top_line.is_valid && buttom_line.is_valid)
			{
				let top_line_global_left_top = top_line.hit_rect.localToGlobal(0, 0)
				let top_line_global_right_down = top_line.hit_rect.localToGlobal(top_line.hit_rect.width, top_line.hit_rect.height)
				let buttom_line_global_left_top = buttom_line.hit_rect.localToGlobal(0, 0)
				let buttom_line_global_right_down = buttom_line.hit_rect.localToGlobal(buttom_line.hit_rect.width, buttom_line.hit_rect.height)

				if(global_rect_left_top.y > buttom_line_global_right_down.y){ //在下方
					return
				}
				if(global_rect_right_down.y < top_line_global_left_top.y){ //在上方
					continue
				}

				for(let line of all_lines)
				{
					for(let box of line.all_boxs)
					{
						if(box.is_valid)
						{
							if(box.getBounds().intersects(this.getTransformedBounds(box, null))){
								box.OnHitBullet()
								GameController.instance.GetMainScenePanel().GetGameLogicComponent().PlayHitAnimation(this)
								return true
							}
						}
					}
				}
			}
		}
		return false
	}
}