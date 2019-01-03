class GameHeorizontalLineTrack extends BaseGameTrack{

	public hit_rect:eui.Rect
	public constructor(customParent:egret.DisplayObjectContainer = null) {
		super(customParent)
		this.skinName = "TrakeHeorizontalLineSkin"
		this.trackType = TrackType.HeorizontalLine
	}

	public InitWithLastTrack(last_track:BaseGameTrack):void
	{
		if(last_track.trackType == TrackType.Arc){
			this.initWithLastArc(last_track)
		}else if(last_track.trackType == TrackType.ThreeArc){
			this.initWithThreeArcTrack(last_track)
		}
	}

	private initWithLastArc(last_track:BaseGameTrack):void
	{
		this.toDirection = last_track.toDirection
		if(last_track.fromDirection == TrackDirection.Top && last_track.toDirection == TrackDirection.Left){
			this.x = last_track.x - this.width
			this.y = last_track.y + (last_track.height - this.height)
			this.fromDirection = TrackDirection.Right
		}else if(last_track.fromDirection == TrackDirection.Top && last_track.toDirection == TrackDirection.Right){
			this.x = last_track.x + last_track.width
			this.y = last_track.y + (last_track.height - this.height)
			this.fromDirection = TrackDirection.Left
		}else if(last_track.fromDirection == TrackDirection.Down && last_track.toDirection == TrackDirection.Left){
			this.x = last_track.x - this.width
			this.y = last_track.y
			this.fromDirection = TrackDirection.Right
		}else if(last_track.fromDirection == TrackDirection.Down && last_track.toDirection == TrackDirection.Right){
			this.x = last_track.x + last_track.width
			this.y = last_track.y
			this.fromDirection = TrackDirection.Left
		}
	}

	public GetDeltaX():number
	{
		if(this.toDirection == TrackDirection.Left){
			return this.width * -1
		}else if(this.toDirection == TrackDirection.Right){
			return this.width
		}
		return 0
	}

	private initWithThreeArcTrack(last_track:BaseGameTrack):void
	{
		this.toDirection = last_track.toDirection
		if(this.toDirection == TrackDirection.Left){
			this.fromDirection = TrackDirection.Right
		}else if(this.toDirection == TrackDirection.Right){
			this.fromDirection = TrackDirection.Left
		}

		if(last_track.fromDirection == TrackDirection.Top){
			if(this.toDirection == TrackDirection.Left){
				this.x = last_track.x + last_track.width / 2 - this.width
				this.y = last_track.y
			}else{
				this.x = last_track.x + last_track.width / 2
				this.y = last_track.y
			}
		}else if(last_track.fromDirection == TrackDirection.Down){
			if(this.toDirection == TrackDirection.Left){
				this.x = last_track.x + last_track.width / 2 - this.width
				this.y = last_track.y + last_track.height - this.height
			}else{
				this.x = last_track.x + last_track.width / 2
				this.y = last_track.y + last_track.height - this.height
			}
		}
	}

	public CopySelf():BaseGameTrack
	{
		let new_track = new GameHeorizontalLineTrack(GameController.instance.GetMainScenePanel().copyContainer)
		new_track.x = this.x
		new_track.y = this.y
		return new_track
	}
}