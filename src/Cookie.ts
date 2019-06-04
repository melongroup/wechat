module wx{

    export var cookie:{[key:string]:string} = {};


    export function cookie_init(){
        let str = document.cookie + ";";
        let o = /data=(.*?);/.exec(str);
        if(!o){
            return;
        }

        try {
            cookie = JSON.parse(o[1]);
        } catch (error) {
            cookie = {};
        }
    }

    export function cookie_flush(){
        var data = "data="+JSON.stringify(cookie);
        document.cookie = data;
    }

    
}