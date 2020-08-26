let net=require('net')
const ReadyState={UNSENT:0, //代理被创建，尚未调用open（）方法
    OPEND:1,//open方法已被调用
    HEADERS_RECEIVED:2,//send方法已被调用
    LOADING:3,//正在解析响应内容
    DONE:4//完成响应，可在客户端调用
}

class XMLHTTPRequest{
    constructor(){
        this.readyState=ReadyState.UNSENT
        this.headers={}
    }
    open(method,url){
        this.method=method||'GET'
        this.url=url;
        let {hostname,port,path}=require('url').parse(url)
        this.hostname=hostname
        this.port=port
        this.path=path;
        this.headers.Host=`${hostname}:${port}`
        const socket=this.socket=net.createConnection({port:this.port,hostname:this.hostname},()=>{
            socket.on('data',data=>{
                data=data.toString()
                let [response,bodyRows]=data.split('\r\n\r\n')
                let [statusLine,...headerRows]=response.split('\r\n')
                let [,status,statusText]=statusLine.split(' ')
                this.status=status;
                this.statusText=statusText
                this.responseHeaders=headerRows.reduce((memo,row)=>{
                    let [key,value]=row.split(': ')
                    memo[key]=value;
                    return memo
                },{})
                this.readyState=ReadyState.HEADERS_RECEIVED;
                xhr.onreadystatechange&&xhr.onreadystatechange()
                this.readyState=ReadyState.LOADING;
                xhr.onreadystatechange&&xhr.onreadystatechange()
                let [,body,]=bodyRows.split('\r\n')
                this.response=this.responseText=body;
                this.readyState=ReadyState.DONE
                xhr.onreadystatechange&&xhr.onreadystatechange()
                this.onload&&this.onload()
            })
            socket.on('error',err=>{
                this.onerror&&this.onerror(err)
            })
        })
        this.readyState=ReadyState.OPEND
        xhr.onreadystatechange&&xhr.onreadystatechange()
    }
     getAllResponseHeaders(){let allResponseHeaders='';
    for(let key in this.responseHeaders){allResponseHeaders+=`${key}: ${this.responseHeaders[key]}\r\n`;}
    return allResponseHeaders;}    
    
    setRequestHeader(header,value){this.headers[header]= value;} 

     send() {let rows = [];
        rows.push(`${this.method} ${this.path} HTTP/1.1`);
        rows.push(...Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`));     
        this.socket.write(rows.join('\r\n')+'\r\n\r\n');} 
}

let xhr=new XMLHTTPRequest()
xhr.onreadystatechange=function(){
    console.log(xhr.readyState)
}
xhr.open('POST','http://localhost:8000/get')
xhr.responseText='text'
xhr.setRequestHeader('age', '10'); 
xhr.onload = () => {console.log('readyState',xhr.readyState);   
    console.log('status',xhr.status); 
    console.log('statusText',xhr.statusText); 
    console.log('getAllResponseHeaders',xhr.getAllResponseHeaders());   
    console.log('response',xhr.response); }; 
   xhr.send();

