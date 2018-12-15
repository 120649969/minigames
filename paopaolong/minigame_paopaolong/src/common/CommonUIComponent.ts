class CommonUIComponent extends BaseComponent{
	private _mainScenePanel:ui.MainScenePanel
	private _ready_go_armatureDisplay:dragonBones.EgretArmatureDisplay

	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
		this.init()
	}

	protected init():void
	{
		super.init()
		let __this = this
		if(this._mainScenePanel.btn_help)
		{
			this._mainScenePanel.btn_help.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
				if(__this._mainScenePanel.img_help.visible){
					__this.HideHelp()
				} else {
					__this.ShowHelp()
				}
			}.bind(this), this)
		}
		this._addAnimation()
	}

	
	private _addAnimation():void
	{
		let armatureDisplay = CommonUtils.createDragonBones("ready_go_ske_json", "ready_go_tex_json", "ready_go_tex_png", "ready_go_armature")
		this._mainScenePanel.addChild(armatureDisplay)
		armatureDisplay.visible = false
		this._ready_go_armatureDisplay = armatureDisplay
		armatureDisplay.x = this._mainScenePanel.stage.stageWidth / 2
		armatureDisplay.y = this._mainScenePanel.stage.stageHeight / 2
	}

	private ShowHelp():void
	{
		let global_btn_help_point = this._mainScenePanel.btn_help.localToGlobal(0, 0)
		let delta_y = this._mainScenePanel.height - global_btn_help_point.y
		let max_scale = (delta_y - 50) / (this._mainScenePanel.img_help.height)
		let max_scale_x = (this._mainScenePanel.width - 80) / (this._mainScenePanel.img_help.width)
		max_scale = Math.min(max_scale, max_scale_x)
		this._mainScenePanel.img_help.visible = true
		this._mainScenePanel.img_help.scaleX = this._mainScenePanel.img_help.scaleY = 0
		egret.Tween.get(this._mainScenePanel.img_help).to({"scaleX": max_scale, "scaleY": max_scale}, 0.2 *1000)
	}

	private HideHelp():void
	{
		let __this = this
		egret.Tween.get(__this._mainScenePanel.img_help).to({"scaleX": 0, "scaleY": 0}, 0.1 *1000).call(function(){
			__this._mainScenePanel.img_help.visible = false
		})
	}

	public OnTouch(stargeX:number, stageY:number):boolean
	{
		super.OnTouch(stargeX, stageY)
		if(this._mainScenePanel.img_help)
		{
			if(this._mainScenePanel.img_help.visible){
				this.HideHelp()
				return true
			}
		}
		
		return false
	}

	public PlayReadyAnimation(callback):void
	{
		let __this = this
		this._ready_go_armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			__this._ready_go_armatureDisplay.visible = false
			__this._ready_go_armatureDisplay.parent.removeChild(__this._ready_go_armatureDisplay)
			if(callback)
			{
				callback()
				callback = null
			}
		}, this)
		this._ready_go_armatureDisplay.animation.play("ready_go_animation", 1)
		this._ready_go_armatureDisplay.visible = true
		SoundManager.getInstance().playSound("ready_go_mp3");
	}

	public UpdateIcon():void
	{
		if(!this._mainScenePanel.m_other_icon){
			return
		}
		this._addCircleMask(this._mainScenePanel.m_other_icon, this._mainScenePanel.m_other_icon_bg.x, this._mainScenePanel.m_other_icon_bg.y,this._mainScenePanel.m_other_icon_bg.width / 2 - 5)
		this._addCircleMask(this._mainScenePanel.m_me_icon, this._mainScenePanel.m_me_icon_bg.x, this._mainScenePanel.m_me_icon_bg.y, this._mainScenePanel.m_me_icon_bg.width / 2 - 5)
		let serverModel = GameController.instance.serverModel
		egret.ImageLoader.crossOrigin = "anonymous" //支持跨域
		if(serverModel.myRole.icon){
			this._mainScenePanel.m_me_icon.source = serverModel.myRole.icon
		}
		if(serverModel.otherRole.icon){
			this._mainScenePanel.m_other_icon.source = serverModel.otherRole.icon
		}
	}

	public UpdateName():void
	{
		let serverModel = GameController.instance.serverModel
		if(this._mainScenePanel.label_my_name)
		{
			this._mainScenePanel.label_my_name.text = serverModel.myRole.nickname
		}
		if(this._mainScenePanel.label_other_name)
		{
			this._mainScenePanel.label_other_name.text = serverModel.otherRole.nickname
		}
	}

	private _addCircleMask(img_icon:eui.Image, x:number, y:number, radius:number):void
	{
		let circle2:egret.Shape = new egret.Shape();
		circle2.graphics.beginFill(0x0000ff);
		circle2.graphics.drawCircle(x, y, radius);
		circle2.graphics.endFill();
		img_icon.parent.addChild(circle2);
		img_icon.mask = circle2
	}
}