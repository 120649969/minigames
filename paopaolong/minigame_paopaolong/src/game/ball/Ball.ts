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

		CommonUtils.Add_Btn_Click(this.img_ball, function(){
			GameController.instance.GetMainScenePanel().GetGameLogicComponent().TestFindBall(__this)
		}, this)
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

	public MoveDown222():void
	{
		this.ball_type = BALL_TYPE.TYPE_EMPTY
		let __this = this
		egret.Tween.get(this).to({y:this.y + 200}, 2 * 1000).call(function(){
			__this.SetBallType(BALL_TYPE.TYPE_EMPTY)
		})
	}
}