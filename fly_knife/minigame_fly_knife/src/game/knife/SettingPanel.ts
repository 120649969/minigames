
module ui{
	export class SettingPanel extends ui.Window{

		private _mainPanel:ui.MainGameScene
		private btn_close:eui.Button
		private btn_yes:eui.Button
		private btn_add:eui.Button

		public m_list:eui.List
		public m_scroller:eui.Scroller
		private dataArray: eui.ArrayCollection = new eui.ArrayCollection()

		public constructor() {
			super()
			this._mainPanel = ui.WindowManager.getInstance().getWindow("MainGameScene") as ui.MainGameScene
			this.skinName = "SettingSkin"
		}

		protected createChildren(): void {
			super.createChildren()

			this.m_scroller.viewport = this.m_list
			this.m_list.dataProvider = this.dataArray
			this.m_list.itemRenderer = SettingItem

			let layerout:eui.VerticalLayout = this.m_list.layout as eui.VerticalLayout
			layerout.gap = 10
			let __this = this
			this.btn_close.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				ui.WindowManager.getInstance().close("SettingPanel")
				event.stopPropagation()
			}.bind(this), this)

			this.btn_add.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){

				let tab = {
					"direction":1,
					"duration":0,
					"speed":0
				}
				let new_config = new StrategyConfig(tab)
				let dataArray:eui.ArrayCollection = __this.m_list.dataProvider as eui.ArrayCollection
				dataArray.addItem(new_config)
				event.stopPropagation()
			}.bind(this), this)
			

			this.btn_yes.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				__this._reloadData()
				__this._mainPanel.ReStartGame()
				ui.WindowManager.getInstance().close("SettingPanel")
				event.stopPropagation()
			}.bind(this), this)
			this._loadData()
		}

		private _reloadData():void
		{
			let new_round_strategys = []
			for(let index = 0; index < this.m_list.dataProvider.length; index++)
			{
				let item_render:SettingItem = this.m_list.getElementAt(index) as SettingItem
				if(item_render){
					item_render.ReloadData()
				}
				new_round_strategys.push(item_render.data)
			}
			let current_round_config = this._mainPanel.all_round_configs[this._mainPanel.current_round]
			current_round_config.strategys = new_round_strategys
		}

		private _loadData():void
		{
			let current_round_strategys:Array<StrategyConfig> = this._mainPanel.m_plate_object.roundPlateRotateStrategy.roundConfig.strategys
			for(let index = 0; index < current_round_strategys.length; index ++)
			{
				this.dataArray.addItem(current_round_strategys[index])
			}
		}
	}

	class SettingItem extends eui.Component implements eui.IItemRenderer{

		public edit_duration:eui.EditableText
		public edit_fadetime:eui.EditableText
		public edit_speed:eui.EditableText
		private _data: StrategyConfig;
		public selected: boolean;
		public itemIndex: number;

		private btn_delete:eui.Button
		public constructor() {
			super()
			this.skinName = "SettingItemSkin"
		}


		protected createChildren(): void {
			super.createChildren()

			let __this = this
			this.btn_delete.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
				let list:eui.List = __this.parent as eui.List
				if(list){
					let dataArray: eui.ArrayCollection = list.dataProvider as eui.ArrayCollection
					dataArray.removeItemAt(__this.itemIndex)
				}
				event.stopPropagation()
			}.bind(this), this)
		}

		
		public set data(data: StrategyConfig) {
			this._data = data;
			this._updateView()
		}

		public get data(): StrategyConfig {
			return this._data;
		}

		private _updateView():void
		{
			if(!this._data){
				return
			}
			this.edit_speed.text = this._data.speed.toString()
			this.edit_duration.text = this._data.duration.toString()
			this.edit_fadetime.text = this._data.fadeTime.toString()
		}

		public ReloadData():void
		{
			let fadetime_value = parseFloat(this.edit_fadetime.text)
			if(fadetime_value != null){
				this._data.fadeTime = fadetime_value
			}
			
			let duration_value = parseFloat(this.edit_duration.text)
			if(duration_value != null){
				this._data.duration = duration_value
			}

			let speed_value = parseFloat(this.edit_speed.text)
			if(speed_value != null){
				this._data.speed = speed_value
			}
		} 
	}
}
