const firebaseConfig={apiKey:"AIzaSyCIkYxnqa1RS102ufSY0R-rcdrJiqCiH30",authDomain:"topaitools-88aa9.firebaseapp.com",projectId:"topaitools-88aa9",storageBucket:"topaitools-88aa9.appspot.com",messagingSenderId:"186046739198",appId:"1:186046739198:web:702ae7a88e11765d2dabaf"};var app=''
var user_id=null
window.addEventListener('load',initializeApp);async function initializeApp(){app=firebase.initializeApp(firebaseConfig);try{user_id=await isAuth();console.log("User ID:",user_id);}catch(error){console.error("Error:",error);}}
function isAuth(){return new Promise((resolve)=>{firebase.auth().onAuthStateChanged((user)=>{if(user){document.getElementById("nav-bookmarks").style.display="unset"
resolve(user.uid);}else{document.getElementById("nav-login").style.display="unset"
resolve("anonymous");}});});}
function setupNav(){firebase.auth().onAuthStateChanged((user)=>{if(user){document.getElementById("nav-bookmarks").style.display="unset"}else{document.getElementById("nav-login").style.display="unset"}});}