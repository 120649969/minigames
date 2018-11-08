class BasketUtils {
	public constructor() {
	}

	public static createDragonBones(skeleton_json:string, texture_json:string, texture_png:string, armature_name:string):dragonBones.EgretArmatureDisplay
	{
		var dragonbonesData = RES.getRes(skeleton_json);
     	var textureData = RES.getRes(texture_json);
        var texture = RES.getRes(texture_png);
        var dragonbonesFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
       	dragonbonesFactory.parseDragonBonesData(dragonbonesData);  
		dragonbonesFactory.parseTextureAtlasData(textureData, texture);
		let armatureDisplay: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay(armature_name);
        // var armature: dragonBones.Armature = dragonbonesFactory.buildArmature(armature_name);
            /**
             * 开启大时钟这步很关键
             * */
        // dragonBones.WorldClock.clock.add(armature);
		

		// this.aniGroup.addChild(armature.getDisplay());  

		return armatureDisplay
	}
}