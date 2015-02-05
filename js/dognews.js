'use strict';

requires.js('IssuuAPI');

document.addEventListener(
    'DOMContentLoaded',
    initApp
);

var api;

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
    api=new IssuuAPI('DogNews');
    api.getInfo(fillInfo);
}

function fillInfo(e){
    var usedKeys=['about','companyName','displayName','documentCount','web'];
    api.getIssues(12,populateIssues);
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

function populateIssues(e){
    var issues=e.target.response.rsp._content.stream;
    var issueList=document.querySelector('#issues');
    var list='';
    
    for(var i=0; i<issues.length; i++){
        var issue=issues[i].content;
        api.getPage(issue.publicationId,issue.revisionId,1,gotThumb,'medium');
        console.log(issue);
        list+='<li><img class="transparent" id="'+
                issue.publicationId+
            '" src="data:jpeg;base64," /><p>'+
                issue.title+
            '</p></li>';
    }
    
    issueList.innerHTML=list;
}

function gotThumb(e){
    var image=document.getElementById(e.issue);
    image.src=e.image;
    //TODO : store image 
    image.classList.remove('transparent');
}