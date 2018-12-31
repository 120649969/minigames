enum TrackType
{
	None 				= -1,
	HeorizontalLine 	= 1,
	VerticalLine		= 2,
	Arc					= 3,
	ThreeArc			= 4
}

enum TrackDirection{
	Left = 1,
	Right = 3,
	Top = 2,
	Down = 4
}


class BaseGameTrack extends eui.Component{
	public trackType:TrackType
	public fromDirection:TrackDirection
	public toDirection:TrackDirection
	public label_step:eui.BitmapLabel
	
	public constructor() {
		super()
		GameController.instance.GetMainScenePanel().mapContainer.addChild(this)
	}

	public GetTrackType():TrackType
	{
		return this.trackType
	}

	public InitWithLastTrack(last_track:BaseGameTrack):void
	{
		
	}

	public GetNextTrackType():TrackType
	{
		return TrackType.None
	}

	//相邻两个同种轨道的间隔,只有直线才需要这个值
	public GetDeltaX():number
	{
		return 0
	}

	public GetDeltaY():number
	{
		return 0
	}

	public static IsReverseDirection(direction1:TrackDirection, direction2:TrackDirection):boolean
	{
		if(Math.abs(direction1 - direction2) == 2){
			return true
		}
		return false;
	}
}
