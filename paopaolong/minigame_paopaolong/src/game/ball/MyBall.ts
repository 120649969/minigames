class MyBall extends Ball{

	public speed_x:number
	public speed_y:number
	private _mainPanel:ui.MainScenePanel

	private _all_linked_same_color_balls = []
	private _all_not_connected_balls = []
	private _all_connected_balls = []
	private _has_insert_balls:Array<Ball> = []

	public is_end:boolean = false
	public is_moving:boolean = false

	private _hit_point:egret.Point = new egret.Point()
	private _hit_dir:egret.Point = new egret.Point()

	public static times:number = 0
	public constructor() {
		super()
		this._mainPanel = GameController.instance.GetMainScenePanel()
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		this._mainPanel.m_game_container.addChild(this)

		let global_start_point = this._mainPanel.m_start.localToGlobal(this._mainPanel.m_start.width / 2, this._mainPanel.m_start.height / 2)
		let local_in_cointainer = this._mainPanel.m_game_container.globalToLocal(global_start_point.x, global_start_point.y)
		this.x = local_in_cointainer.x
		this.y = local_in_cointainer.y

		let random_type = Math.ceil(Math.random() * (BALL_TYPE.MAX_TYPE))
		this.SetBallType(random_type)
		this.is_moving = false
		this.is_end = false
	}

	public Update():void
	{
		if(!this.is_moving){
			return
		}
		if(this.is_end){
			return
		}
		
		let step_times = 60
		for(let index = 0; index < step_times; index++)
		{
			this.x += this.speed_x / step_times
			this.y += this.speed_y / step_times
			this.CheckHit()
			if(this.is_end){
				return
			}
		}
		if(this.y <= 0){
			this.is_end = true
			this.parent.removeChild(this)
			this._mainPanel.GetGameLogicComponent().GenerateNextMyBall()
		}
	}

	public CheckHit():void
	{
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		
		let current_ball_x = Math.floor((this.x + this.width / 2) / (this.width / 2))
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
		
		for(let x_index = current_ball_x - 4; x_index <= Math.min(GameConst.LINE_BALL_COUNT - 1, current_ball_x + 4); x_index++)
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
				this._on_hit_ball(other_ball)
				this.is_end = true
				return
			}
		}

		let is_hit_left_board = this.x <= this.width / 2
		if(is_hit_left_board){
			this.speed_x *= -1
			return
		}
		let is_Hit_right_board = this.x >= this._mainPanel.m_game_container.width - this.width / 2
		if(is_Hit_right_board){
			this.speed_x *= -1
			return
		}
	}

	private _checkHitBall(other_ball:Ball):boolean
	{
		let global_point = other_ball.localToGlobal(other_ball.width / 2, other_ball.height / 2)
		let local_point = this._mainPanel.m_game_container.globalToLocal(global_point.x, global_point.y)
		let distance = Math.sqrt(Math.pow(this.x - local_point.x, 2) + Math.pow(this.y - local_point.y, 2))
		return distance <= other_ball.width
	}

	private _on_hit_ball(hit_ball:Ball):void
	{
		let global_point = hit_ball.localToGlobal(hit_ball.width / 2, hit_ball.height / 2)
		let local_point = this._mainPanel.m_game_container.globalToLocal(global_point.x, global_point.y)
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		let cur_line_index = game_logic_component.all_lines.indexOf(hit_ball.ball_line)
		
		let target_ball:Ball = null
		do{
			let is_buttom = Math.abs(local_point.x - this.x)  < Math.abs(local_point.y - this.y)
			if(is_buttom){
				let next_line_index = cur_line_index - 1
				let ball_line:BallLine = game_logic_component.all_lines[next_line_index]
				if(!ball_line){
					ball_line = game_logic_component.InsertNewLineToButtom()
				}
				egret.assert(!ball_line.IsValidIndex(hit_ball.index_in_line - 1) || !ball_line.IsValidIndex(hit_ball.index_in_line + 1))
				let test_idxs = []
				if(this.x < local_point.x){
					test_idxs.push(hit_ball.index_in_line - 1)
					test_idxs.push(hit_ball.index_in_line + 1)
				}else{
					test_idxs.push(hit_ball.index_in_line + 1)
					test_idxs.push(hit_ball.index_in_line - 1)
				}
				for(let test_idx of test_idxs){
					let ball = ball_line.GetBallIndex(test_idx)
					ball.SetBallType(this.ball_type)
					target_ball = ball
					break
				}
			}else{
				let ball_line:BallLine = hit_ball.ball_line
				let test_idx = -1
				//left right
				if(local_point.x > this.x){ //left
					egret.assert(!ball_line.IsValidIndex(hit_ball.index_in_line - 2))
					test_idx = hit_ball.index_in_line - 2
				}else{//right
					egret.assert(!ball_line.IsValidIndex(hit_ball.index_in_line + 2))
					test_idx = hit_ball.index_in_line + 2
				}
				let ball = ball_line.GetBallIndex(test_idx)
				if(ball){
					ball.SetBallType(this.ball_type)
					target_ball = ball
				}
				break
			}
			
		}while(0);

		if(target_ball){
			let global_ball_point = target_ball.localToGlobal(target_ball.width / 2, target_ball.height / 2)
			let local_point = this.parent.globalToLocal(global_ball_point.x, global_ball_point.y)
			game_logic_component.GenerateNextMyBall()
			this.TryClearBalls(target_ball, hit_ball)
			target_ball.visible = true
			this.Remove()
		}
	}

	private Remove():void
	{
		this.parent.removeChild(this)
	}

	private _clear_all_data():void
	{
		this._all_linked_same_color_balls = []
		this._all_not_connected_balls = []
		this._all_connected_balls = []
		this._has_insert_balls = []
	}

	public TryClearBalls(sourceBall:Ball, hitBall:Ball):void
	{
		this._clear_all_data()
		this._all_linked_same_color_balls.push([sourceBall])
		this._has_insert_balls.push(sourceBall)
		this._clear_all_balls_state()
		this._search_linked_same_color_balls()

		let total_same_color_count = 0
		for(let array of this._all_linked_same_color_balls){
			total_same_color_count += (array as Array<Ball>).length
		}
		if(total_same_color_count < GameConst.MIN_CLEAR_BALL_COUNT){
			for(let array of this._all_linked_same_color_balls)
			{
				for(let ball of array)
				{
					(ball as Ball).isMarkedSameColorClear = false
				}
			}
			this.do_hit_effect(this, hitBall)
			return
		}
		this._search_all_not_linked_balls()
		this.do_clear_effect()
		this._remove_invalid_ball_line()
	}

	private do_hit_effect(source_ball:Ball, hitBall:Ball):void
	{
		let dir_point = this._calculateDir(source_ball, hitBall)
		this._do_ball_hit_effect(source_ball, hitBall)
		let hit_connected_balls = this._find_connected_balls(hitBall)
		for(let ball of hit_connected_balls){
			this._do_ball_hit_effect(hitBall, ball)
		}
	}

	private _do_ball_hit_effect(ball1:Ball, ball2:Ball):void
	{
		let dir = this._calculateDir(ball1, ball2)
		let cur_img_x = ball2.img_ball.x
		let cur_img_y = ball2.img_ball.y

		let target_x = cur_img_x + dir.x * GameConst.HIT_MOVE_DISTANCE
		let target_y = cur_img_y + dir.y * GameConst.HIT_MOVE_DISTANCE
		egret.Tween.get(ball2.img_ball).to({x:target_x, y:target_y}, 0.05 * 1000).to({x:cur_img_x, y:cur_img_y}, 0.05 * 1000)
	}

	private _calculateDir(ball1:Ball, ball2:Ball):egret.Point
	{
		let global_ball1_point = ball1.localToGlobal(ball1.width / 2, ball1.height / 2)
		let global_ball2_point = ball2.localToGlobal(ball2.width / 2, ball2.height / 2)
		let dir_x = global_ball2_point.x - global_ball1_point.x
		let dir_y = global_ball2_point.y - global_ball1_point.y
		dir_x = dir_x / Math.sqrt(Math.pow(dir_x, 2) + Math.pow(dir_y, 2))
		dir_y = dir_y / Math.sqrt(Math.pow(dir_x, 2) + Math.pow(dir_y, 2))

		return new egret.Point(dir_x, dir_y)
	}

	private _remove_invalid_ball_line():void
	{
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		let remove_count = 0
		for(let ballLine of game_logic_component.all_lines)
		{
			if(ballLine.IsValid()){
				break
			}else{
				remove_count++
			}
		}
		game_logic_component.all_lines.splice(0, remove_count)
		console.log("移除了行数：", remove_count)
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

		//fix bug:这里应该用当前最顶层的ballLine的上一层作为搜索起点，因为最顶层有可能出现消除的情况，不能把它的所有ball视为连接的。所以要取上一层。
		let last_of_top_line = game_logic_component.all_lines[top_line_index + 1]
		if(!last_of_top_line){
			last_of_top_line = top_line
		}
		for(let ball of last_of_top_line.all_balls){
			if(!ball.isMarkedSameColorClear && ball.IsValid()){
				this._search_connected_balls(ball)
			}
		}

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

		let connected_balls:Array<Ball> = this._find_connected_balls(sourceBall)
		for(let ball of connected_balls){
			this._search_connected_balls(ball)
		}
	}

	private _find_connected_balls(sourceBall:Ball):Array<Ball>
	{
		let ret:Array<Ball> = []
		//left
		let ball = this._get_ball_in_ball_line(sourceBall.ball_line, sourceBall.index_in_line - 2)
		if(ball){
			ret.push(ball)
		}
		//right
		ball = this._get_ball_in_ball_line(sourceBall.ball_line, sourceBall.index_in_line + 2)
		if(ball){
			ret.push(ball)
		}

		//left down right down
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		let cur_line_index = game_logic_component.all_lines.indexOf(sourceBall.ball_line)
		let next_line_index = cur_line_index - 1
		let next_line = game_logic_component.all_lines[next_line_index]
		if(next_line){
			ball = this._get_ball_in_ball_line(next_line, sourceBall.index_in_line - 1)
			if(ball){
				ret.push(ball)
			}

			ball = this._get_ball_in_ball_line(next_line, sourceBall.index_in_line + 1)
			if(ball){
				ret.push(ball)
			}
		}

		//left top right top
		let last_line_index = cur_line_index + 1
		let last_line = game_logic_component.all_lines[last_line_index]
		if(last_line && last_line.isVisible){
			ball = this._get_ball_in_ball_line(last_line, sourceBall.index_in_line - 1)
			if(ball){
				ret.push(ball)
			}

			ball = this._get_ball_in_ball_line(last_line, sourceBall.index_in_line + 1)
			if(ball){
				ret.push(ball)
			}
		}
		return ret
	}


	private _search_linked_same_color_balls():void
	{
		let new_step_array = []
		let thisStepBalls:Array<Ball> = this._all_linked_same_color_balls[this._all_linked_same_color_balls.length - 1] || []
		for(let index = 0; index < thisStepBalls.length; index++)
		{
			let ball:Ball = thisStepBalls[index]
			let linkedBalls = this._search_linked_same_color_balls_by_ball(ball)
			new_step_array = new_step_array.concat(linkedBalls)
		}
		if(new_step_array.length > 0)
		{
			this._all_linked_same_color_balls.push(new_step_array)
			this._search_linked_same_color_balls()
		}
	}

	private do_clear_effect():void
	{
		for(let index1 = 0; index1 < this._all_linked_same_color_balls.length; index1++)
		{
			let temp_array:Array<Ball> = this._all_linked_same_color_balls[index1]
			for(let index2 = 0; index2 < temp_array.length; index2++)
			{
				let ball = temp_array[index2]
				ball.PlayBoomAnimation(0.05 * 1000 * index1)
			}
		} 
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		for(let index1 = 0; index1 < this._all_not_connected_balls.length; index1++)
		{
			let ball:Ball = this._all_not_connected_balls[index1]
			let line_index = game_logic_component.all_lines.indexOf(ball.ball_line)
			ball.PlayMoveDownAnimation()
		}
		this._clear_all_data()
	}

	private _clear_all_balls_state():void
	{
		//fix bug：这里最好对所有的行进行重置。
		//之前判断了行是否在可视范围，但是在搜索连接的球时用的是顶行的上一行，这行会设置isRootConnected为true。
		//如果这里只对可视行进行重置，那么上次搜索用到的顶行的上一行数据将不能进行重置。
		//这里为了方便，就最好对所有行重置
		let game_logic_component = this._mainPanel.GetGameLogicComponent()
		for(let index = 0; index < game_logic_component.all_lines.length; index ++)
		{
			let cur_line = game_logic_component.all_lines[index]
			for(let ball_index = 0; ball_index < cur_line.all_balls.length; ball_index++)
			{
				let ball = cur_line.all_balls[ball_index]
				if(ball.IsValid()){
					ball.isMarkedSameColorClear = false
					ball.isRootConnected = false
				}
			}
		}
	}

	private _search_linked_same_color_balls_by_ball(sourceBall:Ball):Array<Ball>
	{
		if(sourceBall.isMarkedSameColorClear){
			return []
		}
		sourceBall.isMarkedSameColorClear = true
		let ret:Array<Ball> = []
		let connected_balls = this._find_connected_balls(sourceBall)
		for(let ball of connected_balls){
			if(ball.ball_type == sourceBall.ball_type && this._has_insert_balls.indexOf(ball) == -1){
				ret.push(ball)
				this._has_insert_balls.push(ball)
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