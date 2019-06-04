module wx{

    export interface ITouchData{
        identifier:number;
        screenX:number;
        screenY:number;
        clientX:number;
        clientY:number;
    }

    export interface ITouchEventData{
        touches:ITouchData[];
        changedTouches:ITouchData[];
        timeStamp:number;
        target:EventTarget;
        event:MouseEvent;
        preventDefault:Function;
        stopPropagation:Function;
        ctrlKey:boolean;
        shiftKey:boolean;
        altKey:boolean;
        type:string;
    }


    var toucheEventData = {} as ITouchEventData;

    export function onTouchStart(callBack:Function){
        let eventData = toucheEventData;
        if(!no_ismobile){
            document.onmousedown = (e) =>{
                // touch.identifier = e.button;
                // touch.screenX = e.x;
                // touch.screenY = e.y;
                eventData.event = e;
                // eventData.changedTouches[0] = touch;
                // eventData.ctrl = e.ctrlKey;
                // eventData.alt = e.altKey;
                // eventData.shift = e.shiftKey;
                // eventData.timeStamp = Date.now();
                // eventData.target = e.target;
                // eventData.preventDefault = e.preventDefault;
                // eventData.stopPropagation = e.stopPropagation;
                callBack(eventData);
            }

            document.oncontextmenu = function (event){
                event.preventDefault();
            }

        }else{
            no_maincanvas.ontouchstart = (e)=>{
                e.preventDefault();
                callBack(e);

                // console.log("ontouchstart")
            }
        }
    }

    export function onTouchMove(callBack:Function){
        let eventData = toucheEventData;
        if(!no_ismobile){
            document.onmousemove = (e) =>{
                eventData.event = e;
                callBack(eventData);
                // console.log("onmousemove")
            }
        }else{
            no_maincanvas.ontouchmove = (e)=>{
                e.preventDefault();
                callBack(e);
            }
        }
        
    }

    export function onTouchEnd(callBack:Function){
        let eventData = toucheEventData;
        if(!no_ismobile){
            document.onmouseup = (e) =>{
                eventData.event = e;
                callBack(eventData);
            }
        }else{
            no_maincanvas.ontouchend = (e)=>{
                if(e.cancelable){
                    e.preventDefault();
                }
                callBack(e);
            }
        }
    }


    export function onTouchCancel(callBack:Function){
        let eventData = toucheEventData;
        no_maincanvas.ontouchcancel = (e)=>{
            if(e.cancelable){
                e.preventDefault();
            }
            callBack(e);
        }
    }

}