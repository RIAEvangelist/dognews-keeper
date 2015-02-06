'use strict';

requires('Template','XHR2');

function HTMLTemplate(){
    Object.defineProperty(
        this,
        '_template',
        {
            value:new Template()
        }
    );
    
    Object.defineProperties(
        this,
        {
            find:{
                value:findTemplates,
                enumerable:true
            },
            fill:{
                value:template.fill,
                enumerable:true
            },
            createFromHTML:{
                value:createTemplateHTML,
                enumerable:true
            },
            createFromString:{
                value:createTemplateString,
                enumerable:true
            },
            fetch:{
                value:getExternal,
                enumerable:true
            },
            data:{
                value:{},
                enumerable:true,
                writeable:true
            }
        }
    );
    
    function getExternal(path){
        //TODO: implement fetching templates
    }
    
    function createTemplateString(string,templateID){
        var template,
            src;
        if(!string){
            return false;
        }
        
        template=document.createElement('template');
        template.id=templateID+'-template';
        template.innerHTML=string;
        
        this.data.templateID=string;
        
        return template;
    }
    
    function createTemplateHTML(selector,templateID){
        var template,
            src;
        if(!selector){
            return false;
        }
        
        src=document.querySelector(selector);
        if(!src){
            return false;
        }
        
        template=document.createElement('template');
        template.id=templateID+'-template';
        template.appendChild(src);
        
        this.data.templateID=template.innerHTML;
        
        return template;
    }
    
    function findTemplates(selector){
        var templates;
        if(!selector){
            selector='body';
        }
        selector+=' template';
        
        templates=document.querySelectorAll(selector);
        
        if(!templates){
            return false;
        }
        
        for(var i=0; i<templates.length; i++){
            var template=templates[i];
            this.data[template.id]=template[i].innerHTML;
        }
        
        return this.data;
    }
}