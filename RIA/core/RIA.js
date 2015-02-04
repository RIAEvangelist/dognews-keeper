'use strict';

var requires=new Requires();

function Requires(){    
    Object.defineProperties(
        this,
        {
            ready:{
                value:false,
                writable:true
            },
            js:{
                value:requireJS,
                enumerable:true
            },
            html:{
                value:requireHTML,
                enumerable:true
            },
            css:{
                value:requireCSS,
                enumerable:true
            },
            events:{
                value:new RIAEvents()
            },
            _data:{
                value:{
                    HTML:{},
                    CSS:{}
                },
                writable:true
            },
            _requirements:{
                value:0,
                writable:true
            },
            _head:{
                value:document.querySelector('head')
            },
            _config:{
                value:document.querySelector('#RIAJS').dataset,
                writable:true
            },
            _test:{
                value:testReady
            }
        }
    );

    if(!this._config.path){
        this._config.path='/';
    }

    if(!this._config.method){
        this._config.method='GET';
    }

    if(!this._config.timeout){
        this._config.timeout=800;
    }
    
    document.addEventListener(
        'requirementLoaded',
        this._test.bind(this)
    )
    
    function requireJS(){
        var requirements=arguments;
        for(var i=0; i<requirements.length; i++){
            if(window[requirements[i]]){
                continue;
            }
            this._requirements++;
            var required=new XHR2(
                this._config.path+'RIA/js/'+requirements[i]+'.js',
                this._config.method, 
                'text', 
                this._config.timeout
            );
            
            required.xhr.requires=this;
            required.xhr.requirementName=requirements[i];
            
            required.on(
                'load',
                function(response){
                    var requirement=document.createElement('script');
                    requirement.setAttribute("type","text/ecmascript")
                    requirement.innerHTML=this.responseText;
                    this.requires._head.appendChild(requirement);
                    this.requires._requirements--;
                    this.requires.events.emit(
                        'requirementLoaded',
                        response
                    );
                }
            );

            required.on(
                'error',
                function(response){
                    console.log('err')
                }
            );

            required.on(
                'timeout',
                function(response){
                    console.log('timeout');
                }
            );
            
            required.fetch();
        }
    }
    
    function testReady(){
        this.ready=false;
        if(this._requirements>0){
            return;
        }
        this.ready=true;
        this.events.emit(
            'allRequirementsLoaded'
        );
    }
    
    function requireHTML(){
        var requirements=arguments;
        for(var i=0; i<arguments.length; i++){
            if(this._data.HTML[i]){
                return;
            }
            this._requirements++;

        }
    }

    function requireCSS(){
        var requirements=arguments;
        for(var i=0; i<arguments.length; i++){
            if(this._data.HTML[i]){
                return;
            }
            this._requirements++;

        }
    }
}

function XHR2(url, type, responseType, timeout){
    Object.defineProperties(
        this,
        {
            on:{
                value:bindEvent,
                enumerable:true
            },
            fetch:{
                value:fetch,
                enumerable:true
            }
        }
    );

    if(!url || typeof url != 'string'){
        throw('XHR2 class requires url as first paramater')
    }

    if(typeof responseType=='number'){
        timeout=responseType;
        responseType=null;
    }

    if(typeof type == 'number'){
        timeout=type;
        type=null;
    }

    if(!type){
        type='GET';
    }

    if(!responseType){
        responseType='json';
    }

    this.xhr = new XMLHttpRequest();
    this.xhr.open(type, url, true);
    this.xhr.responseType = responseType;
    
    function fetch(){
        this.xhr.send();
    }
    
    function bindEvent(type,callback){
        this.xhr.addEventListener(type,callback);
    }
}

function RIAEvents(){
    Object.defineProperties(
        this,
        {
            emit:{
                value:emitEvent,
                enumerable:true
            },
            create:{
                value:createEvent,
                enumerable:true
            }
        }
    );
    
    function createEvent(type,data){
        data=data||{};
        var event=new CustomEvent(
            type,
            data
        );
        return event;
    }
    
    function emitEvent(type, data){
        var event;
        if(typeof type=='string'){
            event=this.create(type,data);
        }
        
        document.dispatchEvent(event);
    }
}