module wx{

    /**
     * 注意:微信小游戏中 并没有这个东西 所以业务中不可以使用这个对象
     */
    export var no_systemInfo:ISystemInfo;
    export var no_ismobile:boolean;
    export var no_maincanvas:HTMLCanvasElement;
    export var no_softKeyboard:boolean;

    export var no_stageWidth:number;
    export var no_stageHeight:number;


    export function createCanvas(){
        if(typeof OffscreenCanvas == "function"){
            return new OffscreenCanvas(1,1);
        }
        return document.createElement("canvas");
    }

    export function createImage(){
        return document.createElement("img");
    }


    /**
     * 可以修改渲染帧率。默认渲染帧率为 60 帧每秒。修改后，requestAnimationFrame 的回调频率会发生改变。
     * @param fps (1-60)
     */
    export function setPreferredFramesPerSecond(fps:number){

    }


    export interface ISystemInfo{
        brand:string;       //手机品牌
        model:string;           //手机型号
        pixelRatio:number;      //设备像素比
        screenWidth:number;     //屏幕宽度
        screenHeight:number;    //屏幕高度
        windowWidth:number;     //可使用窗口宽度
        windowHeight:number;    //可使用窗口高度
        language:string;            //微信设置的语言
        version:string;             //微信版本号
        system:string;              //操作系统版本
        platform:string;            //客户端平台
        fontSizeSetting:number;     //用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。
        SDKVersion:string;          //客户端基础库版本
        benchmarkLevel:number       //性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)
        battery:number;             //电量，范围 1 - 100
        wifiSignal:number;          //wifi 信号强度，范围 0 - 4
    }



    export function getSystemInfoSync(){
        let info = {} as ISystemInfo;

        let pixelRatio = window.devicePixelRatio;

        if(~~pixelRatio == 0){
            var getPixelRatio = function(context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };

            pixelRatio = getPixelRatio(document.createElement("canvas").getContext("2d"));
        }

        info.pixelRatio = pixelRatio;


        let scene = window.screen;

        info.screenWidth = scene.width;
        info.screenHeight = scene.height;

        info.windowWidth = window.innerWidth;
        info.windowHeight = window.innerHeight;


        no_ismobile = "ontouchstart" in document;


        var userAgentInfo = navigator.userAgent.toLocaleLowerCase();

        if(userAgentInfo.search(/ios|iphone|ipad/) != -1){
            info.platform = "iPhone";
            no_ismobile = true;
        }else if(userAgentInfo.search(/android|pad/) != -1){
            info.platform = "android";
            no_ismobile = true;
        }else{
            info.platform = "pc";
            no_ismobile = false;
        }


        no_systemInfo = info;

        // var Agents = ["Android", "iPhone",
        //     "SymbianOS", "Windows Phone",
        //     "iPad", "iPod"];
        // var flag = true;
        // for (var v = 0; v < Agents.length; v++) {
        //     if (userAgentInfo.indexOf(Agents[v]) > 0) {
        //         flag = false;
        //         break;
        //     }
        // }



        window.addEventListener("focusin",windowFocusHandler);
        window.addEventListener("focusout",windowFocusHandler);

        return info;
    }

    function windowFocusHandler(e:Event){
        if(e.target instanceof HTMLInputElement && e.target.id == "txt_input"){
            if(e.type == "focusin"){
                no_softKeyboard = true;
                console.log("开启键盘");
            }else if(no_softKeyboard){
                no_softKeyboard = false;
                console.log("关闭键盘");
                hideKeyboard();
            }
        }
    }

    export interface IWindowResizeData{
        windowWidth:number;
        windowHeight:number;
    }


    export var isShowSoftKeyboard:boolean;

    export function onWindowResize(callback:Function){
        let{innerWidth,innerHeight} = window;
        no_stageWidth = innerWidth;
        no_stageHeight = innerHeight;
        window.onresize = (e)=>{
            let{innerWidth,innerHeight} = window;
            if(no_ismobile){
                if(no_stageWidth < innerWidth){
                    no_stageWidth = innerWidth;
                }
                if(no_stageHeight < innerHeight){
                    no_stageHeight = innerHeight;
                }else if(no_stageHeight > innerHeight){
                    
                }else{
                    //关闭键盘
                    if( no_softKeyboard ){
                        console.log("Resize 关闭键盘");
                        no_softKeyboard = false;
                        hideKeyboard();
                    }
                }
            }
            

            callback({windowWidth:innerWidth,windowHeight:innerHeight});
        };
    }


    export function resetCssStyle(style:{[key:string]:{[key:string]:string}}){
        for(let id in style){
            let element = document.getElementById(id);
            if(element){
                let setting = style[id];
                let styles = element.style;
                for(let key in setting){
                    styles[key] = setting[key];
                }
            }
        }
    }

    export interface IOnShowData{
        scene:string;
        query:object;
        shareTicket:string;
        referrerInfo:{appId:string, extraData:object};
    }

    //当前页显示和隐藏监听

    // 参数
    // Object res

    // 属性	类型	说明
    // scene	string	场景值
    // query	Object	查询参数
    // shareTicket	string	shareTicket
    // referrerInfo	object	当场景为由从另一个小程序或公众号或App打开时，返回此字段
    // referrerInfo 的结构

    // 属性	类型	说明
    // appId	string	来源小程序或公众号或App的 appId
    // extraData	object	来源小程序传过来的数据，scene=1037或1038时支持
    let focustimer;
    export function onShow(callback:Function){
        //焦点响应时间可以稍微延迟一点
        window.onfocus = (e)=>{
            // callback();
            focustimer = setTimeout(focusLater, 100, callback);
        };
    }

    function focusLater(callback:Function){
        callback();
        clearTimeout(focustimer);
        focustimer = undefined;
    }

    export function onHide(callback:Function){
        window.onblur = (e)=>{
            callback();
            clearTimeout(focustimer);
            focustimer = undefined;
        };
    }

    //监听音频因为受到系统占用而被中断开始事件。以下场景会触发此事件：闹钟、电话、FaceTime 通话、微信语音聊天、微信视频聊天。此事件触发后，小程序内所有音频会暂停。
    export function onAudioInterruptionBegin(callback:Function){

    }

    //监听音频中断结束事件。在收到 onAudioInterruptionBegin 事件之后，小程序内所有音频会暂停，收到此事件之后才可再次播放成功
    export function onAudioInterruptionEnd(callback:Function){

    }



    export function arrayBufferToBase64(buffer:ArrayBuffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;

        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    };


    // export function install(callback:Function,serviceSetting:any){
    //     // setTimeout(callback, 0);
    //     if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker.register('./sw.js').then((registration)=>{

    //             navigator.serviceWorker.controller.postMessage(serviceSetting);

    //             navigator.serviceWorker.controller.postMessage({type:"inflate"})
                
    //             console.log("serviceWorker create successful");
    //             callback();
    //         }).catch((arr)=>{
    //             console.log("serviceWorker not successful");
    //             callback();
    //         })
    //     }else{
    //         setTimeout(callback, 0);
    //     }
    // }
}

// export function requestAnimationFrame(){

// }

// export function cancelAnimationFrame(requestID:number){

// }