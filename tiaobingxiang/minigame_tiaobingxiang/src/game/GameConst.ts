class GameConst {
	public constructor() {
	}

	public static M_BG_NUM = 3;
	public static MAX_BOX_COUNT = 5
	public static HIT_NUM = 1

	public static GRAVITY:number = 5
	public static TOTAL_TIME = 30

	public static PLAYER_MOVE_SPEED_INIT_Y = -42
	public static PLAYER_MOVE_SPEED_INIT_X = 30
	public static BOX_MOVE_SPEED_X:number = 18

	public static BOX_HEIGHT:number = 139

	public static GAME_TIME:number = 60

	public static MIN_COMBOX_DELTA_X = 5
	public static MAX_COMBOX_DELTA_X = 40
}

enum GameScore{
	SCORE_1 = 1,
	SCORE_2 = 2
}