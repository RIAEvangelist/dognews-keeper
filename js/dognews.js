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
        api.getPage(issue.publicationId,issue.revisionId,1,gotThumb,'large');
        api.getPage(issue.publicationId,issue.revisionId,2,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,3,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,4,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,5,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,6,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,7,gotThumb,'medium');
        console.log(issue);
        
        //I know this is bad its just a hack until I modularize it
        list+='<li id="'+
                issue.publicationId+
            '"><img class="cover transparent" src="data:jpeg;base64," /><div class="preview"><img class="transparent" src="data:jpeg;base64," /><img class="transparent" src="data:jpeg;base64," /><img class="transparent" src="data:jpeg;base64," /><img class="transparent" src="data:jpeg;base64," /><img class="transparent" src="data:jpeg;base64," /><img class="transparent" src="data:jpeg;base64," /></div><p>'+
                issue.title+
            '</p></li>';
    }
    
    issueList.innerHTML=list;
}

function gotThumb(e){
    var issue=document.getElementById(e.issue);
    var image=issue.querySelectorAll('img')[e.page-1];
    image.src=e.image;
    
    //TODO : store image, stop writing crap code...
    image.classList.remove('transparent');
}