

class SettingPanel extends eui.Component{

	private btn_close:eui.Button
	public m_list:eui.List
	private dataArray: eui.ArrayCollection = new eui.ArrayCollection()
	public constructor() {
		super()
		this.skinName = "SettingSkin"
	}

	protected createChildren(): void {
		super.createChildren()
		this.m_list.dataProvider = this.dataArray
		this.m_list.itemRenderer = SettingItem

		let __this = this
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(event:egret.Event){
			__this.parent.removeChild(__this)
			event.stopPropagation()
		}.bind(this), this)

		this._loadData()
	}

	private _loadData():void
	{
		let configs:Array<DataConfig> = RoundPlateRotateStrategy.CurrentConfig['sub_configs']
		for(let index = 0; index < configs.length; index ++)
		{
			this.dataArray.addItem(configs[index])
		}
		// for(let index = 0; index < 3; index++)
		// {
		// 	let config = new DataConfig()
		// 	config.duration = 3 + Math.floor(Math.random() * 5)
		// 	config.direction = Math.floor(Math.random() * 2) == 0 ? 1 : -1
		// 	config.speed = 5 + Math.floor(Math.random() * 4)
		// 	this.dataArray.addItem(config)
		// }
	}
}

class SettingItem extends eui.Component implements eui.IItemRenderer{

	public edit_duration:eui.EditableText
	public edit_direction:eui.EditableText
	public edit_speed:eui.EditableText
	private _data: DataConfig;
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

	
    public set data(data: DataConfig) {
        this._data = data;
		this._updateView()
    }
    public get data(): DataConfig {
        return this._data;
    }

	private _updateView():void
	{
		if(!this._data){
			return
		}
		this.edit_speed.text = this._data.speed.toString()
		this.edit_duration.text = this._data.duration.toString()
		this.edit_direction.text = this._data.direction.toString()
	}
}
