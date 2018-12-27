class GameConst {
	public constructor() {
	}

	//维持有5个球
	public static MIN_BALL_COUNT:number = 5

	//球的皮肤数量
	public static BALL_SKIN_COUNT:number = 6

	//球的缩放范围
	public static MIN_BALL_SCALE:number = 0.5
	public static MAX_BALL_SCALE:number = 1.1

	//相邻两个球的缩放和的限制
	public static BALL_TOTAL_SCALE_IN_TWO_BALLS:number = 1.6

	//两个球之间的距离范围
	public static MIN_BALL_DISTANCE_X:number = 300
	public static MAX_BALL_DISTANCE_X:number = 600

	//球离边界的距离
	public static DISTANCE_OF_BOUNDARY:number = 40

	//重力加速度
	public static Gravity:number = 3

	public static PLAYER_SPEED:number = 35

	public static BG_NUM:number = 3

}