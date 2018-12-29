class GamePropTips extends eui.Component{

	public img_prop:eui.Image
	public img_wenzi:eui.Image

	public constructor(propType:GamePropType) {
		super()
		this.skinName = "PropTipSkin"

		if(propType == GamePropType.HuDun){
			this.img_prop.source = "prop_" + GamePropType.HuDun + "_png"
			this.img_wenzi.source = "prop_hudun_png"
		}else if(propType == GamePropType.XuanZhuan){
			this.img_prop.source = "prop_" + GamePropType.XuanZhuan + "_png"
			this.img_wenzi.source = "prop_xuanzhuan_png"
		}else if(propType == GamePropType.Stone){
			this.img_prop.source = "prop_" + GamePropType.Stone + "_png"
			this.img_wenzi.source = "prop_stone_png"
		}else if(propType == GamePropType.OtherStone){
			this.img_prop.source = "prop_" + GamePropType.Stone + "_png"
			this.img_wenzi.source = "prop_other_stone_png"
		}

		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		let mainPanel = GameController.instance.GetMainScenePanel()
		mainPanel.effectContainer.addChild(this)

		this.x = mainPanel.width / 2
		if(mainPanel.allPropTips.length > 0){
			this.y = mainPanel.allPropTips[mainPanel.allPropTips.length - 1].y + this.height + 20
		}else{
			this.y = mainPanel.positionGroup.y + this.height / 2
		}

		this.scaleX = this.scaleY = 0

		let __this = this
		egret.Tween.get(this).to({scaleX:1.1, scaleY:1.1}, 0.3 * 1000).to({scaleX:1, scaleY:1}, 0.1 * 1000).call(function(){
			CommonUtils.performDelay(function(){
				let index = mainPanel.allPropTips.indexOf(__this)
				mainPanel.allPropTips.splice(index, 1)
				__this.parent.removeChild(__this)
			}, 1 * 1000, this)
		})

		mainPanel.allPropTips.push(this)
	}

}