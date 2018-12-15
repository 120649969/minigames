class GameLogicComponent extends BaseComponent {

	private _mainScenePanel:ui.MainScenePanel
	public gameConfig:GameConfig
	public all_lines:Array<BallLine> = []
	private _myBall:MyBall

	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
		let native_configs:Array<Object>= RES.getRes("data_json")
		this.gameConfig = new GameConfig(native_configs)
	}

	public OnTouch(stageX:number, stageY:number):boolean
	{
		super.OnTouch(stageX, stageY)

		return false
	}

	public TryGenerateMultiLine():void
	{
		let generate_count = GameConst.MIN_KEPP_LINE_COUNT - this.all_lines.length
		if(generate_count > 0){
			let top_y = 0
			let is_last_long = false
			if(this.all_lines.length > 0){
				let top_line = this.all_lines[this.all_lines.length - 1]
				top_y = top_line.y
				is_last_long = top_line.is_long
			}
			let multi_line_config = this.gameConfig.GetRandomLineConfig(is_last_long)
			for(let index = 0; index < GameConst.GENERATE_STEP_LINE_COUNT; index++)
			{
				let line_config:Array<number> = multi_line_config.all_line_config[index] as Array<number>
				let new_line = new BallLine()
				new_line.UpdateConfig(line_config)
				this._mainScenePanel.m_game_container.addChild(new_line)
				let circle_width = new_line.height
				new_line.y = top_y - new_line.height + circle_width / 2 * (1 - Math.cos(30 / 180 * Math.PI)) + 5
				this.all_lines.push(new_line)
				top_y = new_line.y
			}
		}
	}

	public CheckOver():boolean
	{
		if(this.all_lines.length <= 0){
			return false
		}
		let buttom_multi_line = this.all_lines[0]
		let buttom_point = buttom_multi_line.localToGlobal(0, buttom_multi_line.height)
		let dead_line_point = this._mainScenePanel.m_line.localToGlobal(0, 0)
		if(buttom_point.y >= dead_line_point.y){
			GameController.instance.GameOver()
			return true
		}
		return false
	}

	public _get_current_speed():number
	{
		if(this.all_lines.length <= 0){
			return 0
		}
		let buttom_multi_line = this.all_lines[0]
		if(buttom_multi_line.y <= 2.5 * buttom_multi_line.height){
			return GameConst.quick_ball_speed
		}
		let buttom_point = buttom_multi_line.localToGlobal(0, buttom_multi_line.height)
		let dead_line_point = this._mainScenePanel.m_line.localToGlobal(0, 0)
		
		if(Math.abs(buttom_point.y -  dead_line_point.y) < 100){
			return GameConst.slow_ball_speed
		}
		return GameConst.normal_ball_speed
	}	

	public OnEnterFrame():void
	{
		if(this.CheckOver()){
			return
		}
		this.TryGenerateMultiLine()
		let speed = this._get_current_speed()
		for(let index = 0; index < this.all_lines.length; index++)
		{
			let line = this.all_lines[index]
			line.MoveDown(speed)
		}
	}

	public OnStart():void
	{
		super.OnStart()
		this._myBall = new MyBall()
		this._myBall.visible = false
	}

	public Fail():void
	{
		//我输了
		GameController.instance.GameOver()
	}

	public TestFindBall(sourceBall:Ball):void
	{
		this._myBall.TestFindBall(sourceBall)
	}
}
