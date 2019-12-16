module wx{

    export interface IOrientationValue{
        value : string
    }


    var orientationHandlers = [];

    function orientationchange(e? : Event){


        let orientation = window.orientation;

        let value : string;

        switch(orientation){
            case 90:
                value = "landscape";
                break;
            case -90:
                value = "landscapeReverse";
                break;

            case 0:
            default:
                value = "portrait";
                break;
        }



        let v = {value};


        for (let i = 0,d = orientationHandlers.length; i < d; i++) {
            orientationHandlers[i](v)
            
        }

        // switch(orientation){
        //     case 90:
                
        // }
    }


    export function onDeviceOrientationChange(callback:Function){

        if(!orientationHandlers.length){
            window.addEventListener('orientationchange',orientationchange,false);
        }

        if(orientationHandlers.indexOf(callback) == -1){
            orientationHandlers.push(callback);
        }
        
        orientationchange();
    }



    export function offDeviceOrientationChange(callback:Function){
        let i = orientationHandlers.indexOf(callback);
        if(i != -1){
            orientationHandlers.splice(i,1);
        }

        if(!orientationHandlers.length){
            window.removeEventListener('orientationchange',orientationchange);
        }
    }

}