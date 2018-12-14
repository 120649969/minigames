class GameBoxLineManager {

	
	private static _instance:GameBoxLineManager
	public allBoxLines:Array<GameBoxLine> = []

	private _mainScenePanel:ui.MainScenePanel

	private _boxWidth:number = 0
	private _boxHeight:number = 0
	private _maxBoxCountInVisible:number = 0

	public constructor() {
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
	}

	public static get instance():GameBoxLineManager
	{
		if(!GameBoxLineManager._instance)
		{
			GameBoxLineManager._instance = new GameBoxLineManager()
		}
		return GameBoxLineManager._instance
	}

	public GetBoxWidth():number
	{
		return this._boxWidth
	}

	public GetBoxHeight():number
	{
		return this._boxHeight
	}

	public GetMaxBoxCount():number
	{
		if(this._boxWidth == 0 || this._boxHeight == 0)
		{
			return 0
		}
		if(this._maxBoxCountInVisible == 0)
		{
			this._maxBoxCountInVisible = Math.ceil(this._mainScenePanel.height / this._boxHeight)
		}
		return this._maxBoxCountInVisible
	}

	public GetCurrentBoxCount():number
	{
		if(this._boxWidth == 0 || this._boxHeight == 0)
		{
			return 0
		}
		let count = 0
		for(let index = 0; index < this.allBoxLines.length; index++)
		{
			let box_line = this.allBoxLines[index]
			if(box_line.y <= 0)
			{
				break
			}
			count += 1
		}
		return count
	}


	public Update():void
	{
		let top_box_line_y = 0
		if(this.allBoxLines.length > 0){
			let top_box_line = this.allBoxLines[this.allBoxLines.length - 1]
			top_box_line_y = top_box_line.y - top_box_line.height
		}
		let new_box_line = GameConst.NORMAL_BOX_LINE_COUNT - this.allBoxLines.length
		for(let index = 0; index < new_box_line; index++)
		{
			let new_box_line = new GameBoxLine(this._mainScenePanel)
			let type = GAME_BOX_LINE_TYPE.NORMAL
			if(Math.random() < GameConst.HARD_RATE){
				type = GAME_BOX_LINE_TYPE.HARD
			}
			new_box_line.GenerateBox(type)
			new_box_line.width = this._mainScenePanel.width
			new_box_line.anchorOffsetX = this._mainScenePanel.width / 2
			new_box_line.anchorOffsetY = new_box_line.height
			let new_y = top_box_line_y - index * new_box_line.height
			new_box_line.x = this._mainScenePanel.width / 2
			new_box_line.y = new_y
			this.allBoxLines.push(new_box_line)

			if(this._boxWidth == 0 || this._boxHeight == 0)
			{
				this._boxWidth = new_box_line.width
				this._boxHeight = new_box_line.height
			}
		}

		for(let index = 0; index < this.allBoxLines.length; index ++)
		{
			let box_line = this.allBoxLines[index]
			box_line.Move()
		}
	}

	public GenerateButtomBoxLine(type:GAME_BOX_LINE_TYPE, position)
	{
		let top_box_line_y = 0
		if(this.allBoxLines.length > 0){
			let top_box_line = this.allBoxLines[0]
			top_box_line_y = top_box_line.y + top_box_line.height
		}
		let new_box_line = new GameBoxLine(this._mainScenePanel)
		new_box_line.GenerateSingleBox(type, position)
		new_box_line.width = this._mainScenePanel.width
		new_box_line.anchorOffsetX = this._mainScenePanel.width / 2
		new_box_line.anchorOffsetY = new_box_line.height
		new_box_line.x = this._mainScenePanel.width / 2
		new_box_line.y = top_box_line_y
		this.allBoxLines.unshift(new_box_line)
	}

	public RemoveBoxLine(box_line:GameBoxLine):void
	{
		let index = this.allBoxLines.indexOf(box_line)
		this.allBoxLines.splice(index, 1)
		this.PlayLineClearAnimation(box_line.x, box_line.y - box_line.height / 2)
	}

	public GetMaxIdleLine(position):number
	{
		let count = 0
		for(let index = 0; index < this.allBoxLines.length; index++)
		{
			let box_line = this.allBoxLines[index]
			if(box_line.idle_positions.indexOf(position) >= 0){
				count += 1
				if(box_line.life > 1){
					break
				}
			} else {
				break
			}
		}
		return count
	}

	public GetMaxCanClearLines(position:number):Array<GameBoxLine>
	{
		let ret:Array<GameBoxLine> = []
		for(let index = 0; index < this.allBoxLines.length; index++)
		{
			let box_line = this.allBoxLines[index]
			if(box_line.idle_positions.indexOf(position) >= 0){
				if(box_line.idle_positions.length == 1){
					if(box_line.life >= 1){
						ret.unshift(box_line)
						if(box_line.life > 1){
							return ret
						}
					}
				} else {
					ret.unshift(box_line)
					return ret
				}
			} else {
				return ret
			}
		}
		return ret
	}

	public GetButtomBoxLine():GameBoxLine
	{
		if(this.allBoxLines.length <= 0)
		{
			return null
		}
		return this.allBoxLines[0]
	}

	public AddLine(count:number):void
	{
		for(let index = 0; index < this.allBoxLines.length; index++)
		{
			let box_line = this.allBoxLines[index]
			box_line.y += box_line.height * count
		}
	}
	
	private _cacheLineArmature:Array<dragonBones.EgretArmatureDisplay> = []
	public PlayLineClearAnimation(x:number, y:number):void
	{
		if(this._cacheLineArmature.length <= 0)
		{
			let armatureDisplay = CommonUtils.createDragonBones("line_ske_json", "line_tex_json", "line_tex_png", "line_armature")
			this._mainScenePanel.box_line_container.addChild(armatureDisplay)
			this._cacheLineArmature.push(armatureDisplay)

			let __this = this
			armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				armatureDisplay.visible = false
				__this._cacheLineArmature.push(armatureDisplay)
			}, this)
		}
		let armatureDisplay = this._cacheLineArmature.pop()
		armatureDisplay.visible = true
		armatureDisplay.animation.play("line_animation", 1)
		armatureDisplay.x = x
		armatureDisplay.y = y
	}
}