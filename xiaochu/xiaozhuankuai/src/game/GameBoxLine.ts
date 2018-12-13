class GameBoxLine extends egret.DisplayObjectContainer{

	public boxes:Array<GameBox> = []
	private mainScenePanel:ui.MainScenePanel
	public type:GAME_BOX_LINE_TYPE
	public life:number = 1
	public idle_positions:Array<number> = []
	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.mainScenePanel = mainPanel
		this.mainScenePanel.box_line_container.addChild(this)
	}

	public GenerateBox(type:GAME_BOX_LINE_TYPE):void
	{
		this.type = type
		this.life = GameConst.type_2_lift[type]
		let index_array = [0, 1, 2, 3]
		for(let index = 0; index < GameConst.MAX_BOX_COUNT; index++)
		{
			
			let new_box = new GameBox(this.type)
			new_box.x = (index +  0.5) / GameConst.MAX_BOX_COUNT * this.mainScenePanel.width
			this.boxes.push(new_box)
			new_box.position = index
			this.addChild(new_box)
			this.height = new_box.height
		}
		let random_index = Math.floor((Math.random() * index_array.length))
		this.idle_positions.push(index_array[random_index])
		this.boxes[random_index].visible = false
	}

	public GenerateSingleBox(type:GAME_BOX_LINE_TYPE, position:number):void
	{
		this.type = type
		this.life = GameConst.type_2_lift[type]
		let index_array = [0, 1, 2, 3]
		for(let index = 0; index < GameConst.MAX_BOX_COUNT; index++)
		{
			
			let new_box = new GameBox(this.type)
			new_box.x = (index +  0.5) / GameConst.MAX_BOX_COUNT * this.mainScenePanel.width
			this.boxes.push(new_box)
			new_box.position = index
			this.addChild(new_box)
			this.height = new_box.height
			new_box.visible = false
		}
		let random_index = index_array.indexOf(position)
		index_array.splice(random_index, 1)
		this.idle_positions = index_array
		this.boxes[random_index].visible = true
	}

	public resizeStage():void
	{
		for(let index = 0; index < this.boxes.length; index ++)
		{
			let box = this.boxes[index]
			box.x = (box.position +  0.5) / GameConst.MAX_BOX_COUNT * this.mainScenePanel.width
		}
	}

	public Move():void
	{
		this.y += GameConst.LINE_MOVE_SPEED
	}

	public InsertBox(position):void
	{
		if(this.life > 1) {
			this.life -= 1 //困难模式的块 生命值-1
			for(let index = 0; index < this.boxes.length; index++)
			{
				let box = this.boxes[index]
				box.ChangeMiddle()
			}
		} else {
			if(this.idle_positions.length == 1 && this.idle_positions[0] == position){
				this.life -= 1
				this.idle_positions = []
				this.boxes[position].visible = true
				this.PlayHitAnimation()
			} else {
				this.boxes[position].visible = true
				let index_position = this.idle_positions.indexOf(position)
				this.idle_positions.splice(index_position, 1)
			}
		}
	}

	public PlayHitAnimation():void
	{
		this.parent.removeChild(this)
		GameBoxLineManager.instance.RemoveBoxLine(this)
	}

	public IsReachButtom():boolean
	{
		let global_point = this.localToGlobal(0, this.height / 2)
		if(global_point.y >= GameController.instance.GetMainScenePanel().height)
		{
			return true
		}
		return false
	}
}