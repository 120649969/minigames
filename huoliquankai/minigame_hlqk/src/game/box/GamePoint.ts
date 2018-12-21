class GamePoint extends egret.DisplayObjectContainer{

	public all_lines:Array<BaseGameBoxLine> = []

	public constructor() {
		super()
		GameController.instance.GetMainScenePanel().prop_container.addChild(this)
	}

	public Show(line_count:number):void
	{
		this.all_lines = []
		let total_line_height = 0
		let line_height = 0
		for(let index = 0; index < line_count; index++)
		{
			let is_line_4 = Math.random() < 0.5
			let new_line:BaseGameBoxLine = null
			if(is_line_4){
				new_line = new GameBox4Line()
			}else{
				new_line = new GameBox3Line()
			}
			this.addChild(new_line)
			line_height = new_line.height
			this.all_lines.push(new_line)
			new_line.point_line = this
			new_line.is_valid = true
		}
		total_line_height = line_height + (line_count - 1) * (line_height - 10)

		let top_y = -1 * total_line_height / 2
		for(let index = 0; index < this.all_lines.length; index++)
		{
			let line = this.all_lines[index]
			line.y = top_y
			top_y += (line_height - 20)
		}
	}

	public RemoveGameLine(game_line:BaseGameBoxLine):void
	{
		game_line.visible = false
		game_line.is_valid = false
	}

	public GetButtomValidGameLine():BaseGameBoxLine
	{
		for(let index = this.all_lines.length; index--; index >= 0)
		{
			let line = this.all_lines[index]
			if(line.is_valid)
			{
				return line
			}
		}
		return null
	}
}