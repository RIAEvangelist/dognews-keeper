'use strict';

requires.js('NWJSInit','IssuuAPI','HTMLTemplates');

document.addEventListener(
    'requirementLoaded',
    initApp
);

var api,
    nw,
    templates;

function initApp(){
    if(!requires.isDOMReady || !requires.ready){
        return;
    }
   
    document.removeEventListener(
        'requirementLoaded',
        initApp
    );
    
    nw=new NWJSInit(true);
    templates=new HTMLTemplates();
    templates.find();
    
    //TODO: cache info locally
    api=new IssuuAPI('DogNews');
    api.getInfo(fillInfo);
}

function fillInfo(e){
    api.getIssues(12,populateIssues);
    document.querySelector('#displayInfo').innerHTML=templates.getString(
        templates.data.magazineInfo,
        e.target.response.rsp._content.user
    );
}

function populateIssues(e){
    var issues=e.target.response.rsp._content.stream;
    var issueList=document.querySelector('#issues');
    var exit = document.getElementById('exit-issue');
    
    var list='';
    
    issueList.addEventListener(
        'click',
        showIssue
    );
    
    exit.addEventListener(
        'click',
        exitIssue
    );
    
    for(var i=0; i<issues.length; i++){
        
        //TODO: cache info locally
        var issue=issues[i].content;
        api.getPage(issue.publicationId,issue.revisionId,1,gotThumb,'large');
        api.getPage(issue.publicationId,issue.revisionId,2,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,3,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,4,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,5,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,6,gotThumb,'medium');
        api.getPage(issue.publicationId,issue.revisionId,7,gotThumb,'medium');
        
        list+=templates.getString(
            templates.data.issue,
            issue
        );
    }
    
    issueList.innerHTML=list;
}

function exitIssue(e) {
    var content = document.getElementById('content');
    content.classList.remove('hidden');
    
    var hideExit = document.getElementById('exit-issue');
    hideExit.classList.add('hidden');
    
    var viewerCon = document.getElementById('viewerContainer');
    viewerCon.scrollLeft = 0;
    viewerCon.classList.add('hidden');

}

function gotThumb(thumb){
    var issue=document.getElementById(thumb.issue);
    var image=issue.querySelectorAll('img')[thumb.page-1];
    image.src=thumb.image;
    
    //TODO : store image, stop writing crap code...
    image.classList.remove('transparent');
}

function showIssue(e){
    var issue=e.target;
    var viewer=document.querySelector('#viewer');
    var showExit = document.getElementById('exit-issue');
    var content = document.getElementById('content');
    var viewContainer = document.getElementById('viewerContainer');
       
    var currentPage,
        pageCount,
        pages='';
    
    viewer.innerHTML='';
    
    while(!issue.id){
        issue=issue.parentElement;
    }
    var revision=issue.dataset.revision;
    api.getPage(issue.id,revision,1,populatePages);
    api.getPage(issue.id,revision,2,populatePages);
    api.getPage(issue.id,revision,3,populatePages);
    
    currentPage=3;
    pageCount=Number(issue.dataset.pages)+1;
    for(var i=currentPage; i<pageCount; i++){
        pages+=templates.data.page;
        //comply with Issuu TOC dont do stuff faster than a human can normally click
        setTimeout(
            function(){
                api.getPage(this.id,this.revision,this.page,this.callback);
            }.bind(
                {
                    id:issue.id,
                    revision:revision,
                    page:i,
                    callback:populatePages
                }
            ),
            (Math.random()*100+400 >> 0)*(i-1)
        );
    }
    viewer.style.width = 'calc(100% * '+(issue.dataset.pages +1) / 2+')';
    viewer.innerHTML=pages;
    viewContainer.classList.remove('hidden');
    content.classList.add('hidden');
    showExit.classList.remove('hidden');
}

function populatePages(issue){
    console.log(issue);
    var page=document.querySelector('#viewer>img:nth-child('+issue.page+')');
    page.src=issue.image;
    page.classList.remove('transparent');
}