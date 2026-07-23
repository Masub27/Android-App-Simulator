import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/webxr/VRButton.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const lessons = [
  {
    id:1,title:'Check Java 17',type:'TERMINAL',view:'terminal',
    description:'Confirm that the required Java version is installed before building the Android project.',
    focus:'Type and execute java -version',
    expected:'The Terminal shows OpenJDK version 17.',
    command:'java -version',
    output:'openjdk version "17.0.12" 2024-07-16\nOpenJDK Runtime Environment Temurin-17.0.12+7\nOpenJDK 64-Bit Server VM',
    sequence:['type','execute','output']
  },
  {
    id:2,title:'Inspect the project folder',type:'TERMINAL',view:'terminal',
    description:'Verify that Terminal is inside the correct Android project directory.',
    focus:'Run pwd and list the project files',
    expected:'The Android project path and core files appear.',
    command:'pwd && ls',
    output:'/Users/student/AndroidStudioProjects/LiaScriptApp\napp  build.gradle.kts  gradle  gradlew  settings.gradle.kts',
    sequence:['type','execute','output']
  },
  {
    id:3,title:'Review Android project files',type:'ANDROID STUDIO',view:'studio',
    description:'Open Android Studio and inspect the generated Android project structure.',
    focus:'Locate MainActivity.kt and AndroidManifest.xml',
    expected:'The app, manifests, kotlin, and resource folders are visible.',
    tree:'LiaScriptApp\n├─ app\n│  ├─ manifests\n│  │  └─ AndroidManifest.xml\n│  ├─ kotlin\n│  │  └─ com.example.liascriptapp\n│  │     └─ MainActivity.kt\n│  └─ res\n├─ Gradle Scripts\n└─ settings.gradle.kts',
    tab:'Project',
    code:'Select app > kotlin > com.example.liascriptapp > MainActivity.kt',
    sequence:['tree']
  },
  {
    id:4,title:'Add Internet permission',type:'ANDROID STUDIO',view:'studio',
    description:'Allow the application to load the online LiaScript course inside WebView.',
    focus:'Add INTERNET permission to AndroidManifest.xml',
    expected:'AndroidManifest.xml contains the INTERNET permission.',
    tree:'app\n├─ manifests\n│  └─ AndroidManifest.xml\n└─ kotlin\n   └─ MainActivity.kt',
    tab:'AndroidManifest.xml',
    code:'<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n\n    <uses-permission android:name="android.permission.INTERNET" />\n\n    <application\n        android:theme="@style/Theme.LiaScriptApp">\n        <activity\n            android:name=".MainActivity"\n            android:exported="true">\n        </activity>\n    </application>\n</manifest>',
    sequence:['tree','code']
  },
  {
    id:5,title:'Create the WebView activity',type:'ANDROID STUDIO',view:'studio',
    description:'Add the complete Kotlin code that loads the LiaScript course in a WebView.',
    focus:'Type the full MainActivity.kt code',
    expected:'MainActivity creates a WebView and loads the LiaScript URL.',
    tree:'app\n├─ manifests\n│  └─ AndroidManifest.xml\n└─ kotlin\n   └─ com.example.liascriptapp\n      └─ MainActivity.kt',
    tab:'MainActivity.kt',
    code:'package com.example.liascriptapp\n\nimport android.os.Bundle\nimport android.webkit.WebView\nimport android.webkit.WebViewClient\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n\n        val webView = WebView(this)\n        webView.settings.javaScriptEnabled = true\n        webView.webViewClient = WebViewClient()\n        webView.loadUrl(\n            "https://liascript.github.io/course/?YOUR_RAW_GITHUB_URL"\n        )\n\n        setContentView(webView)\n    }\n}',
    sequence:['tree','code']
  },
  {
    id:6,title:'Build the debug APK',type:'TERMINAL',view:'terminal',
    description:'Execute Gradle and compile the complete Android application.',
    focus:'Run ./gradlew assembleDebug',
    expected:'The build finishes with BUILD SUCCESSFUL.',
    command:'./gradlew assembleDebug',
    output:'> Task :app:checkDebugAarMetadata\n> Task :app:compileDebugKotlin\n> Task :app:mergeDebugResources\n> Task :app:packageDebug\n> Task :app:assembleDebug\n\nBUILD SUCCESSFUL in 18s\n34 actionable tasks: 34 executed',
    sequence:['type','execute','output','success']
  },
  {
    id:7,title:'Locate the generated APK',type:'TERMINAL',view:'terminal',
    description:'Find the exact output location of the generated debug APK.',
    focus:'Search the APK output directory',
    expected:'Terminal displays app-debug.apk.',
    command:'find app/build/outputs/apk -name "*.apk"',
    output:'app/build/outputs/apk/debug/app-debug.apk',
    sequence:['type','execute','output']
  },
  {
    id:8,title:'Install and open the app',type:'ANDROID PHONE',view:'phone',
    description:'Install the generated APK and launch the LiaScript application.',
    focus:'Transfer, install, and open the APK',
    expected:'The LiaScript course opens on the Android phone.',
    command:'adb install -r app/build/outputs/apk/debug/app-debug.apk',
    output:'Performing Streamed Install\nSuccess',
    sequence:['install','phone']
  }
];

const state={lesson:1,running:false,paused:false,voice:true,speed:1,timers:[]};

const wrap=$('#canvasWrap');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x020617);
scene.fog=new THREE.FogExp2(0x020617,.03);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,200);
camera.position.set(0,3,14);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.xr.enabled=true;
wrap.appendChild(renderer.domElement);
const vrButton=VRButton.createButton(renderer);
vrButton.style.display='none';
document.body.appendChild(vrButton);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.enablePan=false;
controls.target.set(0,2.3,-3);

scene.add(new THREE.HemisphereLight(0x8be9ff,0x09111d,2));
const key=new THREE.DirectionalLight(0xffffff,3);
key.position.set(7,12,8);key.castShadow=true;scene.add(key);
const cLight=new THREE.PointLight(0x22d3ee,50,22,2);cLight.position.set(-6,5,1);scene.add(cLight);
const pLight=new THREE.PointLight(0x8b5cf6,42,22,2);pLight.position.set(6,4,-4);scene.add(pLight);

function mesh(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
const floor=mesh(new THREE.PlaneGeometry(34,34),new THREE.MeshStandardMaterial({color:0x0a1220,roughness:.38,metalness:.62}),0,0,0);floor.rotation.x=-Math.PI/2;
const grid=new THREE.GridHelper(34,34,0x1f8ba0,0x172033);grid.position.y=.012;grid.material.opacity=.22;grid.material.transparent=true;scene.add(grid);
mesh(new THREE.BoxGeometry(18,8,.35),new THREE.MeshStandardMaterial({color:0x111c2e}),0,4,-8);
for(let i=-7;i<=7;i+=2){const s=mesh(new THREE.BoxGeometry(.055,6,.38),new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:1.25}),i,4,-7.78)}
mesh(new THREE.BoxGeometry(13,.35,5.5),new THREE.MeshStandardMaterial({color:0x182238,metalness:.5,roughness:.35}),0,.2,-1.2);
mesh(new THREE.BoxGeometry(7.5,.32,2.5),new THREE.MeshStandardMaterial({color:0x714a2f,roughness:.55}),0,1.15,-2.5);
mesh(new THREE.BoxGeometry(5.8,3.4,.34),new THREE.MeshStandardMaterial({color:0x050914,metalness:.75,roughness:.2}),0,3.12,-2.78);
const screen=mesh(new THREE.BoxGeometry(5.3,2.92,.08),new THREE.MeshStandardMaterial({color:0x071827,emissive:0x072c43,emissiveIntensity:.65}),0,3.12,-2.58);
mesh(new THREE.BoxGeometry(.35,1.25,.35),new THREE.MeshStandardMaterial({color:0x111827,metalness:.7}),0,1.65,-2.75);
mesh(new THREE.BoxGeometry(1.8,.15,.9),new THREE.MeshStandardMaterial({color:0x111827,metalness:.7}),0,1.02,-2.65);
const phone3d=mesh(new THREE.BoxGeometry(.7,1.4,.1),new THREE.MeshStandardMaterial({color:0x05070c,metalness:.7,roughness:.18}),3.25,1.92,-2.35);phone3d.rotation.z=-.14;
const phoneScreen3d=mesh(new THREE.BoxGeometry(.56,1.12,.04),new THREE.MeshStandardMaterial({color:0x0a86a8,emissive:0x0a86a8,emissiveIntensity:.8}),3.25,1.92,-2.28);phoneScreen3d.rotation.z=-.14;
const holo=new THREE.Mesh(new THREE.TorusGeometry(1.1,.05,16,120),new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:2}));holo.position.set(0,5.4,-2.2);holo.rotation.x=Math.PI/2;scene.add(holo);
const core=new THREE.Mesh(new THREE.OctahedronGeometry(.72),new THREE.MeshStandardMaterial({color:0x8b5cf6,emissive:0x8b5cf6,emissiveIntensity:1.4,metalness:.45,roughness:.2}));core.position.set(0,5.4,-2.2);scene.add(core);

const inst=new THREE.Group();
const b=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.35,8,16),new THREE.MeshStandardMaterial({color:0x2563eb,metalness:.3,roughness:.35}));b.position.y=1.5;inst.add(b);
const h=new THREE.Mesh(new THREE.SphereGeometry(.48,32,24),new THREE.MeshStandardMaterial({color:0xd8f4ff}));h.position.y=2.85;inst.add(h);
const visor=new THREE.Mesh(new THREE.BoxGeometry(.7,.18,.08),new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:1.6}));visor.position.set(0,2.88,.43);inst.add(visor);
inst.position.set(4.5,0,-1.2);inst.rotation.y=-.45;scene.add(inst);

const lessonItems=$('#lessonItems');
lessons.forEach(l=>{
  const btn=document.createElement('button');
  btn.className='lesson-item';
  btn.innerHTML=`<span>${String(l.id).padStart(2,'0')}</span><div><b>${l.title}</b><small>${l.type}</small></div>`;
  btn.onclick=()=>loadLesson(l.id);
  lessonItems.appendChild(btn);
  const opt=document.createElement('option');
  opt.value=l.id;opt.textContent=`${l.id}. ${l.title}`;$('#lessonSelect').appendChild(opt);
});

function current(){return lessons.find(l=>l.id===state.lesson)}
function clearTimers(){state.timers.forEach(clearTimeout);state.timers=[]}
function later(fn,ms){const id=setTimeout(fn,ms*state.speed);state.timers.push(id);return id}
function speak(text){if(!state.voice||!('speechSynthesis'in window)||!text)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.86;u.lang='en-US';speechSynthesis.speak(u)}
function showView(name){$$('.workspace-view').forEach(v=>v.classList.remove('active'));$(`#${name}View`).classList.add('active')}
function setLines(text){$('#lineNumbers').textContent=text.split('\n').map((_,i)=>i+1).join('\n')}
function typeText(el,text,speed=30,done){el.textContent='';let i=0;const tick=()=>{if(!state.running||state.paused)return;el.textContent+=text[i++]||'';if(i<=text.length)later(tick,speed);else if(done)done()};tick()}
function pressEnter(){$('#enterKey').classList.add('press');later(()=>$('#enterKey').classList.remove('press'),350)}
function toast(text){$('#achievement').textContent=`🏆 ${text}`;$('#achievement').classList.add('show');later(()=>$('#achievement').classList.remove('show'),2200)}
function success(){ $('#successBurst').classList.add('show'); later(()=>$('#successBurst').classList.remove('show'),2400)}

function loadLesson(id){
  clearTimers();state.running=false;state.paused=false;state.lesson=Number(id);
  const l=current();
  $('#lessonSelect').value=l.id;
  $('#lessonCounter').textContent=`${l.id} / ${lessons.length}`;
  $('#workspaceType').textContent=l.type;
  $('#workspaceTitle').textContent=l.title;
  $('#sceneLabel').textContent=l.title;
  $('#narrationTitle').textContent=l.title;
  $('#narrationText').textContent=l.description;
  $('#focusText').textContent=l.focus;
  $('#expectedText').textContent=l.expected;
  $('#fullCommand').textContent=l.command||'No Terminal command in this lesson';
  $('#stepStatus').textContent='Ready';
  $('#subtitle').textContent='Press Play to start this module.';
  $('#progressFill').style.width=`${((l.id-1)/lessons.length)*100}%`;
  $$('.lesson-item').forEach((b,i)=>b.classList.toggle('active',i===l.id-1));
  $('#terminalOutput').textContent='';
  $('#terminalCommand').textContent='';
  $('#projectTree').textContent='';
  $('#codeEditor').textContent='';
  $('#lineNumbers').textContent='';
  $('#buildOutput').textContent='';
  $('#installFill').style.width='0%';
  $('#phoneTitle').textContent='Android device';
  $('#phoneText').textContent='Ready for installation';
  showView('desktop');
  const url=new URL(location.href);url.searchParams.set('lesson',l.id);history.replaceState({},'',url);
}

function runLesson(){
  clearTimers();state.running=true;state.paused=false;
  const l=current();
  $('#stepStatus').textContent='Playing';
  speak(l.description+' '+l.focus);
  showView(l.view);

  if(l.sequence.includes('type')){
    $('#terminalOutput').textContent='';
    typeText($('#terminalCommand'),l.command,55,()=>{
      later(()=>{pressEnter();$('#subtitle').textContent=`Executing: ${l.command}`;speak(`Executing ${l.command}`)},350);
      later(()=>typeText($('#terminalOutput'),l.output,12,()=>{
        $('#stepStatus').textContent='Completed';
        $('#progressFill').style.width=`${(l.id/lessons.length)*100}%`;
        if(l.sequence.includes('success')) success();
        toast(`${l.title} completed`);
      }),900);
    });
  }else if(l.sequence.includes('tree')){
    $('#projectTree').textContent='';
    $('#codeEditor').textContent='';
    typeText($('#projectTree'),l.tree,18,()=>{
      if(l.sequence.includes('code')){
        $('#editorTab').textContent=l.tab;
        setLines(l.code);
        later(()=>typeText($('#codeEditor'),l.code,7,()=>{
          $('#stepStatus').textContent='Completed';
          $('#progressFill').style.width=`${(l.id/lessons.length)*100}%`;
          toast(`${l.title} completed`);
        }),500);
      }else{
        $('#editorTab').textContent=l.tab;
        $('#codeEditor').textContent=l.code;
        setLines(l.code);
        $('#stepStatus').textContent='Completed';
        $('#progressFill').style.width=`${(l.id/lessons.length)*100}%`;
        toast(`${l.title} completed`);
      }
    });
  }else if(l.sequence.includes('install')){
    showView('terminal');
    typeText($('#terminalCommand'),l.command,45,()=>{
      later(()=>pressEnter(),250);
      later(()=>typeText($('#terminalOutput'),l.output,18,()=>{
        showView('phone');
        $('#phoneTitle').textContent='Installing LiaScript App';
        $('#phoneText').textContent='Transferring APK to Android device…';
        $('#installFill').style.width='100%';
        later(()=>{
          $('#phoneTitle').textContent='Installation complete';
          $('#phoneText').textContent='The LiaScript Android application is ready.';
          $('#stepStatus').textContent='Completed';
          $('#progressFill').style.width='100%';
          toast('Training completed');
        },2300);
      }),700);
    });
  }
}

$('#phoneAppBtn').onclick=()=>{
  $('#phoneTitle').textContent='German A1 Training';
  $('#phoneText').textContent='LiaScript course loaded successfully inside Android WebView.';
};
$('#startBtn').onclick=()=>{$('#introOverlay').style.display='none';runLesson()};
$('#skipBtn').onclick=()=>{$('#introOverlay').style.display='none';loadLesson(1);showView('desktop')};
$('#tourBtn').onclick=runLesson;
$('#pauseBtn').onclick=()=>{state.paused=true;state.running=false;clearTimers();if('speechSynthesis'in window)speechSynthesis.cancel();$('#stepStatus').textContent='Paused';$('#subtitle').textContent='Paused. Press Replay to restart this module.'};
$('#replayBtn').onclick=()=>{loadLesson(state.lesson);later(runLesson,300)};
$('#voiceBtn').onclick=()=>{state.voice=!state.voice;$('#voiceBtn').textContent=state.voice?'🔊 Voice':'🔇 Muted';$('#voiceStatus').textContent=state.voice?'On':'Off';if(!state.voice&&'speechSynthesis'in window)speechSynthesis.cancel()};
$('#fullscreenBtn').onclick=async()=>{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()};
$('#vrBtn').onclick=()=>vrButton.click();
$('#lessonSelect').onchange=e=>loadLesson(e.target.value);
$('#speedSelect').onchange=e=>state.speed=Number(e.target.value);
$('#copyCommand').onclick=async()=>{await navigator.clipboard.writeText($('#fullCommand').textContent);$('#copyCommand').textContent='Copied';later(()=>$('#copyCommand').textContent='Copy',900)};

window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const clock=new THREE.Clock();
function render(){
  const t=clock.getElapsedTime();
  holo.rotation.z=t*.5;core.rotation.x=t*.3;core.rotation.y=t*.62;core.position.y=5.4+Math.sin(t*1.4)*.12;inst.position.y=Math.sin(t*1.5)*.03;
  controls.update();renderer.render(scene,camera);
}
renderer.setAnimationLoop(render);
setTimeout(()=>$('#loading').classList.add('hidden'),850);
setTimeout(()=>$('#loading').style.display='none',1500);
loadLesson(Number(new URL(location.href).searchParams.get('lesson'))||1);
