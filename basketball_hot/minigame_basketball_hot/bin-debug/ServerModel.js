var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ServerModel = (function () {
    function ServerModel() {
        this.my_score = 0;
        this.other_score = 0;
        this.my_icon_url = "";
        this.other_icon_url = "";
        this.left_time = 20;
        this.MAX_TIME = 60;
    }
    return ServerModel;
}());
__reflect(ServerModel.prototype, "ServerModel");
//# sourceMappingURL=ServerModel.js.map