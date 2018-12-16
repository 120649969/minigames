class BallMultiLine extends eui.Component{

	public all_lines:Array<BallLine> = []
	public multiLineConfig:MultiLineConfig

	public constructor() {
		super()
		this.skinName = "BallMultiLineSkin"
		this._createLines()
	}

	private _createLines():void
	{
		for(let index = 0; index < GameConst.LINE_COUNT; index++)
		{
			let line = new BallLine()
			let circle_width = line.height
			this.addChild(line)
			line.y = line.height / 2 + (circle_width * Math.sin(60 / 180 * Math.PI)) * index - circle_width / 2
			this.all_lines.push(line)
		}
	}

	public UpdateConfig(multiConfig:MultiLineConfig):void
	{
		this.multiLineConfig = multiConfig
		for(let index = 0; index < multiConfig.all_line_config.length; index++)
		{
			let line_config = multiConfig.all_line_config[index]
			let line_ball = this.all_lines[index]
			line_ball.UpdateConfig(line_config as Array<number>)
		}
	}

	public ChangeTopDownLong(new_top_down_long):void
	{
		for(let index = 0; index < GameConst.LINE_COUNT; index++)
		{
			let line = this.all_lines[index]
			let circle_width = line.height
			line.y = line.height / 2 + (circle_width * Math.sin(60 / 180 * Math.PI)) * index - circle_width / 2
		}
	}

	public ExportJson():Object
	{
		let ret = []
		for(let index = 0; index < this.all_lines.length;  index++)
		{
			let line = this.all_lines[index]
			let line_ret = line.ExportJson()
			ret.push(line_ret)
		}
		return ret
	}

	public LoadJson(data:Array<Object>):void
	{
		for(let index = 0; index < this.all_lines.length;  index++)
		{
			let line = this.all_lines[index]
			line.LoadJson(data[index] as Array<number>)
		}
	}
}