var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var SimOriginal = /** @class */ (function (_super) {
    __extends(SimOriginal, _super);
    function SimOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimOriginal.prototype.getSimInfo = function () { return cordova(this, "getSimInfo", {}, arguments); };
    SimOriginal.prototype.hasReadPermission = function () { return cordova(this, "hasReadPermission", { "platforms": ["Android"] }, arguments); };
    SimOriginal.prototype.requestReadPermission = function () { return cordova(this, "requestReadPermission", { "platforms": ["Android"] }, arguments); };
    SimOriginal.pluginName = "Sim";
    SimOriginal.plugin = "cordova-plugin-sim";
    SimOriginal.pluginRef = "plugins.sim";
    SimOriginal.repo = "https://github.com/pbakondy/cordova-plugin-sim";
    SimOriginal.platforms = ["Android", "iOS", "Windows", "Windows Phone"];
    return SimOriginal;
}(IonicNativePlugin));
var Sim = new SimOriginal();
export { Sim };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL3NpbS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyw4QkFBc0MsTUFBTSxvQkFBb0IsQ0FBQzs7SUF5Qy9DLHVCQUFpQjs7OztJQU14Qyx3QkFBVTtJQVdWLCtCQUFpQjtJQVdqQixtQ0FBcUI7Ozs7OztjQXRFdkI7RUEwQ3lCLGlCQUFpQjtTQUE3QixHQUFHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29yZG92YSwgSW9uaWNOYXRpdmVQbHVnaW4sIFBsdWdpbiB9IGZyb20gJ0Bpb25pYy1uYXRpdmUvY29yZSc7XG5cbi8qKlxuICogQG5hbWUgU2ltXG4gKiBAZGVzY3JpcHRpb25cbiAqIEdldHMgaW5mbyBmcm9tIHRoZSBTaW0gY2FyZCBsaWtlIHRoZSBjYXJyaWVyIG5hbWUsIG1jYywgbW5jIGFuZCBjb3VudHJ5IGNvZGUgYW5kIG90aGVyIHN5c3RlbSBkZXBlbmRlbnQgaW5mby5cbiAqXG4gKiBSZXF1aXJlcyBDb3Jkb3ZhIHBsdWdpbjogYGNvcmRvdmEtcGx1Z2luLXNpbWAuIEZvciBtb3JlIGluZm8sIHBsZWFzZSBzZWUgdGhlIFtDb3Jkb3ZhIFNpbSBkb2NzXShodHRwczovL2dpdGh1Yi5jb20vcGJha29uZHkvY29yZG92YS1wbHVnaW4tc2ltKS5cbiAqXG4gKiBAdXNhZ2VcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IFNpbSB9IGZyb20gJ0Bpb25pYy1uYXRpdmUvc2ltL25neCc7XG4gKlxuICpcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgc2ltOiBTaW0pIHsgfVxuICpcbiAqIC4uLlxuICpcbiAqIHRoaXMuc2ltLmdldFNpbUluZm8oKS50aGVuKFxuICogICAoaW5mbykgPT4gY29uc29sZS5sb2coJ1NpbSBpbmZvOiAnLCBpbmZvKSxcbiAqICAgKGVycikgPT4gY29uc29sZS5sb2coJ1VuYWJsZSB0byBnZXQgc2ltIGluZm86ICcsIGVycilcbiAqICk7XG4gKlxuICogdGhpcy5zaW0uaGFzUmVhZFBlcm1pc3Npb24oKS50aGVuKFxuICogICAoaW5mbykgPT4gY29uc29sZS5sb2coJ0hhcyBwZXJtaXNzaW9uOiAnLCBpbmZvKVxuICogKTtcbiAqXG4gKiB0aGlzLnNpbS5yZXF1ZXN0UmVhZFBlcm1pc3Npb24oKS50aGVuKFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnUGVybWlzc2lvbiBncmFudGVkJyksXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdQZXJtaXNzaW9uIGRlbmllZCcpXG4gKiApO1xuICogYGBgXG4gKi9cbkBQbHVnaW4oe1xuICBwbHVnaW5OYW1lOiAnU2ltJyxcbiAgcGx1Z2luOiAnY29yZG92YS1wbHVnaW4tc2ltJyxcbiAgcGx1Z2luUmVmOiAncGx1Z2lucy5zaW0nLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL3BiYWtvbmR5L2NvcmRvdmEtcGx1Z2luLXNpbScsXG4gIHBsYXRmb3JtczogWydBbmRyb2lkJywgJ2lPUycsICdXaW5kb3dzJywgJ1dpbmRvd3MgUGhvbmUnXSxcbn0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2ltIGV4dGVuZHMgSW9uaWNOYXRpdmVQbHVnaW4ge1xuICAvKipcbiAgICogUmV0dXJucyBpbmZvIGZyb20gdGhlIFNJTSBjYXJkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgQENvcmRvdmEoKVxuICBnZXRTaW1JbmZvKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHBlcm1pc3Npb25cbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBwbGF0Zm9ybXM6IFsnQW5kcm9pZCddLFxuICB9KVxuICBoYXNSZWFkUGVybWlzc2lvbigpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHBlcm1pc3Npb25cbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBwbGF0Zm9ybXM6IFsnQW5kcm9pZCddLFxuICB9KVxuICByZXF1ZXN0UmVhZFBlcm1pc3Npb24oKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cbn1cbiJdfQ==