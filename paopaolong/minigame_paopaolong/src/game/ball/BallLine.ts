class BallLine extends egret.DisplayObjectContainer{

	public line_10_balls:Array<Ball> = []
	public line_9_balls:Array<Ball> = []
	public all_balls:Array<Ball> = []

	public is_long:boolean = false
	public isVisible:boolean = false

	public constructor() {
		super()

		let next_x = 0
		let ball_width = 0
		let ball_height = 0
		for(let index = 0; index < GameConst.LINE_BALL_COUNT; index++)
		{
			let ball = new Ball()
			ball.SetBallType(BALL_TYPE.TYPE_EMPTY)
			this.all_balls.push(ball)
			if(index % 2== 0){
				this.line_10_balls.push(ball)
			}else{
				this.line_9_balls.push(ball)
			}
			this.addChild(ball)
			ball.index_in_line = index
			ball.ball_line = this
			ball.x = next_x
			next_x += ball.width / 2
			ball_width = ball.width / 2
			ball_height = ball.height
		}
		this.width = next_x + ball_width
		this.height = ball_height

		GameController.instance.GetMainScenePanel().m_game_container.addChild(this)
	}

	public ReSet():void
	{
		for(let ball of this.all_balls)
		{
			ball.ReSet()
			this.isVisible = false
		}
	}

	public UpdateConfig(line_config:Array<number>):void
	{
		let is_long = line_config.length == this.line_10_balls.length
		this.is_long = is_long
		let target_balls = this.line_10_balls
		let other_balls = this.line_9_balls
		if(!is_long){
			target_balls = this.line_9_balls
			other_balls = this.line_10_balls
		}
		for(let index = 0; index < target_balls.length; index++)
		{
			let ball = target_balls[index]
			ball.SetBallType(line_config[index])
			ball.visible = true
		}
		for(let index = 0; index < other_balls.length; index++)
		{
			let ball = other_balls[index]
			ball.SetBallType(BALL_TYPE.TYPE_EMPTY)
			ball.visible = false
		}
	}

	public IsValidIndex(index:number):boolean
	{
		if(index >= this.all_balls.length || index < 0){
			return false
		}
		let ball = this.all_balls[index]
		if(ball.IsValid() && !ball.isMarkedSameColorClear){
			return true
		}
		return false
	}

	public GetBallIndex(index):Ball
	{
		return this.all_balls[index]
	}

	public MoveDown(speed):void
	{
		this.y += speed
		this.isVisible = this.y >= this.height * -0.8
	}

	public ExportJson():Object
	{
		let ret = []
		let target_line_balls = this.line_10_balls
		if(!this.is_long){
			target_line_balls = this.line_9_balls
		}

		for(let index = 0; index < target_line_balls.length; index++)
		{
			let ball = target_line_balls[index]
			ret.push(ball.ball_type)
		}
		return ret
	}

	public LoadJson(data:Array<number>):void
	{
		let length = data.length
		let target_line_balls = null
		if(length == this.line_10_balls.length){
			target_line_balls = this.line_10_balls
		} else{
			target_line_balls = this.line_9_balls
		}

		for(let index = 0; index < target_line_balls.length; index++)
		{
			let ball:Ball = target_line_balls[index]
			ball.SetBallType(data[index])
		}
	}

	public IsValid():boolean
	{
		for(let ball of this.all_balls)
		{
			if(ball.IsValid())
			{
				return true
			}
		}
		return false
	}
}