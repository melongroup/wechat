module wx{

    export const enum HttpResponseType {
        TEXT = "text",
        ARRAY_BUFFER = "arraybuffer"
    }

    export const enum HttpMethod {
        GET = "GET",
        POST = "POST"
    }

    export interface IHttpOption extends IActiveOption{
        url?:string;             //下载资源的 url
        filePath?:string;        //指定文件下载后存储的路径
        header?:{[key:string]:string};       //HTTP 请求的 Header，Header 中不能设置 Referer	
        method?:HttpMethod;
        responseType?:HttpResponseType;
        data?:string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream;
    }

    export interface IHttpData{
        errMsg?:string;
        statusCode?:number;
        tempFilePath?:string;
        header?:object;
        data?:string|object|ArrayBuffer;
    }

    export function downloadFile(option:IHttpOption){

    }


    export class DownloadTask{

        protected option:IHttpOption;

        constructor(option:IHttpOption){
            this.option = option;
        }


        /**
         * 中断下载任务
         */
        abort(){

        }

        /**
         * 监听下载进度变化事件
         * @param callback 
         */
        onProgressUpdate(callback:Function){

        }


    }


    export function request(option:IHttpOption){

        let xhr:XMLHttpRequest;

        if(window["XMLHttpRequest"]){
            xhr = new window["XMLHttpRequest"]();
        }else{
            xhr = new window["ActiveXObject"]("MSXML2.XMLHTTP");
        }


        let{header,responseType,method,url,data}=option;
        xhr.onreadystatechange = function(e:Event){

            /*
                0: 请求未初始化
                1: 服务器连接已建立
                2: 请求已接收
                3: 请求处理中
                4: 请求已完成，且响应已就绪
            */

            if(xhr.readyState == xhr.OPENED){
                if (header) {
                    for (var key in header) {
                        xhr.setRequestHeader(key, header[key]);
                    }
                }
            }


            if (xhr.readyState == 4) {
                let data;
                if(xhr.response != undefined) {
                    data = xhr.response;
                }else if (responseType == HttpResponseType.TEXT) {
                    return xhr.responseText;
                }else if(responseType == HttpResponseType.ARRAY_BUFFER && /msie 9.0/i.test(navigator.userAgent)) {
                    var w = window;
                    return w["convertResponseBodyToText"](xhr["responseBody"]);
                }

                let statusCode = xhr.status;

                let complete = option.complete;
                if(undefined != complete){
                    complete({data,statusCode})
                }
            }
            
        }
        xhr.responseType =  responseType;
        xhr.open(method,url,true);
        xhr.send(data);
    }
}