var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var DebugPanel = (function (_super) {
    __extends(DebugPanel, _super);
    function DebugPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "Setting";
        var __this = _this;
        _this.btn_close.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            __this.parent.removeChild(__this);
        }.bind(_this), _this);
        _this.btn_ok.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            var new_value = parseFloat(__this.label_gravity.text);
            if (new_value) {
                HitConst.Gravity = new_value;
            }
            new_value = parseFloat(__this.label_max_x.text);
            if (new_value) {
                HitConst.Max_Speed_X = new_value;
            }
            new_value = parseFloat(__this.label_min_y.text);
            if (new_value) {
                HitConst.MIN_SPEED_Y = new_value;
            }
            new_value = parseFloat(__this.label_impluse_y.text);
            if (new_value) {
                HitConst.PUSH_DOWN_IMPLUSE_Y = new_value;
            }
            new_value = parseFloat(__this.label_wind.text);
            if (new_value) {
                HitConst.Frame_Speed_X = new_value;
            }
            new_value = parseFloat(__this.label_floor_restitution.text);
            if (new_value) {
                HitConst.floor_restitution = new_value;
            }
            new_value = parseFloat(__this.label_right_restitution.text);
            if (new_value) {
                HitConst.basket_right_line_restitution = new_value;
            }
            new_value = parseFloat(__this.label_left_restitution.text);
            if (new_value) {
                HitConst.basket_left_line_restitution = new_value;
            }
            new_value = parseFloat(__this.label_board_restitution.text);
            if (new_value) {
                HitConst.basket_board_restitution = new_value;
            }
            __this.parent.removeChild(__this);
        }.bind(_this), _this);
        _this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            this.label_gravity.text = HitConst.BACK_Gravity.toString();
            this.label_max_x.text = HitConst.BACK_Max_Speed_X.toString();
            this.label_min_y.text = HitConst.BACK_MIN_SPEED_Y.toString();
            this.label_impluse_y.text = HitConst.BACK_PUSH_DOWN_IMPLUSE_Y.toString();
            this.label_wind.text = HitConst.BACK_Frame_Speed_X.toString();
            this.label_floor_restitution.text = HitConst.BACK_floor_restitution.toString();
            this.label_right_restitution.text = HitConst.BACK_basket_right_line_restitution.toString();
            this.label_left_restitution.text = HitConst.BACK_basket_left_line_restitution.toString();
            this.label_board_restitution.text = HitConst.BACK_basket_board_restitution.toString();
        }.bind(_this), _this);
        _this.label_gravity.text = HitConst.Gravity.toString();
        _this.label_max_x.text = HitConst.Max_Speed_X.toString();
        _this.label_min_y.text = HitConst.MIN_SPEED_Y.toString();
        _this.label_impluse_y.text = HitConst.PUSH_DOWN_IMPLUSE_Y.toString();
        _this.label_wind.text = HitConst.Frame_Speed_X.toString();
        _this.label_floor_restitution.text = HitConst.floor_restitution.toString();
        _this.label_right_restitution.text = HitConst.basket_right_line_restitution.toString();
        _this.label_left_restitution.text = HitConst.basket_left_line_restitution.toString();
        _this.label_board_restitution.text = HitConst.basket_board_restitution.toString();
        return _this;
    }
    return DebugPanel;
}(eui.Component));
__reflect(DebugPanel.prototype, "DebugPanel");
//# sourceMappingURL=DebugPanel.js.map