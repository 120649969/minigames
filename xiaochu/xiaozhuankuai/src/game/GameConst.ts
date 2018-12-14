enum GAME_BOX_LINE_TYPE{
	NORMAL,
	HARD
}

class GameConst {
	public static INIT_BOX_COUNT = 3
	public static MAX_BOX_COUNT = 4
	public static LINE_MOVE_SPEED = 6
	public static NORMAL_BOX_LINE_COUNT:number = 20

	public static MY_MOVE_SPEED = -140

	public static HARD_RATE = 0.1
	public static type_2_lift:Object = {
		[GAME_BOX_LINE_TYPE.NORMAL] : 	1,
		[GAME_BOX_LINE_TYPE.HARD]:		2
	}

	public static GAME_TIME:number = 10000000
}

