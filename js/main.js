import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/webxr/VRButton.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const modules=[
{id:1,title:'Laboratory orientation',type:'XR LAB',view:'architecture',description:'Enter the immersive laboratory and identify the complete Android learning environment.',focus:'Observe the instructor, dual monitors, keyboard, Android phone, and holographic workflow.',expected:'Explain the purpose of each virtual device.',command:'LiaScript → Android Studio → Gradle → APK → Android device',camera:'overview',sequence:'orientation',practice:'Name the five main parts of the Android workflow.',answer:'liascript android studio gradle apk android device'},
{id:2,title:'Open the development tools',type:'DESKTOP',view:'desktop',description:'Watch the instructor walk to the desk and open Terminal and Android Studio using the animated mouse.',focus:'Follow the mouse and observe the application launch sequence.',expected:'Recognize when Terminal and Android Studio are needed.',command:'Open Terminal and Android Studio',camera:'workstation',sequence:'desktop',practice:'Which tool is used to run shell commands?',answer:'terminal'},
{id:3,title:'Verify the environment',type:'TERMINAL',view:'terminal',description:'Check Java, ADB, and Gradle before modifying the Android project.',focus:'Execute three environment verification commands.',expected:'Confirm Java 17, ADB, and Gradle are available.',command:'java -version && adb version && ./gradlew --version',output:'openjdk version "17.0.12"\nAndroid Debug Bridge version 1.0.41\nGradle 8.7\nKotlin 1.9.22',camera:'workstation',sequence:'terminal',practice:'java -version',answer:'java -version'},
{id:4,title:'Inspect the Android project',type:'ANDROID STUDIO',view:'studio',description:'Navigate through the Android project tree and open the required project files.',focus:'Open AndroidManifest.xml, MainActivity.kt, and build.gradle.kts.',expected:'Locate the files responsible for permissions, app logic, and build configuration.',command:'AndroidManifest.xml · MainActivity.kt · build.gradle.kts',camera:'workstation',sequence:'tree',practice:'Which file contains Android permissions?',answer:'androidmanifest.xml'},
{id:5,title:'Configure AndroidManifest',type:'ANDROID STUDIO',view:'studio',description:'Add Internet permission and confirm that MainActivity can launch correctly.',focus:'Insert INTERNET permission and android:exported="true".',expected:'The app can access the internet and start from the launcher.',command:'AndroidManifest.xml',camera:'workstation',sequence:'manifest',practice:'<uses-permission android:name="android.permission.INTERNET" />',answer:'<uses-permission android:name="android.permission.INTERNET" />'},
{id:6,title:'Build the WebView activity',type:'ANDROID STUDIO',view:'studio',description:'Create the complete MainActivity code and examine each important line.',focus:'Enable JavaScript, set WebViewClient, load LiaScript, and display the WebView.',expected:'Understand how the Android app loads the online course.',command:'MainActivity.kt',camera:'workstation',sequence:'kotlin',practice:'webView.settings.javaScriptEnabled = true',answer:'webview.settings.javascriptenabled = true'},
{id:7,title:'Review the LiaScript course',type:'BROWSER',view:'browser',description:'Open the LiaScript course and verify that the URL works before building the APK.',focus:'Check that the course loads and contains the required learning media.',expected:'Confirm the course URL is ready for Android WebView.',command:'https://liascript.github.io/course/?YOUR_RAW_GITHUB_URL',camera:'workstation',sequence:'browser',practice:'Why must the URL be tested before building?',answer:'to confirm the course loads'},
{id:8,title:'Build the APK',type:'TERMINAL',view:'terminal',description:'Run the Gradle build and watch every major task complete.',focus:'Execute ./gradlew clean and ./gradlew assembleDebug.',expected:'Produce app-debug.apk with BUILD SUCCESSFUL.',command:'./gradlew clean && ./gradlew assembleDebug',output:'> Task :app:clean\n> Task :app:compileDebugKotlin\n> Task :app:mergeDebugResources\n> Task :app:packageDebug\n> Task :app:assembleDebug\n\nBUILD SUCCESSFUL in 18s\n34 actionable tasks: 34 executed',camera:'workstation',sequence:'build',practice:'./gradlew assembleDebug',answer:'./gradlew assembledebug'},
{id:9,title:'Install on Android',type:'ANDROID DEVICE',view:'phone',description:'Transfer the APK to the Android device and install it using ADB.',focus:'Run adb devices and adb install -r.',expected:'Receive Success and open the installed application.',command:'adb install -r app/build/outputs/apk/debug/app-debug.apk',camera:'workstation',sequence:'install',practice:'adb install -r app/build/outputs/apk/debug/app-debug.apk',answer:'adb install -r app/build/outputs/apk/debug/app-debug.apk'},
{id:10,title:'Test and complete training',type:'ASSESSMENT',view:'phone',description:'Open the application, test the LiaScript course, and complete the final checkpoint.',focus:'Verify navigation, media, interaction, and Android back-button behavior.',expected:'Confirm the application is ready for student use.',command:'Launch app and complete final quality check',camera:'instructor',sequence:'final',practice:'List one item that must be tested after installation.',answer:'navigation'}
];

const manifests=`<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:theme="@style/Theme.LiaScriptApp">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

const kotlin=`package com.example.liascriptapp

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)

        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()

        webView.loadUrl(
            "https://liascript.github.io/course/?YOUR_RAW_GITHUB_URL"
        )

        setContentView(webView)
    }
}`;

const projectRows=[
'▾ LiaScriptApp','  ▾ app','    ▾ manifests','      AndroidManifest.xml','    ▾ kotlin','      ▾ com.example.liascriptapp','        MainActivity.kt','    ▾ res','  ▾ Gradle Scripts','    build.gradle.kts','    settings.gradle.kts'
];

const state={module:1,running:false,paused:false,voice:true,speed:1,timers:[],cameraMode:'cinematic',completed:new Set()};

const wrap=$('#canvasWrap'),scene=new THREE.Scene();scene.background=new THREE.Color(0x020617);scene.fog=new THREE.FogExp2(0x020617,.028);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,200);camera.position.set(0,3.2,15);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.xr.enabled=true;wrap.appendChild(renderer.domElement);
const vrButton=VRButton.createButton(renderer);vrButton.style.display='none';document.body.appendChild(vrButton);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.target.set(0,2.4,-3);

scene.add(new THREE.HemisphereLight(0x8be9ff,0x09111d,2.1));
const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(7,12,8);key.castShadow=true;scene.add(key);
const cyan=new THREE.PointLight(0x22d3ee,60,25,2);cyan.position.set(-6,5,1);scene.add(cyan);
const purple=new THREE.PointLight(0x8b5cf6,48,24,2);purple.position.set(7,4,-4);scene.add(purple);

function addBox(w,h,d,color,x,y,z,metal=.3,rough=.5){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
const floor=addBox(36,.15,36,0x0a1220,0,-.08,0,.62,.38);
const grid=new THREE.GridHelper(36,36,0x1f8ba0,0x172033);grid.position.y=.01;grid.material.opacity=.22;grid.material.transparent=true;scene.add(grid);
addBox(18,8,.35,0x111c2e,0,4,-8,.2,.55);
for(let i=-7;i<=7;i+=2){const s=addBox(.055,6,.38,0x22d3ee,i,4,-7.78,.1,.2);s.material.emissive=new THREE.Color(0x22d3ee);s.material.emissiveIntensity=1.25}
addBox(14,.35,6,0x182238,0,.2,-1.4,.5,.35);addBox(8.5,.35,3,0x6c442c,0,1.15,-2.7,.15,.55);
const monL=addBox(4,2.7,.3,0x050914,-2.2,3,-2.9,.75,.2),monR=addBox(4,2.7,.3,0x050914,2.2,3,-2.9,.75,.2);
const scrL=addBox(3.65,2.35,.06,0x071827,-2.2,3,-2.7,.2,.3),scrR=addBox(3.65,2.35,.06,0x071827,2.2,3,-2.7,.2,.3);
scrL.material.emissive=new THREE.Color(0x073047);scrL.material.emissiveIntensity=.75;scrR.material.emissive=new THREE.Color(0x21124f);scrR.material.emissiveIntensity=.7;
addBox(.28,1.2,.28,0x111827,-2.2,1.6,-2.9,.7,.2);addBox(.28,1.2,.28,0x111827,2.2,1.6,-2.9,.7,.2);
addBox(1.6,.13,.8,0x111827,-2.2,1.03,-2.75,.7,.2);addBox(1.6,.13,.8,0x111827,2.2,1.03,-2.75,.7,.2);
const keyboard=new THREE.Group();for(let r=0;r<4;r++){for(let c=0;c<12;c++){const k=addBox(.22,.08,.22,0x1f2937,-1.35+c*.245,1.38-r*.02,-1.58+r*.24,.65,.25);keyboard.add(k)}}scene.add(keyboard);
const mouse3d=addBox(.45,.18,.65,0x111827,2.2,1.35,-1.3,.55,.28);
const phone3d=addBox(.7,1.4,.1,0x05070c,4,1.92,-2.3,.7,.18);phone3d.rotation.z=-.12;
const instructor=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.35,8,16),new THREE.MeshStandardMaterial({color:0x2563eb,metalness:.3,roughness:.35}));body.position.y=1.5;instructor.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.48,32,24),new THREE.MeshStandardMaterial({color:0xd8f4ff}));head.position.y=2.85;instructor.add(head);const visor=new THREE.Mesh(new THREE.BoxGeometry(.7,.18,.08),new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:1.6}));visor.position.set(0,2.88,.43);instructor.add(visor);instructor.position.set(6,0,2);instructor.rotation.y=-1.6;scene.add(instructor);
const holo=new THREE.Mesh(new THREE.TorusGeometry(1.1,.05,16,120),new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:2}));holo.position.set(0,5.5,-2.3);holo.rotation.x=Math.PI/2;scene.add(holo);
const core=new THREE.Mesh(new THREE.OctahedronGeometry(.7),new THREE.MeshStandardMaterial({color:0x8b5cf6,emissive:0x8b5cf6,emissiveIntensity:1.4,metalness:.45,roughness:.2}));core.position.set(0,5.5,-2.3);scene.add(core);

const shots={cinematic:{pos:[0,3.1,14],target:[0,2.6,-3]},workstation:{pos:[0,3.2,7],target:[0,2.4,-2.5]},instructor:{pos:[7,3.1,5.5],target:[4,1.8,-1.5]},overview:{pos:[10,7,13],target:[0,2,-2]}};
let camAnim=null;
function cameraShot(name,duration=1800){const s=shots[name]||shots.cinematic;camAnim={start:performance.now(),duration:duration*state.speed,fromPos:camera.position.clone(),fromTar:controls.target.clone(),toPos:new THREE.Vector3(...s.pos),toTar:new THREE.Vector3(...s.target)};$('#cameraStatus').textContent=name[0].toUpperCase()+name.slice(1);$('#cameraLabel').textContent=name.toUpperCase()+' SHOT'}

const moduleItems=$('#moduleItems');
modules.forEach(m=>{const b=document.createElement('button');b.className='module-item';b.innerHTML=`<span>${String(m.id).padStart(2,'0')}</span><div><b>${m.title}</b><small>${m.type}</small></div>`;b.onclick=()=>loadModule(m.id);moduleItems.appendChild(b);const o=document.createElement('option');o.value=m.id;o.textContent=`${m.id}. ${m.title}`;$('#moduleSelect').appendChild(o)});
$('#checkpointDots').innerHTML=modules.map((_,i)=>`<i class="dot" data-dot="${i+1}"></i>`).join('');

function current(){return modules.find(m=>m.id===state.module)}
function clearTimers(){state.timers.forEach(clearTimeout);state.timers=[]}
function later(fn,ms){const id=setTimeout(fn,ms*state.speed);state.timers.push(id);return id}
function speak(t){if(!state.voice||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=.86;u.lang='en-US';speechSynthesis.speak(u)}
function showView(v){$$('.workspace-view').forEach(x=>x.classList.remove('active'));$(`#${v}View`).classList.add('active')}
function typeText(el,text,speed=28,done){el.textContent='';let i=0;const tick=()=>{if(!state.running||state.paused)return;el.textContent+=text[i++]||'';if(i<=text.length)later(tick,speed);else done&&done()};tick()}
function setCode(text){const lines=text.split('\n');$('#lineNumbers').textContent=lines.map((_,i)=>i+1).join('\n');$('#codeEditor').innerHTML=lines.map((l,i)=>`<span class="code-line" data-line="${i+1}">${l.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')||' '}</span>`).join('')}
function highlight(lines){$$('.code-line').forEach(x=>x.classList.remove('highlight'));lines.forEach(n=>$(`.code-line[data-line="${n}"]`)?.classList.add('highlight'))}
function renderTree(active=''){const box=$('#projectTree');box.innerHTML=projectRows.map(r=>`<div class="tree-row ${r.trim().includes(active)?'active':''}">${r}</div>`).join('')}
function pointerTo(x,y,click=false){const p=$('#mousePointer');p.style.left=x+'px';p.style.top=y+'px';p.classList.add('show');if(click)later(()=>{const c=$('#clickPulse');c.style.left=(x-4)+'px';c.style.top=(y-3)+'px';c.classList.remove('pulse');void c.offsetWidth;c.classList.add('pulse')},850)}
function keyPresses(){[...keyboard.children].forEach((k,i)=>{if(i%5===0)later(()=>{k.position.y-=.04;k.material.emissive=new THREE.Color(0x22d3ee);k.material.emissiveIntensity=1.2;later(()=>{k.position.y+=.04;k.material.emissiveIntensity=0},120)},i*35)})}
function success(){ $('#successBurst').classList.add('show');later(()=>$('#successBurst').classList.remove('show'),2300)}
function complete(){state.running=false;state.completed.add(state.module);$(`.dot[data-dot="${state.module}"]`).classList.add('done');$('#stepStatus').textContent='Completed';$('#progressFill').style.width=`${state.module/modules.length*100}%`;$('#achievement').textContent=`🏆 ${current().title} completed`;$('#achievement').classList.add('show');later(()=>$('#achievement').classList.remove('show'),2200)}
function openMenu(){showView('studio');$('#menuBuild').classList.add('active');$('#menuPopup').style.display='block';$('#menuPopup').innerHTML='<div class="menu-entry">Make Project</div><div class="menu-entry active">Build APK(s)</div><div class="menu-entry">Generate Signed Bundle / APK</div>';later(()=>{$('#menuPopup').style.display='none';$('#menuBuild').classList.remove('active')},1900)}

function loadModule(id){
 clearTimers();state.module=Number(id);state.running=false;state.paused=false;const m=current();
 $('#moduleSelect').value=m.id;$('#moduleCounter').textContent=`${m.id} / ${modules.length}`;$('#workspaceType').textContent=m.type;$('#workspaceTitle').textContent=m.title;$('#sceneLabel').textContent=m.title;$('#narrationTitle').textContent=m.title;$('#narrationText').textContent=m.description;$('#focusText').textContent=m.focus;$('#expectedText').textContent=m.expected;$('#fullCommand').textContent=m.command;$('#stepStatus').textContent='Ready';$('#subtitle').textContent='Press Play to start this immersive module.';$('#progressFill').style.width=`${(m.id-1)/modules.length*100}%`;$$('.module-item').forEach((b,i)=>b.classList.toggle('active',i===m.id-1));$('#terminalOutput').textContent='';$('#terminalCommand').textContent='';$('#buildOutput').textContent='';$('#installFill').style.width='0%';$('#mousePointer').classList.remove('show');renderTree();setCode('');showView(m.view);cameraShot(m.camera,900)
}

function playModule(){
 clearTimers();state.running=true;state.paused=false;const m=current();$('#stepStatus').textContent='Playing';$('#modeStatus').textContent='Watch';speak(m.description+' '+m.focus);cameraShot(m.camera);
 if(m.sequence==='orientation'){showView('architecture');instructor.position.set(6,0,2);later(()=>{instructor.position.set(3.8,0,-.4);instructor.rotation.y=-.7;$('#subtitle').textContent='The instructor walks to the dual-monitor workstation.'},800);later(complete,4200)}
 if(m.sequence==='desktop'){showView('desktop');pointerTo(innerWidth*.45,innerHeight*.42,true);later(()=>pointerTo(innerWidth*.53,innerHeight*.42,true),1800);later(complete,3500)}
 if(m.sequence==='terminal'){showView('terminal');keyPresses();typeText($('#terminalCommand'),m.command,30,()=>{later(()=>{$('#enterKey').classList.add('press');speak('The environment verification command is now executing.')},300);later(()=>{$('#enterKey').classList.remove('press');typeText($('#terminalOutput'),m.output,10,complete)},900)})}
 if(m.sequence==='tree'){showView('studio');renderTree('AndroidManifest.xml');pointerTo(innerWidth*.37,innerHeight*.36,true);later(()=>renderTree('MainActivity.kt'),1300);later(()=>renderTree('build.gradle.kts'),2500);later(complete,3900)}
 if(m.sequence==='manifest'){showView('studio');renderTree('AndroidManifest.xml');$('#editorTab').textContent='AndroidManifest.xml';setCode(manifests);later(()=>highlight([3]),800);later(()=>highlight([8,9]),1900);later(complete,3500)}
 if(m.sequence==='kotlin'){showView('studio');renderTree('MainActivity.kt');$('#editorTab').textContent='MainActivity.kt';setCode(kotlin);later(()=>highlight([13]),800);later(()=>highlight([14]),1700);later(()=>highlight([16,17,18]),2700);later(()=>highlight([21]),3900);later(complete,5200)}
 if(m.sequence==='browser'){showView('browser');pointerTo(innerWidth*.5,innerHeight*.21,true);later(complete,3300)}
 if(m.sequence==='build'){showView('terminal');keyPresses();typeText($('#terminalCommand'),m.command,28,()=>{later(()=>{$('#enterKey').classList.add('press');openMenu()},350);later(()=>{$('#enterKey').classList.remove('press');showView('terminal');typeText($('#terminalOutput'),m.output,9,()=>{success();complete()})},1200)})}
 if(m.sequence==='install'){showView('terminal');typeText($('#terminalCommand'),m.command,24,()=>{later(()=>typeText($('#terminalOutput'),'List of devices attached\nR58N12345AB\\tdevice\n\nPerforming Streamed Install\nSuccess',10,()=>{showView('phone');$('#phoneTitle').textContent='Installing LiaScript App';$('#phoneText').textContent='Transferring app-debug.apk…';$('#installFill').style.width='100%';later(()=>{$('#phoneTitle').textContent='Installation complete';$('#phoneText').textContent='The application is ready to launch.';complete()},2300)}),600)})}
 if(m.sequence==='final'){showView('phone');$('#phoneTitle').textContent='German A1 Training';$('#phoneText').textContent='Testing navigation, media, interaction, and Android controls.';$('#installFill').style.width='100%';cameraShot('instructor');later(()=>{success();complete()},3600)}
}

$('#startBtn').onclick=()=>{$('#introOverlay').style.display='none';playModule()};
$('#exploreBtn').onclick=()=>{$('#introOverlay').style.display='none';loadModule(1);cameraShot('overview')};
$('#playBtn').onclick=playModule;$('#pauseBtn').onclick=()=>{state.paused=true;state.running=false;clearTimers();speechSynthesis?.cancel();$('#stepStatus').textContent='Paused'};
$('#replayBtn').onclick=()=>{loadModule(state.module);later(playModule,300)};$('#voiceBtn').onclick=()=>{state.voice=!state.voice;$('#voiceBtn').textContent=state.voice?'🔊 Voice':'🔇 Muted';$('#voiceStatus').textContent=state.voice?'On':'Off';if(!state.voice)speechSynthesis?.cancel()};
$('#practiceBtn').onclick=()=>{const m=current();$('#practicePanel').style.display='block';$('#practiceTitle').textContent=m.title;$('#practicePrompt').textContent=m.practice;$('#practiceInput').value='';$('#practiceFeedback').textContent='';$('#modeStatus').textContent='Practice'};
$('#closePractice').onclick=()=>{$('#practicePanel').style.display='none';$('#modeStatus').textContent='Watch'};
$('#hintBtn').onclick=()=>{$('#practiceFeedback').className='';$('#practiceFeedback').textContent='Hint: '+current().command};
$('#checkBtn').onclick=()=>{const a=$('#practiceInput').value.trim().toLowerCase(),expected=current().answer.toLowerCase();const ok=a===expected||a.includes(expected)||expected.includes(a);$('#practiceFeedback').className=ok?'correct':'incorrect';$('#practiceFeedback').textContent=ok?'Correct. You may continue to the next module.':'Not yet correct. Review the current command or use Show Hint.'};
$('#fullscreenBtn').onclick=async()=>{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()};$('#vrBtn').onclick=()=>vrButton.click();
$('#moduleSelect').onchange=e=>loadModule(e.target.value);$('#speedSelect').onchange=e=>state.speed=Number(e.target.value);$('#cameraSelect').onchange=e=>cameraShot(e.target.value);$('#leftMonitorBtn').onclick=()=>showView('terminal');$('#rightMonitorBtn').onclick=()=>showView('studio');
$('#copyCommand').onclick=async()=>{await navigator.clipboard.writeText($('#fullCommand').textContent);$('#copyCommand').textContent='Copied';later(()=>$('#copyCommand').textContent='Copy',900)};$('#phoneAppBtn').onclick=()=>{$('#phoneTitle').textContent='German A1 Training';$('#phoneText').textContent='LiaScript course loaded successfully inside Android WebView.'};
$$('.desktop-icon').forEach(b=>b.onclick=()=>showView(b.dataset.app));
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const clock=new THREE.Clock();
function render(){
 const t=clock.getElapsedTime();holo.rotation.z=t*.5;core.rotation.x=t*.3;core.rotation.y=t*.62;core.position.y=5.5+Math.sin(t*1.4)*.12;instructor.position.y=Math.sin(t*1.6)*.025;mouse3d.rotation.z=Math.sin(t*.8)*.05;
 if(camAnim){const p=Math.min(1,(performance.now()-camAnim.start)/camAnim.duration),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;camera.position.lerpVectors(camAnim.fromPos,camAnim.toPos,e);controls.target.lerpVectors(camAnim.fromTar,camAnim.toTar,e);if(p>=1)camAnim=null}
 controls.update();renderer.render(scene,camera)
}
renderer.setAnimationLoop(render);
setTimeout(()=>$('#loading').classList.add('hidden'),850);setTimeout(()=>$('#loading').style.display='none',1500);loadModule(1);
