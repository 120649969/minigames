class MyBall extends Ball{

	public speed_x:number
	public speed_y:number
	private _mainPanel:ui.MainScenePanel

	private _all_linked_same_color_balls = []
	private _all_not_connected_balls = []
	private _all_connected_balls = []

	public constructor() {
		super()
		this._mainPanel = GameController.instance.GetMainScenePanel()
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
	}

	public Update():void
	{
		this.x += this.speed_x
		this.y += this.speed_y
		this.CheckHit()
	}

	public CheckHit():void
	{
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		
		let current_ball_x = Math.ceil(this.x / (this.width / 2))
		let start_ball_y = 0
		for(let index = 0; index < game_logic_component.all_lines.length; index++)
		{
			let line = game_logic_component.all_lines[index]
			if(line.y < this.y){
				start_ball_y = index
				break
			}
		}
		let all_check_balls:Array<Ball> = []
		for(let x_index = current_ball_x - 2; x_index <= current_ball_x + 2; x_index++)
		{
			for(let y_index = start_ball_y; y_index < game_logic_component.all_lines.length; y_index++)
			{
				let line =  game_logic_component.all_lines[y_index]
				if(line.isVisible && line.IsValidIndex(x_index)){
					all_check_balls.push(line.all_balls[x_index])
					break
				}
			}
		}
		for(let index = 0; index < all_check_balls.length; index++)
		{
			let other_ball = all_check_balls[index]
			if(this._checkHitBall(other_ball)){
				this._all_linked_same_color_balls.push([other_ball])
				this._clear_all_balls_state()
				this._search_linked_same_color_balls()
				this.test_find_balls()
				break
			}
		}
	}

	public TestFindBall(sourceBall:Ball):void
	{
		this._all_linked_same_color_balls.push([sourceBall])
		this._clear_all_balls_state()
		this._search_linked_same_color_balls()
		this._search_all_not_linked_balls()
		this.test_find_balls()
	}

	private _checkHitBall(other_ball:Ball):boolean
	{
		let distance = Math.sqrt(Math.pow(this.x - other_ball.x, 2) + Math.pow(this.y - other_ball.y, 2))
		return distance <= other_ball.width
	}

	private _search_all_not_linked_balls():void
	{
		let top_line:BallLine = null
		let top_line_index = 0
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		for(let index = 0; index < game_logic_component.all_lines.length; index ++)
		{
			let cur_line = game_logic_component.all_lines[index]
			if(!cur_line.isVisible){
				break
			}else{
				top_line = cur_line
				top_line_index = index
			}
		}
		if(!top_line){
			return
		}

		for(let index = 0; index < top_line.all_balls.length; index++)
		{
			let ball = top_line.all_balls[index]
			if(!ball.isMarkedSameColorClear && ball.IsValid()){
				this._search_connected_balls(ball)
			}
		}
		this._all_not_connected_balls = []
		this._all_connected_balls = []
		for(let line_index = top_line_index; line_index >= 0; line_index--)
		{
			let cur_line = game_logic_component.all_lines[line_index]
			for(let ball_index = 0; ball_index < cur_line.all_balls.length; ball_index++)
			{
				let ball = cur_line.all_balls[ball_index]
				if(ball.IsValid() && !ball.isMarkedSameColorClear && !ball.isRootConnected){
					this._all_not_connected_balls.push(ball)
				}else if(ball.IsValid() && ball.isRootConnected){
					this._all_connected_balls.push(ball)
				}
			}
		}
	}

	private _search_connected_balls(sourceBall:Ball):void
	{
		if(sourceBall.isRootConnected){
			return
		}
		sourceBall.isRootConnected = true

		//left
		let ball = this._get_ball_in_ball_line(sourceBall.ball_line, sourceBall.index_in_line - 2)
		if(ball){
			this._search_connected_balls(ball)
		}
		//right
		ball = this._get_ball_in_ball_line(sourceBall.ball_line, sourceBall.index_in_line + 2)
		if(ball){
			this._search_connected_balls(ball)
		}

		//left down right down
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		let cur_line_index = game_logic_component.all_lines.indexOf(sourceBall.ball_line)
		let next_line_index = cur_line_index - 1
		let next_line = game_logic_component.all_lines[next_line_index]
		if(next_line){
			ball = this._get_ball_in_ball_line(next_line, sourceBall.index_in_line - 1)
			if(ball){
				this._search_connected_balls(ball)
			}

			ball = this._get_ball_in_ball_line(next_line, sourceBall.index_in_line + 1)
			if(ball){
				this._search_connected_balls(ball)
			}
		}

		//left top right top
		let last_line_index = cur_line_index + 1
		let last_line = game_logic_component.all_lines[last_line_index]
		if(last_line && last_line.isVisible){
			ball = this._get_ball_in_ball_line(last_line, sourceBall.index_in_line - 1)
			if(ball){
				this._search_connected_balls(ball)
			}

			ball = this._get_ball_in_ball_line(last_line, sourceBall.index_in_line + 1)
			if(ball){
				this._search_connected_balls(ball)
			}
		}
	}


	private _search_linked_same_color_balls():void
	{
		let new_step_array = []
		let thisStepBalls:Array<Ball> = this._all_linked_same_color_balls[this._all_linked_same_color_balls.length - 1] || []
		for(let index = 0; index < thisStepBalls.length; index++)
		{
			let ball:Ball = thisStepBalls[index]
			let linkedBalls = this._search_linked_balls_by_ball(ball)
			new_step_array = new_step_array.concat(linkedBalls)
		}
		if(new_step_array.length > 0)
		{
			this._all_linked_same_color_balls.push(new_step_array)
			this._search_linked_same_color_balls()
		}
	}

	private test_find_balls():void
	{
		for(let index1 = 0; index1 < this._all_linked_same_color_balls.length; index1++)
		{
			let temp_array:Array<Ball> = this._all_linked_same_color_balls[index1]
			for(let index2 = 0; index2 < temp_array.length; index2++)
			{
				let ball = temp_array[index2]
				CommonUtils.performDelay(function(){
					ball.SetBallType(BALL_TYPE.TYPE_EMPTY)
					// CommonUtils.SetColor(ball.img_ball, 0xff0000)
				}, 0.1 * 1000 * index1, this)
			}
		} 
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		for(let index1 = 0; index1 < this._all_not_connected_balls.length; index1++)
		{
			let ball:Ball = this._all_not_connected_balls[index1]
			let line_index = game_logic_component.all_lines.indexOf(ball.ball_line)
			ball.MoveDown222()
		}
		// for(let index1 = 0; index1 < this._all_connected_balls.length; index1++)
		// {
		// 	let ball = this._all_connected_balls[index1]
		// 	CommonUtils.performDelay(function(){
		// 		CommonUtils.SetColor(ball.img_ball, 0xff0000)
		// 	}, 0, this)
		// }
		this._all_linked_same_color_balls = []
		this._all_not_connected_balls = []
		this._all_connected_balls = []
	}

	private _clear_all_balls_state():void
	{
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		for(let index = 0; index < game_logic_component.all_lines.length; index ++)
		{
			let cur_line = game_logic_component.all_lines[index]
			if(cur_line.isVisible){
				for(let ball_index = 0; ball_index < cur_line.all_balls.length; ball_index++)
				{
					let ball = cur_line.all_balls[ball_index]
					if(ball.IsValid()){
						ball.isMarkedSameColorClear = false
						ball.isRootConnected = false
					}
				}
			}else{
				break
			}
		}
	}

	private _search_linked_balls_by_ball(sourceBall:Ball):Array<Ball>
	{
		if(sourceBall.isMarkedSameColorClear){
			return []
		}
		sourceBall.isMarkedSameColorClear = true
		let ret:Array<Ball> = []
		//left
		let ball = this._get_same_color_ball_in_ball_line(sourceBall.ball_line, sourceBall.index_in_line - 2, sourceBall)
		if(ball){
			ret.push(ball)
		}
		//right

		ball = this._get_same_color_ball_in_ball_line(sourceBall.ball_line, sourceBall.index_in_line + 2, sourceBall)
		if(ball){
			ret.push(ball)
		}

		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		let cur_line_index = game_logic_component.all_lines.indexOf(sourceBall.ball_line)

		let next_line_index = cur_line_index - 1
		let next_line = game_logic_component.all_lines[next_line_index]
		if(next_line){
			//left_down
			ball = this._get_same_color_ball_in_ball_line(next_line, sourceBall.index_in_line - 1, sourceBall)
			if(ball){
				ret.push(ball)
			}
			//right_down
			ball = this._get_same_color_ball_in_ball_line(next_line, sourceBall.index_in_line + 1, sourceBall)
			if(ball){
				ret.push(ball)
			}
		}
		
		let last_line_index = cur_line_index + 1
		let last_line = game_logic_component.all_lines[last_line_index]
		if(last_line && last_line.isVisible){
			//left_top
			ball = this._get_same_color_ball_in_ball_line(last_line, sourceBall.index_in_line - 1, sourceBall)
			if(ball){
				ret.push(ball)
			}

			//right_top
			ball = this._get_same_color_ball_in_ball_line(last_line, sourceBall.index_in_line + 1, sourceBall)
			if(ball){
				ret.push(ball)
			}
		}
		return ret
	}

	private _get_same_color_ball_in_ball_line(ball_line:BallLine, index:number, source_ball:Ball):Ball
	{
		if(ball_line.IsValidIndex(index)){
			let ball = ball_line.GetBallIndex(index)
			if(ball.ball_type == source_ball.ball_type){
				return ball
			}
		}
		return null
	}

	private _get_ball_in_ball_line(ball_line:BallLine, index:number):Ball
	{
		if(ball_line.IsValidIndex(index)){
			let ball = ball_line.GetBallIndex(index)
			if(ball.isMarkedSameColorClear){
				return null
			}
			return ball
		}
		return null
	}
}