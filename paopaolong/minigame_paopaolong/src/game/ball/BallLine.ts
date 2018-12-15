class BallLine extends eui.Component{

	public balls_10:eui.Group
	public balls_9:eui.Group

	public line_10_balls:Array<Ball> = []
	public line_9_balls:Array<Ball> = []
	public all_balls:Array<Ball> = []

	public is_long:boolean = false
	public isVisible:boolean = false

	public constructor() {
		super()
		this.skinName = "BallLineSkin"

		for(let index = 0; index < GameConst.LINE_BALL_COUNT; index++)
		{
			if(index % 2 == 0){
				let ball:Ball = this["m_1_" + (index / 2 + 1)]
				this.line_10_balls.push(ball)
				this.all_balls.push(ball)
				ball.index_in_line = index
				ball.ball_line = this
			}else{
				let ball:Ball = this["m_2_" + ((index - 1) / 2 + 1)]
				this.line_9_balls.push(ball)
				this.all_balls.push(ball)
				ball.index_in_line = index
				ball.ball_line = this
			}
		}
	}

	public UpdateConfig(line_config:Array<number>):void
	{
		let is_long = line_config.length == this.line_10_balls.length
		this.ShowLine(is_long)
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
		}
		for(let index = 0; index < other_balls.length; index++)
		{
			let ball = other_balls[index]
			ball.SetBallType(BALL_TYPE.TYPE_EMPTY)
		}
	}

	public ShowLine(isLong:boolean):void
	{
		this.is_long = isLong
		for(let index = 0; index < this.line_10_balls.length; index++)
		{
			this.line_10_balls[index].visible = this.is_long
		}
		this.balls_10.visible = this.is_long

		for(let index = 0; index < this.line_9_balls.length; index++)
		{
			this.line_9_balls[index].visible = !this.is_long
		}
		this.balls_9.visible = !this.is_long
	}

	public IsValidIndex(index:number):boolean
	{
		if(index >= this.all_balls.length || index < 0){
			return false
		}
		if(index % 2 == 0 && !this.is_long){
			return false
		}else if(index % 2 != 0 && this.is_long){
			return false
		}
		let ball = this.all_balls[index]
		if(ball.ball_type != BALL_TYPE.TYPE_EMPTY && !ball.isMarkedSameColorClear){
			return true
		}
		return false
	}

	public GetValidBalls():Array<Ball>
	{
		if(this.is_long){
			return this.line_10_balls
		}else{
			return this.line_9_balls
		}
	}

	public GetBallIndex(index):Ball
	{
		return this.all_balls[index]
	}

	public MoveDown(speed):void
	{
		this.y += speed
		// this.isVisible = this.y >= this.height * -0.8
		this.isVisible = this.y >= 0
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
}