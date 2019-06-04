module wx{
    //进行缓存 有audiocontext使用 没有则使用audio
    //每个对象保存30秒 超过不操作则进行销毁
    //设置缓存池 超出部分用完即销毁
    //不同浏览器支持的音频格式不一样 做下区分

    let buffers:{[key:string]:AudioBuffer} = {};
    let audios:HTMLAudioElement[] = [];

    export let createInnerAudioContext=()=>{
        return new InnerAudioContext(new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])());
    }

    export interface IAudioContextChild{
        loop:boolean;
        autoplay:boolean;
        target:any;
        starttime?:number;
        duration?:number;
    }
    export class InnerAudioContext{
        private audiocontext:AudioContext;
        private volNode:GainNode;
        autoplay:boolean = false;
        loop:boolean = false;
        private _vol:number = 1;
        private childs:{[key:string]:IAudioContextChild};
        constructor(audiocontext?:AudioContext){
            this.audiocontext = audiocontext;
            if(audiocontext){
                this.volNode = audiocontext.createGain();
                this.volNode.connect(audiocontext.destination);
            }
            this.childs = {};
        }

        set volume(val:number){
            let {volNode, childs} = this;      
            this._vol = val;
            if(volNode){
                volNode.gain.value = val;
            }else{
                for(let key in childs){
                    let {target} = childs[key];
                    if(!target.ended) target.volume = val;
                }
            }
        }

        get volume(){
            return this._vol;
        }

        set src(val:string){
            //检测一下浏览器支持的文件格式mp3 wav ogg
            let {autoplay, loop, childs, audiocontext} = this;
            // this._src = val;
            let audioObj = childs[val];
            if(audiocontext){
                let thisobj = this;
                if(audiocontext.state == "suspended"){
                    audiocontext.resume().then(()=>{
                        thisobj.src = val;
                    });
                    return;
                }
                //只能播放一次 下次播放必须重新申请
                this.childs[val] = audioObj = this.createsource(autoplay, loop);
                let buffer = buffers[val];
                if(!buffer){
                    let request = new XMLHttpRequest();
                    request.open("GET", val);
                    request.responseType = "arraybuffer";
                    request.onreadystatechange = ()=>{
                        if(request.readyState === 4){
                            if(request.status === 200){
                                audiocontext.decodeAudioData(request.response, decodeBuffer =>{
                                    audioObj.duration = decodeBuffer.duration;
                                    buffers[val] = decodeBuffer;
                                    if(audiocontext.state == "running"){
                                        thisobj.playSingle(decodeBuffer, val, autoplay, loop, true);
                                    }
                                });
                            }
                        }
                    }
                    request.send();
                }else{
                    if(audiocontext.state == "running"){
                        audioObj.starttime = new Date().getTime();
                        audioObj.duration = buffers[val].duration;
                        this.playSingle(buffers[val], val, autoplay, loop);
                    }
                }
            }else{
                if(!audioObj) this.childs[val] = audioObj = getFreeAudio(autoplay, loop);
                audioObj.target.src = val;
                if(!loop){
                    audioObj.target.onended = this.audioEnd.bind(this);
                }
            }
        }

        play(){
            let {childs, audiocontext} = this;
            if(audiocontext){
                if(audiocontext.state == "suspended"){
                    let thisobj = this;
                    audiocontext.resume().then(()=>{thisobj.play();});
                    return;
                }
            }
            for(let key in childs){
                let {target, loop, autoplay} = childs[key];
                if(target instanceof HTMLAudioElement){
                    target.play();
                }else{
                    this.playSingle(buffers[key], key, autoplay, loop);
                }
            }
        }

        pause(){
            let {audiocontext, childs} = this;
            if(audiocontext){
                audiocontext.suspend();
            }else{
                for(let key in childs){
                    let {target} = childs[key];
                    if(!target.ended) target.pause();
                }
            }
        }

        stop(){
            let {audiocontext, childs} = this;
            for(let key in childs){
                let needdel = true;
                let {target, loop} = childs[key] as IAudioContextChild;
                if(target instanceof HTMLAudioElement){
                    target.pause();
                    target.currentTime = 0;
                    target.onended = undefined;
                    if(loop){
                        needdel = false;
                    }else{
                        childs[key].target = target = undefined;
                    }
                }else{
                    //当有循环播放的音频时需要保留一下内容 在play的时候能够有东西进行播放
                    if(target){
                        target.buffer = null;
                        target.onended = undefined;
                        target.disconnect();
                        childs[key].target = target = undefined;
                    }
                    if(loop)needdel = false;
                }
                if(needdel) delete childs[key];
            }
            if(audiocontext) audiocontext.suspend();
            this.childs = childs;
        }

        destroy(){

        }

        private playSingle(data:AudioBuffer, key:string, autoplay:boolean, loop:boolean, needJump?:boolean){
            let {childs, audiocontext, volNode} = this;
            if(audiocontext){
                if(audiocontext.state == "suspended"){
                    let thisobj = this;
                    let vo = data;
                    audiocontext.resume().then(function(){
                        thisobj.playSingle(vo, key, autoplay, loop, needJump);
                    });
                    return;
                }
                if(audiocontext.state == "running"){//这里判断的原因是有启动不了的时候
                    let ctime = 0;
                    let audioObj = childs[key];
                    //删除 重新申请一次
                    childs[key] = audioObj = this.createsource(autoplay, loop, audioObj);
                    let {starttime, duration, target} = audioObj;
                    if(data){
                        if((starttime + duration) >= audiocontext.currentTime){//超出最长时间了跳过
                            console.log("超出播放区域", key, starttime, duration, audiocontext.currentTime);
                            return;
                        }
                        ctime = needJump ? (audiocontext.currentTime - starttime) : 0;
                    }else{
                        starttime = audiocontext.currentTime;
                    }
                    
                    target.buffer = data ? data : buffers[key];
                    target.connect(volNode);
                    target.start(ctime);
                }
            }
        }

        private audioEnd(e:Event){
            let _audio = e.currentTarget as HTMLAudioElement;
            let childs = this.childs;
            for(let key in childs){
                let {target} = childs[key];
                if(target == _audio){
                    _audio.onended = undefined;
                    delete childs[key];
                    break;
                }
            }
        }

        private endHandler(e:Event){
            let _audio = e.currentTarget as AudioBufferSourceNode;
            let childs = this.childs;
            for(let key in childs){
                let {target} = childs[key] as IAudioContextChild;
                if(target == _audio){
                    _audio.buffer = null;
                    _audio.onended = undefined;
                    _audio.disconnect();
                    _audio = undefined;
                    delete childs[key];
                    break;
                }
            }
        }

        private createsource(autoplay:boolean, loop:boolean, target?:IAudioContextChild) {
            let {audiocontext} = this;
            let source = audiocontext.createBufferSource();
            source.loop = loop;
            if(!loop)source.onended = this.endHandler.bind(this);
            if(target){
                let os = target.target;
                if(os){
                    os.buffer = null;
                    os.onended = undefined;
                    os.disconnect();
                    os = undefined;
                }
                target = undefined;
            }
            return {autoplay, loop, target:source, starttime:audiocontext.currentTime} as IAudioContextChild;
        }
    }

    function getFreeAudio(autoplay:boolean, loop:boolean){
        let audio;
        for (let i = 0; i < audios.length; i++) {
            audio = audios[i] as HTMLAudioElement;
            if(audio.ended || (audio.paused && audio.currentTime == 0)){
                audio.autoplay = autoplay;
                audio.loop = loop;
                return {autoplay, loop, target:audio};
            }
        }
        audio = new Audio();
        audio.autoplay = autoplay;
        audio.loop = loop;
        audios.push(audio);
        return {autoplay, loop, target:audio};
    }
}