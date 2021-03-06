class GamePlatform {
	public constructor() {
	}

	public static onInit():void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onInit()
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

	public static onCalculating():void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onCalculating()
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
			// console.log(bdm.args.openid)
			return bdm.args.openid
		}
		// log(bdm.args)
		// log(window.location)
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

	public static registerSurrenderCallback(callback):void
	{
		if(typeof(bdm) != "undefined" && typeof(bdm.args) != "undefined")
		{
			bdm.pk.onUserExit(function(){
				if(callback)
				{
					callback()
				}
			})
		}
	}
}