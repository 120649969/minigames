class GameBoxLineManager {

	
	private static _instance:GameBoxLineManager
	public allBoxLines:Array<GameBoxLine> = []

	private _mainScenePanel:ui.MainScenePanel

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

	public GetMaxY():number
	{
		if(this.allBoxLines.length <= 0)
		{
			return 0
		}
		return this.allBoxLines[this.allBoxLines.length - 1].y
	}

	public RemoveBoxLine(box_line:GameBoxLine):void
	{
		let index = this.allBoxLines.indexOf(box_line)
		this.allBoxLines.splice(index, 1)
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

	public AddLine():void
	{
		for(let index = 0; index < this.allBoxLines.length; index++)
		{
			let box_line = this.allBoxLines[index]
			box_line.y += box_line.height
		}
	}
	
}