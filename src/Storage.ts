///<reference path="./InterFace.ts" />

module wx{

    export var storageDict:{[key:string]:IStorageData} = {};

    export interface IStorageData{
        data:any;
        size:number;
        time:number;
    }

    export interface ISetStorageOption extends IActiveOption{
        key:string;
        data:any;
    }

    export interface IStorageInfo{
        keys:string[];
        currentSize:number;
        limitSize:number;
    }

    export function clearStorage(option:IActiveOption){

    }

    export function clearStorageSync(){
        storageDict = {};
    }

    export function getStorage(option:ISetStorageOption){

    }

    export function getStorageSync(key:string){
        return storageDict[key];
    }

    export function getStorageInfo(option:IActiveOption){

    }

    export function getStorageInfoSync(){
        let o = {} as IStorageInfo;
        let keys:string[] = [];
        let current = 0;
        for(let key in storageDict){
            let v = storageDict[key];
            current += v.size;
            keys.push(key);
        }
        o.keys = keys;
        o.currentSize = current;
        o.limitSize = Number.MAX_VALUE;
        return o;
    }
    

    export function setStorage(option:ISetStorageOption){

    }

    export function setStorageSync(key:string,data:IStorageData){
        storageDict[key] = data;
    }
    

    export function removeStorage(option:ISetStorageOption){

    }

    export function removeStorageSync(key:string){
        delete storageDict[key];
    }


}