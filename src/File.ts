module wx{

    export interface ISavedFileListItemData{
        filePath:string;
        size:number;
        createTime:number;
    }

    export interface ISavedFileListData{
        fileList:ISavedFileListItemData[];
    }


    export interface IFileInfoData{
        size:number;
    }


    export interface IFileOption extends IActiveOption{
        path:string;
        filePath:string;
        encoding:string; //ascii    base64  binary  hex	    ucs2/ucs-2/utf16le/utf-16le	以小端序读取    utf-8/utf8  latin1
        oldPath:string;
        newPath:string;
        data:string|ArrayBuffer;
    }

    export interface IZipOption extends IActiveOption{
        zipFilePath:string;
        targetPath:string;
    }


    export interface IDirOption extends IActiveOption{
        dirPath:string;
    }


    export const enum env{
        USER_DATA_PATH = ""
    }


    export function getFileSystemManager():FileSystemManager{
        return undefined;
    }

    export class FileSystemManager{

        /**
         * 在文件结尾追加内容
         * @param filePath 
         * @param data 
         * @param encoding 
         */
        appendFileSync( filePath:string,  data:string|ArrayBuffer, encoding:string){

        }

        /**
         * 判断文件/目录是否存在
         * @param path 
         */
        accessSync(path:string){
            return false;
        }

        /**
         * 复制文件
         * @param srcPath 
         * @param destPath 
         */
        copyFileSync(srcPath:string,destPath:string){

        }


        /**
         * 获取该小程序下已保存的本地缓存文件列表
         * @param option 
         */
        getSavedFileList(option:IActiveOption){

        }


        /**
         * 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
         * @param option 
         * return size:number
         */
        getFileInfo(option:IFileOption){

        }

        /**
         * 删除该小程序下已保存的本地缓存文件
         * @param option 
         */
        removeSavedFile(option:IFileOption){

        }


        /**
         *  创建目录
         *  fail no such file or directory ${dirPath}	上级目录不存在
            fail permission denied, open ${dirPath}	指定的 filePath 路径没有写权限
            fail file already exists ${dirPath}	有同名文件或目录
         */
        mkdir(option:IDirOption){

        }

        mkdirSync(dirPath:string){

        }

        /**
         * 读取本地文件内容
         * @param filePath 
         * @param encoding 
         *  error:
         *      fail no such file or directory, open ${filePath}	指定的 filePath 所在目录不存在
         *      fail permission denied, open ${dirPath}	            指定的 filePath 路径没有读权限
         */
        readFile(option:IFileOption){

        }

        /**
         * 写文件
         * @param option 
         * @param filePath	string		是	要写入的文件路径
         * @param data	string/ArrayBuffer		是	要写入的文本或二进制数据
         * @param encoding	string	utf8	否	指定写入文件的字符编码	
         * @error
         *  fail no such file or directory, open ${filePath}	指定的 filePath 所在目录不存在
            fail permission denied, open ${dirPath}	指定的 filePath 路径没有写权限      
         */
        writeFile(option:IFileOption){

        }



        /**
         * 读取目录内文件列表
         * @param option 
         */
        readdir(option:IDirOption){

        }


        /**
            删除目录
        * @param option 
        *   fail no such file or directory ${dirPath}	目录不存在
            fail directory not empty	                目录不为空
            fail permission denied, open ${dirPath}	    指定的 dirPath 路径没有写权限
        */
        rmDir(option:IDirOption){

        }

        /**
         * 重命名文件，可以把文件从 oldPath 移动到 newPath
         * @param option 
         *  fail permission denied, rename ${oldPath} -> ${newPath}	指定源文件或目标文件没有写权限
            fail no such file or directory, rename ${oldPath} -> ${newPath}	源文件不存在，或目标文件路径的上层目录不存在
         */
        rename(option:IFileOption){

        }


        /**
         * 获取文件 Stats 对象
         * @param option 
         * @param path 文件/目录路径
         */
        stat(option:IFileOption){

        }
        statSync(path:string){
            
        }

        /**
         * 删除文件
         * @param option 
         * @param filePath  	要删除的文件路径
         */
        unlink(option:IFileOption){

        }



        unzip(option:IZipOption){
            
        }

    }

    export class Stats{
        /**
         * 文件的类型和存取的权限，对应 POSIX stat.st_mode
         */
        model:string;

        /**
         * 文件大小，单位：B，对应 POSIX stat.st_size
         */
        size:number;

        /**
         * 文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atime
         */
        lastAccessedTime:number;

        /**
         * 文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtime
         */
        lastModifiedTime:number;


        /**
         * 判断当前文件是否一个目录
         */
        isDirectory(){

        }

        /**
         * 判断当前文件是否一个普通文件
         */
        isFile(){

        }


    }
}