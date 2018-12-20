class GameLogicComponent extends BaseComponent{
	
	public all_point_lines:Array<GamePoint> = []

	public constructor() {
		super()
	}

	private _try_generate_new_point_line():void
	{
		let cur_y = Const.MIN_HEIGHT
		if(this.all_point_lines.length < 5)
		{
			let is_two = Math.random() < 0.3
			let line_count = 1
			if(is_two){
				line_count = 2
			}
			if(this.all_point_lines.length > 0){
				cur_y = this.all_point_lines[this.all_point_lines.length - 1].y
			}
			let new_point = new GamePoint()
			new_point.Show(line_count)
			this.all_point_lines.push(new_point)
			new_point.y = cur_y
		}
	}

	public OnEnterFrame():void
	{
		
	}
}