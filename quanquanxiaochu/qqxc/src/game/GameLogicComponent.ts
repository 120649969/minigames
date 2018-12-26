class GameLogicComponent extends BaseComponent{

	public currentDragGameCircle:GameCircle = null
	public allBoardItems:Array<GameBoardItem>
	public currentValidGameCircles:Array<GameCircle>
	public currentColors:Array<ShapeTypes> = []

	public constructor() {
		super()
		this.currentValidGameCircles = []
		this.allBoardItems = GameController.instance.GetMainScenePanel().allGameBoardItems
	}


	public OnStart():void
	{
		this.GenerateNextRoundCirlces()
	}


	public StartDragGameCircle(gameCircle:GameCircle):void
	{
		this.currentDragGameCircle = gameCircle
	}

	public UpdateDragGameCircle(gameCircle:GameCircle, x:number, y:number):void
	{
		if(!this.currentDragGameCircle){
			return
		}
		if(this.currentDragGameCircle != gameCircle){
			this.currentDragGameCircle.MoveBack()
			this.currentDragGameCircle = gameCircle
		}
		let local_in_circle_parent = gameCircle.parent.globalToLocal(x, y)
		// gameCircle.x = local_in_circle_parent.x
		// gameCircle.y = local_in_circle_parent.y
		gameCircle.UpdateTouchPosition(local_in_circle_parent.x,local_in_circle_parent.y)
	}

	public StopDragGameCircle(gameCircle:GameCircle):void
	{
		let is_success = false
		let success_board_item:GameBoardItem = null
		let is_hit_board_item = false
		for(let boardItem of this.allBoardItems)
		{
			if(boardItem.CheckHitMoveCircle(gameCircle))
			{
				is_hit_board_item = true
				if(boardItem.CanPutInCircle(gameCircle)){
					is_success = true
					boardItem.PutInCircle(gameCircle)
					success_board_item = boardItem
				}else{
					gameCircle.MoveBack()
				}
				break
			}
		}

		if(!is_hit_board_item){
			gameCircle.MoveBack()
		}

		if(!is_success){
			SoundManager.getInstance().playSound("not_size_mp3")
		}else{
			SoundManager.getInstance().playSound("put_down_mp3")
		}
		
		if(is_success && success_board_item)
		{
			let board_index = this.allBoardItems.indexOf(success_board_item)
			let row = Math.floor(board_index / GameConst.BOARD_ITEM_IN_LINE)
			let col = board_index %  GameConst.BOARD_ITEM_IN_LINE

			//横向
			let start_line_index = row * GameConst.BOARD_ITEM_IN_LINE
			let end_line_index = start_line_index + GameConst.BOARD_ITEM_IN_LINE - 1
			let same_color_indexs_row = []
			let same_color_indexs_col = []
			for(let type of gameCircle.shapeTyps)
			{
				if(type != ShapeTypes.TYPE_NONE){
					same_color_indexs_row.push(type)
					same_color_indexs_col.push(type)
				}
			}
			let row_items:Array<GameBoardItem> = []
			for(let index = start_line_index; index <= end_line_index; index++)
			{
				let board_item = this.allBoardItems[index]
				row_items.push(board_item)
				for(let index = same_color_indexs_row.length - 1; index >= 0; index--)
				{
					let same_color = same_color_indexs_row[index]
					if(!board_item.IsContain(same_color))
					{
						same_color_indexs_row.splice(index, 1)
					}
				}
			}

			//纵向
			start_line_index = col
			end_line_index = start_line_index + (GameConst.MAX_LINE_COUNT - 1) * GameConst.BOARD_ITEM_IN_LINE

			let col_items:Array<GameBoardItem> = []
			for(let index = start_line_index; index <= end_line_index; index += GameConst.BOARD_ITEM_IN_LINE)
			{
				let board_item = this.allBoardItems[index]
				col_items.push(board_item)
				for(let index = same_color_indexs_col.length - 1; index >= 0; index--)
				{
					let same_color = same_color_indexs_col[index]
					if(!board_item.IsContain(same_color))
					{
						same_color_indexs_col.splice(index, 1)
					}
				}
			}

			let is_clear = false
			let clear_count = 0
			let total_colors = []
			if(same_color_indexs_row.length > 0)
			{
				clear_count += this.ClearRow(row, same_color_indexs_row, row_items)
				is_clear = true
				total_colors = total_colors.concat(same_color_indexs_row)
			}

			if(same_color_indexs_col.length > 0)
			{
				clear_count += this.ClearCol(col, same_color_indexs_col, col_items)
				is_clear = true
				for(let color of same_color_indexs_col)
				{
					if(total_colors.indexOf(color) < 0)
					{
						total_colors.push(color)
					}
				}
			}

			this.RemoveValidCircle(gameCircle)

			if(is_clear)
			{
				this.calcCurrentColors()
				this.UpdateCurrentColors()
				SoundManager.getInstance().playSound("clear_mp3")

				let add_score = clear_count * GameConst.CIRCLE_SOCRE

				if(total_colors.length == 2){
					add_score += GameConst.TWO_COLOR_SCORE
				}else if(total_colors.length > 2){
					add_score += GameConst.THREE_COLOR_SCORE
				}

				GameController.instance.serverModel.myRole.score += add_score
				GameController.instance.GetMainScenePanel().ShowScoreAnimation(add_score)
				GameController.instance.GetMainScenePanel().UpdateScore()
				GameNet.reqChangeScore(add_score)
			}
			if(this.currentValidGameCircles.length <= 0){
				this.GenerateNextRoundCirlces()
			}
			if(!this.CheckCurrentCirclesValid())
			{
				this.AutoResetBoard()
			}
		}
		this.currentDragGameCircle = null
	}
	
	public ClearRow(row, colors, row_items:Array<GameBoardItem>):number
	{
		let ret = 0
		for(let color of colors)
		{
			if(color != ShapeTypes.TYPE_NONE)
			{
				for(let board_item of row_items)
				{
					ret += board_item.RemoveColor(color)
				}
			}
		}
		return ret
	}

	public ClearCol(col, colors, col_items:Array<GameBoardItem>):number
	{
		let ret = 0
		for(let color of colors)
		{
			if(color != ShapeTypes.TYPE_NONE)
			{
				for(let board_item of col_items)
				{
					ret += board_item.RemoveColor(color)
				}
			}
		}
		return ret
	}

	public calcCurrentColors():void
	{
		let colors = []
		for(let boardItem of this.allBoardItems)
		{
			for(let color of boardItem.gameCirlce.shapeTyps)
			{
				if(color != ShapeTypes.TYPE_NONE && colors.indexOf(color) < 0)
				{
					colors.push(color)
				}
			}
		}
		for(let valid_circle of this.currentValidGameCircles)
		{
			for(let color of valid_circle.shapeTyps)
			{
				if(color != ShapeTypes.TYPE_NONE && colors.indexOf(color) < 0)
				{
					colors.push(color)
				}
			}
		}
		this.currentColors = colors
	}

	public RemoveValidCircle(game_circle:GameCircle):void
	{
		let circle_index = this.currentValidGameCircles.indexOf(game_circle)
		this.currentValidGameCircles.splice(circle_index, 1)
	}


	public GenerateNextRoundCirlces():void
	{
		this.UpdateCurrentColors()
		for(let index = 0; index < GameConst.BOARD_ITEM_IN_LINE; index++)
		{
			let board_group = GameController.instance.GetMainScenePanel().init_circle_groups[index]
			let new_game_cirlce = new GameCircle()
			board_group.addChild(new_game_cirlce)
			new_game_cirlce.Show(board_group.width / 2 - new_game_cirlce.width / 2, board_group.height / 2 - new_game_cirlce.height / 2)
			this.currentValidGameCircles.push(new_game_cirlce)
		}
	}

	public CheckCurrentCirclesValid():boolean
	{
		for(let currentValidCirlce of this.currentValidGameCircles)
		{
			for(let board_item of this.allBoardItems)
			{
				if(board_item.CanPutInCircle(currentValidCirlce))
				{
					return true
				}
			}
		}
		return false
	}

	public AutoResetBoard():void
	{
		for(let game_board_item of this.allBoardItems)
		{
			game_board_item.ReSet()
		}

		SoundManager.getInstance().playSound("down_score_mp3")
		GameController.instance.serverModel.myRole.score += GameConst.CLEAR_SCORE
		GameController.instance.serverModel.myRole.score = Math.max(GameController.instance.serverModel.myRole.score, 0)
		GameNet.reqChangeScore(GameConst.CLEAR_SCORE)
		GameController.instance.GetMainScenePanel().UpdateScore()
		GameController.instance.GetMainScenePanel().ShowScoreAnimation(GameConst.CLEAR_SCORE)
	}

	public UpdateCurrentColors():void
	{
		if(this.currentColors.length >= GameConst.COLOR_COUNT){
			return
		}
		let delta_count = GameConst.COLOR_COUNT - this.currentColors.length
		let new_colors = []
		for(let index = 0; index < ShapeTypes.TYPE_MAX; index++)
		{
			let color = index + 1
			if(this.currentColors.indexOf(color) < 0){
				new_colors.push(color)
			}
		}
		for(let index = 0; index < delta_count; index++)
		{
			let color_index = Math.floor(Math.random() * new_colors.length)
			let new_color = new_colors[color_index]
			this.currentColors.push(new_color)
			new_colors.splice(color_index, 1)
		}
	}

	public RandomGetColor():ShapeTypes
	{
		let index = Math.floor(Math.random() * this.currentColors.length)
		return this.currentColors[index]
	}
}