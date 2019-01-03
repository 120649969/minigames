class GameVerticalLineTrack extends BaseGameTrack{
	public hit_rect:eui.Rect
	public constructor(customParent:egret.DisplayObjectContainer = null) {
		super(customParent)
		this.skinName = "TrakeVerticalLineSkin"
		this.trackType = TrackType.VerticalLine
	}

	public InitWithLastTrack(last_track:BaseGameTrack):void
	{
		if(last_track == null){
			this.initWithLastEmpty()
			return
		}
		if(last_track.trackType == TrackType.Arc){
			this.initWithLastArc(last_track)
		}else if(last_track.trackType == TrackType.ThreeArc){
			this.initWithThreeArcTrack(last_track)
		}
	}

	private initWithLastEmpty():void
	{
		this.toDirection = TrackDirection.Top
		this.fromDirection = TrackDirection.Down
	}

	private initWithLastArc(last_track:BaseGameTrack):void
	{
		this.toDirection = last_track.toDirection
		if(last_track.fromDirection == TrackDirection.Left && last_track.toDirection == TrackDirection.Top){
			this.x = last_track.x + (last_track.width - this.width)
			this.y = last_track.y - this.height
			this.fromDirection = TrackDirection.Down
		}else if(last_track.fromDirection == TrackDirection.Left && last_track.toDirection == TrackDirection.Down){
			this.x = last_track.x + (last_track.width - this.width)
			this.y = last_track.y + last_track.height
			this.fromDirection = TrackDirection.Top
		}else if(last_track.fromDirection == TrackDirection.Right && last_track.toDirection == TrackDirection.Top){
			this.x = last_track.x
			this.y = last_track.y - this.height
			this.fromDirection = TrackDirection.Down
		}else if(last_track.fromDirection == TrackDirection.Right && last_track.toDirection == TrackDirection.Down){
			this.x = last_track.x
			this.y = last_track.y + last_track.height
			this.fromDirection = TrackDirection.Top
		}
	}

	public GetDeltaY():number
	{
		if(this.toDirection == TrackDirection.Top){
			return this.height * -1
		}else if(this.toDirection == TrackDirection.Down){
			return this.height
		}
		return 0
	}

	private initWithThreeArcTrack(last_track:BaseGameTrack):void
	{
		this.toDirection = last_track.toDirection
		if(this.toDirection == TrackDirection.Top){
			this.fromDirection = TrackDirection.Down
		}else if(this.toDirection == TrackDirection.Down){
			this.fromDirection = TrackDirection.Top
		}

		if(last_track.fromDirection == TrackDirection.Left){
			if(this.toDirection == TrackDirection.Top){
				this.x = last_track.x
				this.y = last_track.y + last_track.height /2 - this.height
			}else{
				this.x = last_track.x
				this.y = last_track.y + last_track.height / 2
			}
		}else if(last_track.fromDirection == TrackDirection.Right){
			if(this.toDirection == TrackDirection.Top){
				this.x = last_track.x + last_track.width - this.width
				this.y = last_track.y + last_track.height / 2 - this.height
			}else{
				this.x = last_track.x + last_track.width - this.width
				this.y = last_track.y + last_track.height / 2
			}
		}
	}

	public CopySelf():BaseGameTrack
	{
		let new_track = new GameVerticalLineTrack(GameController.instance.GetMainScenePanel().copyContainer)
		new_track.x = this.x
		new_track.y = this.y
		return new_track
	}
}