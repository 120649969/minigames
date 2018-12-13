class GameLogicComponent extends BaseComponent {

	private _mainScenePanel:ui.MainScenePanel
	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
	}

	public OnTouch(stageX:number, stageY:number):boolean
	{
		super.OnTouch(stageX, stageY)

		let _myMoveObject = GameController.instance.GetMoveObject()
		if(!_myMoveObject.is_ending){
			return
		}
		let position = Math.floor(stageX / (this._mainScenePanel.width / 4))
		
		let init_x = this._mainScenePanel.width / 8 * (position * 2 + 1)
		let init_y = this._mainScenePanel.height + _myMoveObject.height
		_myMoveObject.Restart(init_x, init_y, position)
		return false
	}

	public OnEnterFrame():void
	{
		GameBoxLineManager.instance.Update()
		GameController.instance.GetMoveObject().Move()

		let allLines = GameBoxLineManager.instance.allBoxLines
		if(allLines.length <= 0){
			return
		}
		let first_line = allLines[0]
		if(first_line.IsReachButtom())
		{
			this.Fail()
		}
	}

	public Fail():void
	{
		//我输了
		let index = 1
		GameController.instance.GameOver()
	}
}
