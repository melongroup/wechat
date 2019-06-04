module wx{

    export const enum KeyboardConfirmType{
        DONE = "done",//完成
        NEXT = "next",//下一个
        SEARCH = "search",//搜索
        GO	= "go",  //前往
        SEND = "send"//	发送
    }

    export interface IKeyboardOption extends IActiveOption{
        value:string;
        defaultValue:string;        //是 键盘输入框显示的默认值
        maxLength:number;           //是	键盘中文本的最大长度
        // multiple:boolean;            //是否为多行输入
        confirmHold:boolean;        //当点击完成时键盘是否收起
        confirmType:KeyboardConfirmType;    //键盘右下角 confirm 按钮的类型，只影响按钮的文本内容
        x:number;
        y:number;
        w:number;
        style: {[key:string]:{[key:string]:string}};
    }

    export interface IKeyboardData {
        value : string;
    }


    var keyboardInputCallBack:Function;

    var keyboardConfirmCallBack:Function;

    var keyboardCompleteCallBack:Function;


    export function onKeyboardInput(callback:Function){
        keyboardInputCallBack = callback;
    }

    export function offKeyboardInput(callback:Function){
        if(callback == keyboardInputCallBack){
            keyboardInputCallBack = undefined;
        }
    }

    export function onKeyboardConfirm(callback:Function){
        keyboardConfirmCallBack = callback;
    }

    export function offKeyboardConfirm(callback:Function){
        if(callback == keyboardConfirmCallBack){
            keyboardConfirmCallBack = undefined;
        }
    }

    export function onKeyboardComplete(callback:Function){
        keyboardCompleteCallBack = callback;
    }

    export function offKeyboardComplete(callback:Function){
        if(keyboardCompleteCallBack == callback){
            keyboardCompleteCallBack = undefined;
        }
    }


    //打开键盘
    export function showKeyboard(option?:IKeyboardOption){
        let{defaultValue,maxLength,confirmHold,confirmType, x, y , style }=option;
        

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

        let input = document.getElementById("txt_input") as HTMLInputElement;
        if(input){
            maxLength = ~~maxLength;
            if(maxLength<=0){
                maxLength = 100;
            }
            input.focus(); 
            input.value = defaultValue ? defaultValue : "";
            input.maxLength = maxLength ;
            input.onchange = (e) => {
                if(undefined != keyboardInputCallBack){
                    keyboardInputCallBack(input);
                }
            }
        }
    }

    //关闭键盘
    export function hideKeyboard(option?:IActiveOption){
        // document.focus();
        let input = document.getElementById("txt_input") as HTMLInputElement;
        if(input){
            input.style.visibility ="hidden";
            input.onchange = undefined;
        }
        if(undefined != keyboardCompleteCallBack){
            keyboardCompleteCallBack(input);
        }
    }


    export function updateKeyboard(option?:IKeyboardOption){
        let value = option.value;
        let input = document.getElementById("txt_input") as HTMLInputElement;
        if(input){
            input.value = value;
            if(undefined != keyboardInputCallBack){
                keyboardInputCallBack(input);
            }
        }
    }




}