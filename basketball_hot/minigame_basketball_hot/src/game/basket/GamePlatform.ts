class GamePlatform {
	public constructor() {
	}

	public static onInit(errorCallback):void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onInit(errorCallback)
		}
	}

	public static onWaiting(errorCallback):void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onWaiting(errorCallback)
		}
	}

	public static onStarted(errorCallback):void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onStarted(errorCallback)
		}
	}

	public static onFinished():void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onFinished()
		}
	}

	public static GetIcon():void
	{
		if(typeof(bdm) != "undefined" && typeof(bdm.args) != "undefined")
		{
			console.log(bdm.args)
		}
	}

	public static GetMyOpenId():string
	{
		if(typeof(bdm) != "undefined" && typeof(bdm.args) != "undefined")
		{
			console.log(bdm.args.openid)
			return bdm.args.openid
		}
		log(bdm.args)
		log(window.location)
		return ""
	}

	public static GetRoomId():string
	{
		if(typeof(bdm) != "undefined" && typeof(bdm.args) != "undefined")
		{
			console.log(bdm.args.roomid)
			return bdm.args.roomid
		}

		return ""
	}
}