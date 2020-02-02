///<reference path="./InterFace.ts" />
module wx {


    export type SocketHandler = (...arsg: any[]) => void;


    export var websocket: WebSocket;

    export var socket_open: SocketHandler;
    export var socket_close: SocketHandler;
    export var socket_message: SocketHandler;
    export var socket_error: SocketHandler;

    export interface ConnectSocketOption extends IActiveOption {
        url: string;                 //开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
        header: object;              //HTTP Header，Header 中不能设置 Referer
        protocols: string[];         //子协议数组
        method?: string;             //有效值：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
    }

    export function connectSocket(options: ConnectSocketOption) {

        let s = websocket;
        if (s) {
            closeSocket({ reason: "recreate socket" } as CloseSocketOption)
        }

        websocket = new WebSocket(options.url);
        websocket.binaryType = "arraybuffer";

        onSocketOpen(socket_open);
        onSocketClose(socket_close);
        onSocketError(socket_error);
        onSocketMessage(socket_message);
    }


    export interface CloseSocketOption extends IActiveOption {
        reason: string;
        code?: number;
    }

    export function closeSocket(options: CloseSocketOption) {
        let s = websocket;
        if (s) {
            s.onopen = undefined;
            s.onmessage = undefined;
            s.onclose = undefined;
            s.onerror = undefined;
            try {
                s.close();
            } catch (e) {

            }
            websocket = undefined;
        }
    }



    export function onSocketOpen(callback: SocketHandler) {
        socket_open = callback;
        let s = websocket;
        if (s) {
            s.onopen = callback;
        }
    }

    export function onSocketClose(callback: SocketHandler) {
        socket_close = callback;
        let s = websocket;
        if (s) {
            s.onclose = callback;
        }
    }

    export function onSocketError(callback: SocketHandler) {
        socket_error = callback;
        let s = websocket;
        if (s) {
            s.onerror = callback;
        }
    }

    export function onSocketMessage(callback: SocketHandler) {
        socket_message = callback;
        let s = websocket;
        if (s) {
            s.onmessage = function (e: MessageEvent) {
                callback(e);
            }
        }
    }


    export interface SendSocketMessageOption extends IActiveOption {
        data: ArrayBuffer;
        success?: Function;
        fail?: Function;
        complete?: Function;
    }


    export function sendSocketMessage(option: SendSocketMessageOption) {
        let s = websocket;
        if (s) {
            if (s.readyState == 1) {
                s.send(option.data);
            } else {
                if (option.fail) {
                    option.fail(s.readyState);
                }
            }
        }
    }

}