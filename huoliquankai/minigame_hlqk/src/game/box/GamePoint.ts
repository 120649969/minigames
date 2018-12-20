class GamePoint extends egret.DisplayObjectContainer{

	public all_lines:Array<BaseGameBoxLine> = []

	public constructor() {
		super()
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
}