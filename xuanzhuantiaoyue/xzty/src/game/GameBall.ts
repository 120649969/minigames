class GameBall extends eui.Component{

	public ballSkin:egret.Bitmap
	public label_index:eui.Label
	public img_ball:eui.Image
	public static BALL_NUMBER:number = 0

	public constructor() {
		super()
		this.skinName = "BallSkin"

		GameBall.BALL_NUMBER += 1

		let ballSkinIndex = Math.ceil(Math.random() * GameConst.BALL_SKIN_COUNT)
		this.img_ball.source = 'xingqiu' + ballSkinIndex + "_png"
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)

		this.label_index.text = GameBall.BALL_NUMBER.toString()

		let random_scale = GameConst.MIN_BALL_SCALE + (GameConst.MAX_BALL_SCALE - GameConst.MIN_BALL_SCALE) * Math.random()
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		if(allBalls.length > 0){
			let max_scale_limit_by_last_ball = GameConst.BALL_TOTAL_SCALE_IN_TWO_BALLS - allBalls[allBalls.length - 1].scaleX
			this.scaleX = this.scaleY = Math.min(max_scale_limit_by_last_ball, random_scale)
		}else{
			this.scaleX = this.scaleY = random_scale
		}
		let rotate_time = 1 * 1000
		if(CommonUtils.GetRandomPositive() > 0){
			egret.Tween.get(this, {loop:true}).to({rotation:-180}, rotate_time).to({rotation:-360}, rotate_time)
		}else{
			egret.Tween.get(this, {loop:true}).to({rotation:180}, rotate_time).to({rotation:360}, rotate_time)
		}
	}

	public GetWidth():number
	{
		return this.width * this.scaleX
	}

	public GetGlobalWidth():number
	{
		return this.GetWidth() * GameController.instance.GetMainScenePanel().battleContainer.scaleX
	}
}