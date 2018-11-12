class HitConst {
	public static floor_restitution = -0.7; //地面反弹系数，反弹会改变方向，所以要改成负数
	public static floor_friction = 1.0; //地面摩擦系数

	public static basket_right_line_restitution = -0.5; //篮筐前沿反弹系数
	public static basket_right_line_friction = 1.0 //篮筐前沿摩擦系数

	public static basket_left_line_restitution = -0.5; //篮筐后沿反弹系数
	public static basket_left_line_friction = 1.0 //篮筐后沿摩擦系数 

	public static basket_board_restitution = -0.26; //篮框后方挡板反弹系数
	public static basket_board_friction = 1.0 //篮框后方挡板摩擦系数 

	public static basket_board_top_down_restitution = -0.7 //篮框顶部挡板反弹系数

	public static Factor:number = 8 //米和像素的转换单位
	public static Gravity:number = 9.8 //重力加速度
	public static Max_Speed_X:number = 6 * HitConst.Factor; //x方向的速度
	public static MIN_SPEED_Y:number = -20 * HitConst.Factor  //y在负方向最小的速度
	public static PUSH_DOWN_IMPLUSE_Y:number = -20 * HitConst.Factor //按下y方向的瞬时加速度
	// public static Frame_Speed_X:number = 4  //每帧影响x方向速度的风速
	public static Frame_Speed_X:number = 0 * HitConst.Factor  //每帧影响x方向速度的风速
	
	public static BACK_Gravity = HitConst.Gravity;
	public static BACK_Max_Speed_X = HitConst.Max_Speed_X;
	public static BACK_MIN_SPEED_Y = HitConst.MIN_SPEED_Y;
	public static BACK_PUSH_DOWN_IMPLUSE_Y = HitConst.PUSH_DOWN_IMPLUSE_Y;
	public static BACK_Frame_Speed_X = HitConst.Frame_Speed_X;
	public static BACK_floor_restitution = HitConst.floor_restitution
	public static BACK_basket_right_line_restitution = HitConst.basket_right_line_restitution
	public static BACK_basket_left_line_restitution = HitConst.basket_left_line_restitution
	public static BACK_basket_board_restitution = HitConst.basket_board_restitution

	public static MIN_WIDTH = 1280;//1136;
	public static MIN_HEIGHT = 720;//640;
	public static MIN_RESOLUTION = 720;//640;

	public static getHitRestitution(hitType:HitType):number
	{
		if(hitType == HitType.Floor)
		{
			return HitConst.floor_restitution
		}

		if(hitType == HitType.Right_Line)
		{
			return HitConst.basket_right_line_restitution
		}

		if(hitType == HitType.Left_Line)
		{
			return HitConst.basket_left_line_restitution
		}

		if(hitType == HitType.Board)
		{
			return HitConst.basket_board_restitution
		}

		if(hitType == HitType.Board_Top){
			return HitConst.basket_board_top_down_restitution
		}

		if(hitType == HitType.Board_Left_Right){
			return HitConst.basket_board_restitution
		}

		return 1
	}

	public static getHitFriction(hitType:HitType):number
	{
		if(hitType == HitType.Floor)
		{
			return HitConst.floor_friction
		}

		if(hitType == HitType.Right_Line)
		{
			return HitConst.basket_right_line_friction
		}

		if(hitType == HitType.Left_Line)
		{
			return HitConst.basket_left_line_friction
		}

		if(hitType == HitType.Board)
		{
			return HitConst.basket_board_friction
		}

		if(hitType == HitType.Board_Top){
			return HitConst.basket_board_friction
		}

		if(hitType == HitType.Board_Left_Right){
			return HitConst.basket_board_friction
		}

		return 1.0
	}
	
	public static SwapPoint(point1:egret.Point, point2:egret.Point):void
	{
		let temp_point_x = point1.x;
		let temp_point_y = point1.y;
		point1.x = point2.x;
		point1.y = point2.y
		point2.x = temp_point_x
		point2.y = temp_point_y;
	}

	public static SwapPointXY(left_top_point:egret.Point, right_down:egret.Point):void
	{
		let left_x = right_down.x;
		let left_y = left_top_point.y;
		let right_x = left_top_point.x;
		let right_y = right_down.y

		left_top_point.x = left_x
		left_top_point.y = left_y

		right_down.x = right_x
		right_down.y = right_y
	}
}


enum HitType {
	Floor,
	Right_Line, //篮筐前沿
	Left_Line, //篮筐后沿
	Board, //后方的篮板
	Board_Left_Right,
	Board_Top, 
	None
}

enum HitNetType {
	LEFT,
	CENTER,
	RIGHT,
	NONE
}


enum BasketScore{
	NORMAL_GOAL = 2,
	KONG_XING_GOAL = 3
}

enum AfterImageType{
	Smoke,
	Fire,
	None
}

enum FireStep{
	Step_1,  //小火
	Step_2	//大火
}