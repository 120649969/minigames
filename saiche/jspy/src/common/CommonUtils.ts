class CommonUtils {
	public constructor() {
	}

	private static _has_cache_ = {}
	public static createDragonBones(skeleton_json:string, texture_json:string, texture_png:string, armature_name:string):dragonBones.EgretArmatureDisplay
	{
		var dragonbonesFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
		if(!CommonUtils._has_cache_[skeleton_json]){
			var dragonbonesData = RES.getRes(skeleton_json);
			var textureData = RES.getRes(texture_json);
			var texture = RES.getRes(texture_png);
			dragonbonesFactory.parseDragonBonesData(dragonbonesData);  
			dragonbonesFactory.parseTextureAtlasData(textureData, texture);
			CommonUtils._has_cache_[skeleton_json] = true
		}
		let armatureDisplay: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay(armature_name);
		return armatureDisplay
	}
	
	public static SetColor(image: egret.DisplayObject, color: number) {
		// 将16进制颜色分割成rgb值
		let spliceColor = (color) => {
			let result = {r: -1, g: -1, b: -1};
			result.b = color % 256;
			result.g = Math.floor((color / 256)) % 256;
			result.r = Math.floor((color / 256) / 256);
			return result;
		}
		let result = spliceColor(color);
		let colorMatrix = [
			1, 0, 0, 0, 0,
			0, 1, 0, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 0, 1, 0
		];
		colorMatrix[0] = result.r / 255;
		colorMatrix[6] = result.g / 255;
		colorMatrix[12] = result.b / 255;
		let colorFilter = new egret.ColorMatrixFilter(colorMatrix);

		image.filters = [colorFilter];
	}

	public static GrayDisplayObject(displayobject:egret.DisplayObject){
		var colorMatrix = [
			0.3,0.6,0,0,0,
			0.3,0.6,0,0,0,
			0.3,0.6,0,0,0,
			0,0,0,1,0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		displayobject.filters = [colorFlilter];
	}

	public static ClearFilter(displayobject:egret.DisplayObject){
		displayobject.filters = []
	}

	/**
     * 替换插槽
     * @param slotName 插槽名称 原材料
     * @param textureName 图片名  xxx_png
     * @param 偏移量
     */
    public static setNewSlot(armatureDisplay:dragonBones.EgretArmatureDisplay, slotName:string, textureName:string ,offsetX:number=0, offsetY:number=0){
        var slot:dragonBones.Slot = armatureDisplay.armature.getSlot(slotName);
        var b:egret.Bitmap = new egret.Bitmap();
        b.texture = RES.getRes(textureName);
        b.x = slot.display.x;
        b.y = slot.display.y;
        b.anchorOffsetX = b.width/2 + offsetX;
        b.anchorOffsetY = b.height/2 + offsetY;
        slot.setDisplay(b);
    }
	
	public static GetRandomPositive():number
	{
		return (Math.floor(Math.random() * 2) == 0) ? 1 : -1
	}

	public static GetRandomScope(minScope:number, maxScope:number):number
	{
		let min = minScope
		let max = maxScope
		minScope = Math.min(minScope, maxScope)
		maxScope = Math.max(minScope, maxScope)
		return Math.random() * (maxScope - minScope) + minScope
	}

	public static performDelay2(callback:Function, delay_time:number, callbackThisObject:Object):egret.Timer
	{
		let timer = new egret.Timer(delay_time, 1);
		timer.addEventListener(egret.TimerEvent.TIMER, function():void{
			if(callback)
			{
				callback.apply(callbackThisObject);
			}
		}.bind(this), this)
		timer.start()
		return timer
	}

	public static performDelay(callback:Function, timeout:number, callbackThisObject:Object):void
	{
		setTimeout(function() {
			if(callback)
			{
				callback.apply(callbackThisObject)
			}
		}, timeout);
	}

	public static Add_Btn_Click(btn:egret.DisplayObject, callback:Function, callbackThisObject:Object):void
	{
		btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
			if(callback)
			{
				callback.call(callbackThisObject, event)
				// callback.apply(callbackThisObject, event)
			}
		}, callbackThisObject)
	}

	public static addSkillArcMask(test_shape:egret.DisplayObject, total_time:number, callback:Function = null):void
	{
		let shape:egret.Shape = new egret.Shape();
		test_shape.mask = shape
		test_shape.parent.addChild(shape)
		let angle = 360;
		test_shape.visible = true
		let step_time = 0.1 * 1000
		let step_angle = 360 / (total_time / (0.1 * 1000))
		let start_time = egret.getTimer()
		let step_set_angle = function(){
			CommonUtils.performDelay(function(){
				angle -= step_angle;
				changeGraphics(angle);
				if(angle < 0){
					test_shape.visible = false
					if(callback)
					{
						callback()
					}
					return
				}
				step_set_angle()
			}, step_time, this)
		}
        step_set_angle()
		shape.x = test_shape.x
		shape.y = test_shape.y
		shape.scaleX = -1
		shape.rotation = 90
        function changeGraphics(angle) {
            shape.graphics.clear();

            shape.graphics.beginFill(0x00ffff, 1);
            shape.graphics.moveTo(0, 0);
            shape.graphics.lineTo(0, -54);
            shape.graphics.drawArc(0, 0, 54, 0, angle * Math.PI / 180, false);
            shape.graphics.lineTo(0, 0);
            shape.graphics.endFill();
        }
	}

	public static TableContact(arr1:Array<number>, arr2:Array<number>):void
	{
		for(let data of arr2)
		{
			if(arr1.indexOf(data) < 0)
			{
				arr1.push(data)
			}
		}
	}

	public static GetDistance(point1:egret.Point, point2:egret.Point)
	{
		let distance = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
		return distance
	}
}