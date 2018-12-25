class GameLogicComponent extends BaseComponent{

	public currentDragGameCircle:GameCircle = null
	public allBoardItems:Array<GameBoardItem>
	public currentValidGameCircles:Array<GameCircle>

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
				same_color_indexs_row.push(type)
				same_color_indexs_col.push(type)
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

			if(same_color_indexs_row.length > 0)
			{
				this.ClearRow(row, same_color_indexs_row, row_items)
			}

			if(same_color_indexs_col.length > 0)
			{
				this.ClearCol(col, same_color_indexs_col, col_items)
			}

			this.RemoveValidCircle(gameCircle)
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
	
	public ClearRow(row, colors, row_items:Array<GameBoardItem>):void
	{
		for(let color of colors)
		{
			if(color != ShapeTypes.TYPE_NONE)
			{
				for(let board_item of row_items)
				{
					board_item.RemoveColor(color)
				}
			}
		}
	}

	public ClearCol(col, colors, col_items:Array<GameBoardItem>):void
	{
		for(let color of colors)
		{
			if(color != ShapeTypes.TYPE_NONE)
			{
				for(let board_item of col_items)
				{
					board_item.RemoveColor(color)
				}
			}
		}
	}

	public RemoveValidCircle(game_circle:GameCircle):void
	{
		let circle_index = this.currentValidGameCircles.indexOf(game_circle)
		this.currentValidGameCircles.splice(circle_index, 1)
	}


	public GenerateNextRoundCirlces():void
	{
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
	}
}