class KnifeConst {
	public constructor() {
	}

	public static KNIFE_INIT_SPEED:number = -100 //刀的初速度
	public static KNIFE_ACCE:number = -40 //刀的加速度

	public static InValid_Config_Value:number = 100

	public static Shake_Range:number = 15

	public static MAX_BALL_COUNT:number = 4

	public static PROP_WIND:number = 1
	public static PROP_OTHER_KNIFE:number = 2
	public static PROP_DOWN_SPEED:number = 3

	public static ALL_PROPS_ARRAY:Array<number> = [KnifeConst.PROP_WIND, KnifeConst.PROP_OTHER_KNIFE, KnifeConst.PROP_DOWN_SPEED]
}