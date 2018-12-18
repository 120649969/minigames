class Ball extends eui.Component{

	public img_ball:eui.Image
	public mask:eui.Rect
	public ball_type:number = BALL_TYPE.TYPE_EMPTY
	public ball_line:BallLine
	public index_in_line:number

	public isMarkedSameColorClear:boolean = false  //标记为被清除，和初始碰撞的球连接
	public isRootConnected:boolean = false //标记为和根节点相连接

	public constructor() {
		super()
		this.skinName = "BallSkin"

		let __this = this
	}

	public SetBallType(ball_type:BALL_TYPE):void
	{
		this.ball_type = ball_type
		if(ball_type == BALL_TYPE.TYPE_EMPTY){
			this.img_ball.alpha = 0
		}else{
			this.img_ball.alpha = 1
			this.img_ball.source = "ball" + ball_type + "_png"
		}
	}

	public IsValid():boolean
	{
		return this.ball_type != BALL_TYPE.TYPE_EMPTY
	}

	public PlayMoveDownAnimation():void
	{
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().AddMoveDownBalls(this)
		this.SetBallType(BALL_TYPE.TYPE_EMPTY)
	}

	public PlayBoomAnimation(delay_time:number):void
	{
		this.ball_type = BALL_TYPE.TYPE_EMPTY
		let __this = this
		CommonUtils.performDelay(function(){
			__this.SetBallType(BALL_TYPE.TYPE_EMPTY)
		}, delay_time, this)
		SoundManager.getInstance().playSound("ball_broken_mp3")
	}
}