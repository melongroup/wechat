module wx {
    export var textarea: HTMLTextAreaElement;

    export var logs: string[] = [];

    export function dateFtt(fmt, date) { //author: meizz   
        var o = {
            "M+": date.getMonth() + 1,                 //月份   
            "d+": date.getDate(),                    //日   
            "h+": date.getHours(),                   //小时   
            "m+": date.getMinutes(),                 //分   
            "s+": date.getSeconds(),                 //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    export function showLog(value: boolean) {

        if (!textarea) {
            textarea = document.getElementById("debugArea") as HTMLTextAreaElement;
            if (!textarea) {
                textarea = document.createElement("textArea") as HTMLTextAreaElement;
                textarea.id = "debugArea";
                textarea.name = "debugArea";
                textarea.readOnly = true;
                let style = textarea.style;
                style.width = "100%";
                style.height = "100%";
                style.position = "absolute";
                style.background = "rgba(0,0,0,0.2)"
                style.top = "0px";
                style.color = "rgb(255,255,255)"
                style.resize = "none";
                style.border = "none";
            }
        }

        if (value) {
            let container2d = document.getElementById("container2d");
            if(container2d){
                container2d.appendChild(textarea);
                log();
            }
            
        } else {
            textarea.remove();
        }
    }

    export function log(msg?: string, color?: string) {
        if (msg) {
            logs.push(`${dateFtt("[hh:mm:ss]", new Date())} ${msg}`);
        }

        if (textarea) {
            var msgs = logs
            if (logs.length > 100) {
                msgs = logs.slice(logs.length - 100);
            }
            textarea.value = msgs.join("\n");
            let { scrollHeight, clientHeight } = textarea;
            textarea.scrollTop = scrollHeight - clientHeight;
        }

    }

}

if(typeof global != "undefined"){
    global["wx"] = wx;
}

