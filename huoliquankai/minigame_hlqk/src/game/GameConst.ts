class GameConst {
	public constructor() {
	}

	public static Three_Count = 3
	public static Four_Count = 4

	public static BG_IN_SCENE:number = 3
	public static Standard_Distance:number = 1000
	public static BG_SPEED:number = 3
	public static BULLET_SPEED:number = -15

	public static SEND_TIME_INTERVAL:number = 5 //发射子弹间隔

	public static PROP_DURATION:number = 10 * 1000

	//0-10：0.2
	//10-20：0.4
	//20-30：0.3
	//30-50: 0.1
	public static Box_Scores = [1, 10, 20, 30, 50]
	public static Box_Score_Rates = [0, 0.2, 0.4, 0.3, 0.1]
}

enum GamePropType{
	SPEED = 1,
	SAN = 2,
	None = 3
}