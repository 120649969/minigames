class GameConst {
	public constructor() {
	}

	//横着的直线概率比
	public static Next_Track_Info_For_Herorizontal = [[1, TrackType.Arc], [0.3, TrackType.ThreeArc]]

	//竖着的直线概率比
	public static Next_Track_Info_For_Vertical = [[1, TrackType.Arc], [0.3, TrackType.ThreeArc]]

	public static Track_Type_2_Next_Track_Infos = {
		[TrackType.HeorizontalLine]:GameConst.Next_Track_Info_For_Herorizontal,
		[TrackType.VerticalLine]:GameConst.Next_Track_Info_For_Vertical
	}

	// public static MIN_LINE_COUNT:number = 10
	// public static MAX_LINE_COUNT:number = 20
	public static MIN_LINE_COUNT:number = 3
	public static MAX_LINE_COUNT:number = 10

	public static Car_Move_Speed:number = 25
	public static Step_Rotate_Degree:number = 4.5
}