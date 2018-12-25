class GameConst {
	public constructor() {
	}

	public static CIRCLE_COUNT:number = 3
	public static BOARD_ITEM_IN_LINE:number = 3
	public static MAX_LINE_COUNT:number = 3
	public static MAX_BOARD_ITEM_COUNT:number = GameConst.BOARD_ITEM_IN_LINE * GameConst.MAX_LINE_COUNT
}

enum ShapeTypes {
	TYPE_NONE 	= 0,
	TYPE_1 		= 1, //紫色
	TYPE_2		= 2, //黄色
	TYPE_3 		= 3, //绿色
	TYPE_4 		= 4,
	TYPE_5 		= 5,
	TYPE_6 		= 6,
	TYPE_MAX 	= 6
}