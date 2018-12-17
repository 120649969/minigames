class GameLogicComponent extends BaseComponent {

	private _mainScenePanel:ui.MainScenePanel
	public gameConfig:GameConfig
	public all_lines:Array<BallLine> = []
	private _myBall:MyBall

	private _global_start_point:egret.Point

	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
		let native_configs:Array<Object>= RES.getRes("data_json")
		this.gameConfig = new GameConfig(native_configs)

		let global_start_point = this._mainScenePanel.m_start.localToGlobal(this._mainScenePanel.m_start.width / 2, this._mainScenePanel.m_start.height / 2)
		this._global_start_point = global_start_point
		let local_in_cointainer = this._mainScenePanel.m_rotate_line.parent.globalToLocal(global_start_point.x, global_start_point.y)
		this._mainScenePanel.m_rotate_line.x = local_in_cointainer.x
		this._mainScenePanel.m_rotate_line.y = local_in_cointainer.y
	}

	private _get_rotate(stageX:number, stageY:number):number
	{
		let distance = Math.sqrt(Math.pow(stageX - this._global_start_point.x, 2) + Math.pow(stageY - this._global_start_point.y, 2))
		let rate_x = (stageX - this._global_start_point.x) / distance
		let rate_y = (stageY - this._global_start_point.y) / distance

		let degree = Math.acos(rate_x)
		return degree
	}

	public OnTouchStart(stageX:number, stageY:number):boolean
	{
		super.OnTouchStart(stageX, stageY)
		if(this._myBall && this._myBall.is_moving){
			return false
		}

		this._mainScenePanel.m_rotate_line.visible = true
		let degree = this._get_rotate(stageX, stageY)
		degree = degree / Math.PI * 180
		degree = Math.min(GameConst.MAX_DEGREE, Math.max(GameConst.MIN_DEGREE, degree))
		this._mainScenePanel.m_rotate_line.rotation = degree * -1
		return false
	}

	public OnTouchMove(stageX:number, stageY:number):void
	{
		super.OnTouchMove(stageX, stageY)
		let degree = this._get_rotate(stageX, stageY)
		degree = degree / Math.PI * 180
		degree = Math.min(GameConst.MAX_DEGREE, Math.max(GameConst.MIN_DEGREE, degree))
		this._mainScenePanel.m_rotate_line.rotation = degree * -1
	}

	public OnTouchEnd(stageX:number, stageY:number):void
	{
		super.OnTouchEnd(stageX, stageY)
		this._mainScenePanel.m_rotate_line.visible = false
		if(this._myBall && this._myBall.is_moving){
			return
		}

		if(this._mainScenePanel.m_rotate_line.rotation == -1 * GameConst.MIN_DEGREE || this._mainScenePanel.m_rotate_line.rotation == -1 * GameConst.MAX_DEGREE)
		{
			return
		}
		let rate_x = Math.cos(this._mainScenePanel.m_rotate_line.rotation * -1 / 180 * Math.PI)
		let rate_y = Math.sin(this._mainScenePanel.m_rotate_line.rotation * -1 / 180 * Math.PI) * -1

		let speed_x = rate_x * GameConst.MY_BALL_SPEED
		let speed_y = rate_y * GameConst.MY_BALL_SPEED
		this._myBall.speed_x = speed_x
		this._myBall.speed_y = speed_y

		this._myBall.is_moving = true
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
				let line_config:Array<number> = multi_line_config.all_line_config[GameConst.GENERATE_STEP_LINE_COUNT - 1 - index] as Array<number>
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
		if(buttom_multi_line.y <= 1 * buttom_multi_line.height){
			return GameConst.quick_ball_speed
		}
		let buttom_point = buttom_multi_line.localToGlobal(0, buttom_multi_line.height)
		let dead_line_point = this._mainScenePanel.m_line.localToGlobal(0, 0)
		
		if(Math.abs(buttom_point.y -  dead_line_point.y) < 100){
			return GameConst.slow_ball_speed
		}
		return GameConst.normal_ball_speed
	}	

	private _isStop:boolean = false
	public OnEnterFrame():void
	{
		for(let index = this._all_move_down_balls.length - 1; index >= 0; index--)
		{
			let ball = this._all_move_down_balls[index]
			if(ball.UpdateMoveDown()){
				this._all_move_down_balls.splice(index, 1)
			}
		}
		
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
		
		if(this._myBall)
		{
			this._myBall.Update()
		}
	}

	public OnStart():void
	{
		super.OnStart()
		this.GenerateNextMyBall()
	}

	public GenerateNextMyBall():void
	{
		this._myBall = new MyBall()
	}

	public Fail():void
	{
		//我输了
		GameController.instance.GameOver()
	}

	public TestFindBall(sourceBall:Ball):void
	{
	}

	private _all_move_down_balls:Array<MoveDownBall> = []
	public AddMoveDownBalls(source_ball:Ball):void
	{
		let move_down_ball:MoveDownBall = new MoveDownBall()
		move_down_ball.SetBallType(source_ball.ball_type)
		move_down_ball.x = source_ball.x
		move_down_ball.y = source_ball.y
		source_ball.parent.addChild(move_down_ball)

		move_down_ball.PlayMoveDownAnimation()
		this._all_move_down_balls.push(move_down_ball)
	}

	public InsertNewLineToButtom():BallLine
	{
		let ball_line = new BallLine()
		let line_config = null
		let is_last_long = false
		if(this.all_lines.length > 0){
			is_last_long = this.all_lines[0].is_long
		}
		if(is_last_long){
			ball_line.UpdateConfig(GameConst.Generat9LineConfig())
		}else{
			ball_line.UpdateConfig(GameConst.Generate10LineConfig())
		}
		ball_line.isVisible = true
		this._mainScenePanel.m_game_container.addChild(ball_line)
		let circle_width = ball_line.height
		ball_line.y = this.all_lines[0].y + ball_line.height - circle_width / 2 * (1 - Math.cos(30 / 180 * Math.PI)) - 5
		this.all_lines.unshift(ball_line)
		return ball_line
	}
}
