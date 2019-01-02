class GameHandle extends eui.Component{

	private _startPoint:egret.Point
	private _endPoint:egret.Point

	public constructor() {
		super()
		this.skinName = "GameHandleSkin"
		this.anchorOffsetX = 0
		this.anchorOffsetY = this.height / 2
	}

	public SetPoint(startPoint:egret.Point, endPoint:egret.Point):void
	{
		this._startPoint = startPoint
		this._endPoint = endPoint
		this.x = this._startPoint.x
		this.y = this._startPoint.y

		let distance = CommonUtils.GetDistance(startPoint, endPoint)
		this.width = distance

		if(this._startPoint.x == this._endPoint.x){
			if(this._startPoint.y > this._endPoint.y){
				this.rotation = -90
			}else{
				this.rotation = 90
			}
		}else{
			let tan_value = (this._endPoint.y - this._startPoint.y) / (this._endPoint.x - this._startPoint.x)
			let degree = Math.atan(tan_value) / Math.PI * 180
			if(this._endPoint.x < this._startPoint.x){
				degree += 180
			}
			this.rotation = degree
		}
	}

}