enum BALL_TYPE{
	TYPE_1 = 1,  //绿
	TYPE_2 = 2,	//紫
	TYPE_3 = 3,	//蓝
	TYPE_4 = 4,	//红
	TYPE_EMPTY = 5, //清空
	MAX_TYPE = 5
}

class GameConst {
	public static LINE_COUNT:number = 5
	public static LINE_BALL_COUNT:number = 19
	public static LINE_LONG_BALL_COUNT:number = 10

	public static MIN_KEPP_LINE_COUNT:number = 15
	public static GENERATE_STEP_LINE_COUNT:number = 5

	public static quick_ball_speed:number = 25
	public static slow_ball_speed:number = 0.2
	public static normal_ball_speed:number = 0.1

	public static MY_BALL_SPEED:number = 60

	public static MIN_DEGREE:number = 20
	public static MAX_DEGREE:number = 160

	public static Generate10LineConfig(type:BALL_TYPE = BALL_TYPE.TYPE_EMPTY):Array<number>
	{
		let ret:Array<number> = []
		for(let index = 0; index < GameConst.LINE_LONG_BALL_COUNT; index++)
		{
			ret.push(type)
		}
		return ret
	}

	public static Generat9LineConfig(type:BALL_TYPE = BALL_TYPE.TYPE_EMPTY):Array<number>
	{
		let ret:Array<number> = []
		for(let index = 0; index < GameConst.LINE_BALL_COUNT - GameConst.LINE_LONG_BALL_COUNT; index++)
		{
			ret.push(type)
		}
		return ret
	}
}