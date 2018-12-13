class MyMoveObject extends eui.Component{

	public _target_box_line:GameBoxLine
	public _allBoxLine:Array<GameBoxLine>
	public _maxClearLineCount:number
	private mainScenePanel:ui.MainScenePanel
	public is_ending:boolean = true
	public position:number

	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.skinName = "MyMoveObjectSkin"
		this.mainScenePanel = mainPanel
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		this.mainScenePanel.box_line_container.addChild(this)
		this.visible = false
	}

	public Restart(init_x:number, init_y:number, position:number):void
	{
		this.position = position
		this._allBoxLine = GameBoxLineManager.instance.GetMaxCanClearLines(position)
		this._maxClearLineCount = this._allBoxLine.length
		if(this._maxClearLineCount == 0){
			this._target_box_line = GameBoxLineManager.instance.GetButtomBoxLine()
		} else {
			this._target_box_line = this._allBoxLine[0]
		}
		this.x = init_x
		this.y = init_y
		this.is_ending = false
		this.visible = true
	}

	public Move():void
	{
		if(this.is_ending)
		{
			return
		}
		let global_target_point = this._target_box_line.parent.localToGlobal(this._target_box_line.x, this._target_box_line.y - this._target_box_line.height / 2)
		if(this._maxClearLineCount == 0){
			global_target_point.y += this._target_box_line.height
		}
		this.y += GameConst.MY_MOVE_SPEED
		if(this.y <= global_target_point.y){
			this.y = global_target_point.y
			if(this._maxClearLineCount == 0){
				GameBoxLineManager.instance.GenerateButtomBoxLine(GAME_BOX_LINE_TYPE.NORMAL, this.position)
			} else {
				for(let index = 0; index < this._allBoxLine.length; index++)
				{
					let box_line = this._allBoxLine[index]
					if(box_line.Hit())
					{
						box_line.ShowBox(this.position)
					}
				}
			}
			this.visible = false
			this.is_ending = true
		}
	}
}