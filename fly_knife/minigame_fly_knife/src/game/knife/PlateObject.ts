class PlateObject {

	public m_plate_container:egret.DisplayObjectContainer
	private _mainPanel:MainGameScene
	private _isReady:boolean
	private _delta_degree:number = 0

	public all_knife_objects:Array<KnifeObject> = []

	public constructor(mainPanel:MainGameScene) {
		this._mainPanel = mainPanel
		this.m_plate_container = mainPanel.m_plate_container
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 0
	}

	public EnterNextBigRound():void
	{
		this._isReady = false
		this._delta_degree = 1
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 1
		let __this = this
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 0
		egret.Tween.get(this.m_plate_container).to({scaleX : 1.2, scaleY : 1.2}, 0.25 * 1000).call(function(){
			egret.Tween.get(__this.m_plate_container).to({scaleX : 1, scaleY : 1}, 0.1 * 1000)
			__this._isReady = true
		})

		this.all_knife_objects = []
	}

	public Update():void
	{
		if(!this._isReady){
			return
		}
		this.m_plate_container.rotation += this._delta_degree
	}

	public EnterNextRound():void
	{
		
	}


	public OnHit(knifeObject:KnifeObject):void
	{
		let start_x = this.m_plate_container.x
		let start_y = this.m_plate_container.y

		let top_y = start_y - 30
		let __this = this
		egret.Tween.get(this.m_plate_container).to({x:start_x, y:top_y}, 0.1 * 1000).to({x:start_x, y:start_y}, 0.1 * 1000).call(function(){
			__this._mainPanel.NextRound()
		})
		knifeObject.testLabel.text = this.all_knife_objects.length.toString()
		this.all_knife_objects.push(knifeObject)
	}

}