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

	public static onFinished(scores, errorCallback):void
	{
		if(typeof(bdm) != "undefined")
		{
			bdm.pk.onFinished(scores, errorCallback)
		}
	}

}