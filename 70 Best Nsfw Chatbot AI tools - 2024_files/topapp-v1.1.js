var filters=[]
let selectedTools=[];let toolCheckbox=document.querySelectorAll('.toollistcheckbox');function loadMore(q,kw){if(loading){return;}
loading=true;let endpoint=`/next?p=${page}&q=${q}&kw=${kw}&sort=${sort}&${filters_string}`
fetch(endpoint).then(r=>r.text()).then(h=>{let el=document.getElementById('tools_gallery')
el.innerHTML+=h
if(h==''){document.getElementById('load_more').style.display='none'}
stickyBmark()
loadList()
loading=false;});page+=1
return false}
function loadPlaceHolder(e){e.target.onerror=null
e.target.src="/assets/img/placeholder.png"}
function bookmarkIt(e){let el=e.target
firebase.auth().onAuthStateChanged((user)=>{if(user){const db=firebase.firestore();let collectionName="users-bookmarks-"+user.uid
let docID=el.dataset.id
el.style.color="#ff0000"
db.collection(collectionName).doc(docID).set({title:el.dataset.title,url:'/t/'+el.dataset.id,tags:el.dataset.tags,thumbnail:el.dataset.image,website:el.dataset.website,created_at:firebase.firestore.FieldValue.serverTimestamp()}).then(()=>{console.log("Document successfully written!");el.style.color="#ff0000"
stickyBmark(docID)}).catch((error)=>{console.error("Error adding document: ",error);});}else{console.log("User isn't auth, we can't book mark.. going to /login")
window.location.href='/login';}});}
function stickyBmark(bookmarkId=null){let localBookmarks=localStorage.getItem('topAitools_bookmarks')
if(!localBookmarks){localStorage.setItem('topAitools_bookmarks',JSON.stringify({}))
localBookmarks={}}
else{localBookmarks=JSON.parse(localBookmarks)
for(k in localBookmarks){let el=document.getElementById(k)
if(el)el.style.color='#ff0000'}}
if(bookmarkId){localBookmarks[bookmarkId]=true
localStorage.setItem('topAitools_bookmarks',JSON.stringify(localBookmarks))}}
document.addEventListener("DOMContentLoaded",function(){stickyBmark()
loadList()
updateUserInteractions()});function filterTools(){let tools=document.getElementsByClassName("tool_box")
let resultsCount=0
let countSpan=document.getElementById("results_count")
for(tool of tools){for(filter of filters){if(tool.dataset.tags.split(',').includes(filter)){tool.style.display='flex'
resultsCount+=1
break}else{tool.style.display='none'}}}
if(filters.length==0){for(tool of tools){tool.style.display='flex'
resultsCount+=1}}
if(countSpan)countSpan.innerHTML=resultsCount/2}
function applyFilters(){filters=[]
let activeFilters=document.getElementsByClassName("filter-checkbox")
let filtersCollapse=document.getElementById("filters_collapse")
for(filter of activeFilters){if(filter.checked){filters.push(filter.value)}}
let bsCollapse=new bootstrap.Collapse(filtersCollapse,{toggle:false})
bsCollapse.hide()
filterTools()}
function clearFilters(){let checkFilters=document.getElementsByClassName("filter-checkbox")
let filtersCollapse=document.getElementById("filters_collapse")
for(filter of checkFilters){filter.checked=false}
let bsCollapse=new bootstrap.Collapse(filtersCollapse,{toggle:false})
bsCollapse.hide()
filters=[]
filterTools()}
function loadList(){const savedselectedTools=localStorage.getItem('selectedTools');if(savedselectedTools){selectedTools=JSON.parse(savedselectedTools);if(selectedTools.length>0){let listLink=document.getElementById("mylist-button")
if(!window.location.href.includes('/collection'))listLink.style.display='block'
setListBtnURL(selectedTools)}
selectedTools.forEach((itemId)=>{const itemElement=document.getElementById('checkboxtool-'+itemId);if(itemElement){itemElement.checked=true;}});}}
function storeToollist(event){const checkboxElement=event.target;const itemId=checkboxElement.getAttribute('data-id');if(checkboxElement.checked&&selectedTools.length<20&&!selectedTools.includes(itemId)){selectedTools.push(itemId);}
else{const index=selectedTools.indexOf(itemId);if(index!==-1){selectedTools.splice(index,1);}}
let listLink=document.getElementById("mylist-button")
if(selectedTools.length>0){localStorage.setItem('selectedTools',JSON.stringify(selectedTools));listLink.style.display='block'
setListBtnURL(selectedTools)}else{localStorage.removeItem('selectedTools');listLink.style.display='none'}}
function setListBtnURL(selectedTools){let savedList=localStorage.getItem('topAitools_saved_list');let title='Click to edit title'
let description='Click to edit description'
if(savedList){savedList=JSON.parse(savedList)
title=savedList['title']
description=savedList['description']}
let listLink=document.getElementById("mylist-button")
let cid=selectedTools.join('-')
let url=`/collection?cid=${cid}&t=${encodeURIComponent(title)}&d=${encodeURIComponent(description)}`
listLink.href=url}
function trackLink(element){var linkUrl=element.getAttribute('data-link');element.href=linkUrl+'?a=1';}
document.addEventListener('DOMContentLoaded',function(){if(document.getElementById('scrollLeft')&&document.getElementById('scrollRight')){document.getElementById('scrollLeft').addEventListener('click',function(){document.querySelector('.scrollable-container').scrollBy({left:-100,behavior:'smooth'});});document.getElementById('scrollRight').addEventListener('click',function(){document.querySelector('.scrollable-container').scrollBy({left:100,behavior:'smooth'});});}})
function toggleDescription(id,isMobile){let descriptionShort=document.getElementById(`description-${id}`);let descriptionExpanded=document.getElementById(`description-expanded-${id}`);descriptionShort.style.display='none'
descriptionExpanded.style.display='block'
let buttonElement=document.getElementById(`readMoreButton-${id}`);buttonElement.style.display='none';}
const USER_INTERACTIONS_KEY='userInteractions';const MAX_ITEMS=10;const VERSION=1;function updateUserInteractions(){try{let interactions=JSON.parse(localStorage.getItem(USER_INTERACTIONS_KEY))||{version:VERSION,tools:[],searches:[],categories:[]};if(typeof uit!=='undefined'&&uit){interactions.tools=updateUIArray(interactions.tools,uit);}
if(typeof uic!=='undefined'&&uic){interactions.categories=updateUIArray(interactions.categories,uic);}
if(typeof uist!=='undefined'&&uist){interactions.searches=updateUIArray(interactions.searches,uist);}
console.log('these are interactions',interactions);localStorage.setItem(USER_INTERACTIONS_KEY,JSON.stringify(interactions));return true;}catch(error){console.error('Error updating user interactions:',error);return false;}}
function updateUIArray(arr,newItem){const index=arr.indexOf(newItem);if(index>-1){arr.splice(index,1);}
arr.unshift(newItem);return arr.slice(0,MAX_ITEMS);}
function getUserInteractions(){try{return JSON.parse(localStorage.getItem(USER_INTERACTIONS_KEY))||{};}catch(error){console.error('Error retrieving user interactions:',error);return{};}}
function scrollLeftHandler(button,scrollerID){const scroller=document.getElementById('scroller-'+scrollerID);if(scroller){scroller.scrollBy({left:-300,behavior:'smooth'});}}
function scrollRightHandler(button,scrollerID){const scroller=document.getElementById('scroller-'+scrollerID);if(scroller){scroller.scrollBy({left:300,behavior:'smooth'});}}
function showScrollButtons(container){const leftButton=container.previousElementSibling;const rightButton=container.nextElementSibling;leftButton.classList.remove('d-none');rightButton.classList.remove('d-none');}
function hideScrollButtons(container){const leftButton=container.previousElementSibling;const rightButton=container.nextElementSibling;leftButton.classList.add('d-none');rightButton.classList.add('d-none');}