'use strict';

requires.js('IssuuAPI');

document.addEventListener(
    'DOMContentLoaded',
    initApp
);

function initApp(){
    if(!requires.ready){
        document.addEventListener(
            'allRequirementsLoaded',
            initApp
        );
        return;
    }
    document.removeEventListener(
        'allRequirementsLoaded',
        initApp
    );
    var api=new IssuuAPI('DogNews');
    api.getInfo(fillInfo);
}

function fillInfo(e){
    var usedKeys=['about','companyName','displayName','documentCount','web'];
    for(var i=0; i<usedKeys.length; i++){
        var el=document.getElementById(usedKeys[i]);
        var content=e.target.response.rsp._content.user[usedKeys[i]];
        if(!el || !content){
            continue;
        }
        el.innerHTML=content;
        if(usedKeys[i]=='web'){
            el.href='http://'+content;
        }
    }
}