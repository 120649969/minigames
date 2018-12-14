class MyMoveObject extends eui.Component{

	public _target_box_line:GameBoxLine
	public _allBoxLine:Array<GameBoxLine>
	public _maxClearLineCount:number
	private mainScenePanel:ui.MainScenePanel
	public is_ending:boolean = true
	public position:number
	private _allBox:Array<eui.Image> = []

	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.skinName = "MyMoveObjectSkin"
		this.mainScenePanel = mainPanel
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = 0
		this.mainScenePanel.box_line_container.addChild(this)
		this.visible = false

		let armatureDisplay = CommonUtils.createDragonBones("move_ske_json", "move_tex_json", "move_tex_png", "move_armature")
		this.addChild(armatureDisplay)
		armatureDisplay.y = this.height / 2
		armatureDisplay.x = this.width / 2
		armatureDisplay.animation.play("move_animation")
	}

	public Restart(init_x:number, init_y:number, position:number):void
	{
		this.position = position
		let max_count = GameBoxLineManager.instance.GetMaxIdleLine(position)
		if(max_count == 0){
			GameBoxLineManager.instance.GenerateButtomBoxLine(GAME_BOX_LINE_TYPE.NORMAL, -1)
			this._target_box_line = GameBoxLineManager.instance.allBoxLines[0]
			max_count = 1
		}else{
			this._target_box_line = GameBoxLineManager.instance.allBoxLines[max_count - 1]
		}
		this._maxClearLineCount = max_count
		let new_count = max_count - this._allBox.length
		for(let index = 0; index < new_count; index++)
		{
			let new_img = new eui.Image("normal_png")
			this.addChild(new_img)
			this._allBox.push(new_img)
			new_img.anchorOffsetX = new_img.width / 2
			new_img.anchorOffsetY = 0
			new_img.x = this.width / 2
			new_img.y = (this._allBox.length - 1) * new_img.height
			new_img.visible = false
		}

		for(let index = 0; index < this._allBox.length; index++)
		{
			let img = this._allBox[index]
			if(index < max_count){
				img.visible = true
			}else{
				img.visible = false
			}
		}
		this.x = init_x
		this.y = init_y
		this.is_ending = false
		this.visible = true
	}

	public CheckHit():void
	{
		if(this.is_ending)
		{
			return
		}
		let global_target_point_y = this._target_box_line.y - this._target_box_line.height
		if(this.y <= global_target_point_y){
			this.y = global_target_point_y
			
			for(let index = 0; index < this._maxClearLineCount; index++)
			{
				let box_line = GameBoxLineManager.instance.allBoxLines[index]
				box_line.InsertBox(this.position)
			}
			let clear_lines = []
			for(let index = 0; index < GameBoxLineManager.instance.allBoxLines.length; index++)
			{
				let box_line = GameBoxLineManager.instance.allBoxLines[index]
				if(box_line.CanClear()){
					clear_lines.push(box_line)
				}else{
					break
				}
			}
			let clear_line_count = clear_lines.length
			for(let index = 0; index < clear_lines.length; index++)
			{
				let box_line = clear_lines[index]
				box_line.PlayHitAnimation()
			}
			
			let max_count = GameBoxLineManager.instance.GetMaxBoxCount()
			let cur_count = GameBoxLineManager.instance.GetCurrentBoxCount()
			GameNet.reqUpdateState(max_count, cur_count,Math.max( clear_line_count - 1, 0))

			if(clear_line_count > 1){
				this.mainScenePanel.ShowAddLine(clear_line_count - 1)
			}

			if(clear_line_count >= 1){
				SoundManager.getInstance().playSound("clear_mp3")
			} else{
				SoundManager.getInstance().playSound("normal_mp3")
			}
			
			this.visible = false
			this.is_ending = true
		}
	}

	public Move():void
	{
		if(this.is_ending)
		{
			return
		}
		this.y += GameConst.MY_MOVE_SPEED
	}
}