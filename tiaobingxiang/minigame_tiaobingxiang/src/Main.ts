//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

declare var bdm; // 发行嵌入的SDK对象
declare var WindowManager:ui.WindowManager;
declare var GameNet:io.GameNet;
declare function log(...args: any[]): void

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.setStageSize(false)
        WindowManager = ui.WindowManager.getInstance();
        GameNet = io.GameNet.getInstance();

        if(User.openId == "")
        {
            User.openId = GamePlatform.GetMyOpenId()
        }

        if(User.roomId == "")
        {
            User.roomId = GamePlatform.GetRoomId()
        }
        
        if (!User.openId || User.openId.length == 0) {
            User.openId = new Date().getTime().toString() + Math.floor(Math.random() * 10000).toString();
            egret.localStorage.setItem('openId', User.openId);
            User.roomId = "0"
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

     protected setStageSize(emit:boolean) {
        /************test1 begin*************** */
        let width = egret.Capabilities.boundingClientWidth;
        let height = egret.Capabilities.boundingClientHeight;

        let design_width = Const.MIN_WIDTH
        let design_height = Const.MIN_HEIGHT
        let design_rato = design_width / design_height
        let newWidth = 0
        let newHeight = 0
        if(width / height <= design_rato){ //竖屏高度太高
            newWidth = design_width
            newHeight = Math.floor(height / width * newWidth);
        } else if(width / height <= design_rato * 1.5){
            newWidth = design_width;
            newHeight = Math.floor(height / width * newWidth);
        } else {
            newWidth = design_width
            newHeight = design_height
        }

        this.stage.removeEventListener(egret.Event.RESIZE, this.onStageResize, this);
        this.stage.setContentSize(newWidth, newHeight);
        this.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);

        if (emit) {
            EventEmitter.getInstance().dispatchEventWith(Const.EVENT.ON_STAGE_RESIZE, false, {width: this.stage.stageWidth, height: this.stage.stageHeight});
        }
    }

    protected onStageResize():void {
        this.setStageSize(true);
    } 

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        ui.WindowManager.getInstance().open('MainScenePanel')
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

   private uiLayer:egret.DisplayObjectContainer
    private coverLayer:egret.DisplayObjectContainer
    private topLayer:egret.DisplayObjectContainer

    protected createGameScene(): void {
        this.uiLayer = new egret.DisplayObjectContainer();
        this.coverLayer = new egret.DisplayObjectContainer();
        this.topLayer = new egret.DisplayObjectContainer();

        this.addChild(this.uiLayer);
        this.addChild(this.coverLayer);
        this.addChild(this.topLayer);   
        ui.WindowManager.getInstance().initialize(this);
        // WindowManager.initialize(this);
    }
}
