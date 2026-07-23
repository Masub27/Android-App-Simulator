import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/webxr/VRButton.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const wrap = $('#canvasWrap');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020617);
scene.fog = new THREE.FogExp2(0x020617, 0.028);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 2.2, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.xr.enabled = true;
wrap.appendChild(renderer.domElement);

const vrButton = VRButton.createButton(renderer);
vrButton.style.display = 'none';
document.body.appendChild(vrButton);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 22;
controls.target.set(0, 2, 0);

const hemi = new THREE.HemisphereLight(0x8be9ff, 0x09111d, 2.1);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffffff, 3.2);
key.position.set(6, 12, 8);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
scene.add(key);

const cyanLight = new THREE.PointLight(0x22d3ee, 55, 24, 2);
cyanLight.position.set(-6, 5, 2);
scene.add(cyanLight);

const purpleLight = new THREE.PointLight(0x8b5cf6, 45, 22, 2);
purpleLight.position.set(6, 4, -4);
scene.add(purpleLight);

const floorMat = new THREE.MeshStandardMaterial({
  color: 0x0a1220,
  roughness: 0.38,
  metalness: 0.62
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(36, 36, 0x1f8ba0, 0x172033);
grid.position.y = 0.012;
grid.material.opacity = 0.24;
grid.material.transparent = true;
scene.add(grid);

function box(w,h,d,color,x,y,z,metal=0.3,rough=0.5){
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w,h,d),
    new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough})
  );
  mesh.position.set(x,y,z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

const academy = new THREE.Group();
scene.add(academy);

const backWall = box(18,8,.35,0x111c2e,0,4,-8,.2,.55);
academy.add(backWall);

for(let i=-7;i<=7;i+=2){
  const strip = box(.055,6,.38,0x22d3ee,i,4,-7.78,.1,.2);
  strip.material.emissive = new THREE.Color(0x22d3ee);
  strip.material.emissiveIntensity = 1.25;
}

for(let i=-7;i<=7;i+=3.5){
  const column = box(.45,7,.45,0x172033,i,3.5,-6.8,.55,.32);
  academy.add(column);
}

const doorL = box(2.15,5,.22,0x15243a,-2.2,2.5,-7.55,.65,.25);
const doorR = box(2.15,5,.22,0x15243a,2.2,2.5,-7.55,.65,.25);
doorL.userData.closedX = -2.2;
doorR.userData.closedX = 2.2;

const doorFrameTop = box(5.2,.28,.4,0x22d3ee,0,5.15,-7.45,.3,.25);
doorFrameTop.material.emissive = new THREE.Color(0x22d3ee);
doorFrameTop.material.emissiveIntensity = 1.1;

const platform = box(13,.35,5.5,0x182238,0,.2,-1.2,.5,.35);
academy.add(platform);

const desk = box(7.5,.32,2.5,0x714a2f,0,1.15,-2.5,.15,.55);
const deskLeg1 = box(.3,1.1,.3,0x1b2432,-3.1,.58,-2.5,.7,.25);
const deskLeg2 = box(.3,1.1,.3,0x1b2432,3.1,.58,-2.5,.7,.25);

const monitorFrame = box(5.8,3.4,.34,0x050914,0,3.12,-2.78,.75,.2);
const screen = box(5.3,2.92,.08,0x071827,0,3.12,-2.58,.2,.3);
screen.material.emissive = new THREE.Color(0x072c43);
screen.material.emissiveIntensity = .65;
const stand = box(.35,1.25,.35,0x111827,0,1.65,-2.75,.7,.2);
const base = box(1.8,.15,.9,0x111827,0,1.02,-2.65,.7,.2);

const phone = box(.7,1.4,.1,0x05070c,3.25,1.92,-2.35,.7,.18);
phone.rotation.z = -.14;
const phoneScreen = box(.56,1.12,.04,0x0a86a8,3.25,1.92,-2.28,.25,.25);
phoneScreen.rotation.z = -.14;
phoneScreen.material.emissive = new THREE.Color(0x0a86a8);
phoneScreen.material.emissiveIntensity = .8;

const hologramRing = new THREE.Mesh(
  new THREE.TorusGeometry(1.15,.05,16,120),
  new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:2})
);
hologramRing.position.set(0,5.4,-2.2);
hologramRing.rotation.x = Math.PI/2;
scene.add(hologramRing);

const hologramCore = new THREE.Mesh(
  new THREE.OctahedronGeometry(.75,0),
  new THREE.MeshStandardMaterial({
    color:0x8b5cf6,
    emissive:0x8b5cf6,
    emissiveIntensity:1.4,
    metalness:.45,
    roughness:.2
  })
);
hologramCore.position.set(0,5.4,-2.2);
scene.add(hologramCore);

const instructor = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(.55,1.35,8,16),
  new THREE.MeshStandardMaterial({color:0x2563eb,metalness:.3,roughness:.35})
);
body.position.y = 1.5;
body.castShadow = true;
instructor.add(body);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(.48,32,24),
  new THREE.MeshStandardMaterial({color:0xd8f4ff,metalness:.12,roughness:.32})
);
head.position.y = 2.85;
head.castShadow = true;
instructor.add(head);

const visor = new THREE.Mesh(
  new THREE.BoxGeometry(.7,.18,.08),
  new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:1.6})
);
visor.position.set(0,2.88,.43);
instructor.add(visor);

const arm = new THREE.Mesh(
  new THREE.CapsuleGeometry(.12,.85,6,12),
  new THREE.MeshStandardMaterial({color:0x3b82f6,metalness:.28,roughness:.38})
);
arm.position.set(-.62,1.85,.05);
arm.rotation.z = -.75;
instructor.add(arm);

instructor.position.set(4.5,0,-1.2);
instructor.rotation.y = -.45;
scene.add(instructor);

const particleGeo = new THREE.BufferGeometry();
const particleCount = 450;
const positions = new Float32Array(particleCount*3);
for(let i=0;i<particleCount;i++){
  positions[i*3]=(Math.random()-.5)*28;
  positions[i*3+1]=Math.random()*9+.3;
  positions[i*3+2]=(Math.random()-.5)*28;
}
particleGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({color:0x67e8f9,size:.025,transparent:true,opacity:.52})
);
scene.add(particles);

function makeTextTexture(title, subtitle){
  const c=document.createElement('canvas');
  c.width=1536;c.height=512;
  const x=c.getContext('2d');
  x.clearRect(0,0,c.width,c.height);
  const g=x.createLinearGradient(0,0,c.width,0);
  g.addColorStop(0,'rgba(3,12,24,.94)');
  g.addColorStop(1,'rgba(10,25,45,.94)');
  x.fillStyle=g;
  x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='rgba(34,211,238,.5)';
  x.lineWidth=8;
  x.strokeRect(12,12,c.width-24,c.height-24);
  x.fillStyle='#e8fbff';
  x.font='900 88px Arial';
  x.textAlign='center';
  x.fillText(title,c.width/2,218);
  x.fillStyle='#67e8f9';
  x.font='500 44px Arial';
  x.fillText(subtitle,c.width/2,305);
  x.fillStyle='#93a8bb';
  x.font='400 28px Arial';
  x.fillText('Cinematic Watch Mode · Iteration 1',c.width/2,382);
  const texture=new THREE.CanvasTexture(c);
  texture.colorSpace=THREE.SRGBColorSpace;
  return texture;
}
screen.material.map=makeTextTexture('ANDROID XR TRAINING','LiaScript → Android WebView → APK');
screen.material.needsUpdate=true;

const clock=new THREE.Clock();

const steps=[
  {
    title:'Academy entrance',
    label:'Lobby entrance',
    text:'Welcome to the Android XR Training Academy. We begin at the entrance of the immersive development laboratory.',
    focus:'Enter the academy and observe the training environment.',
    pos:new THREE.Vector3(0,2.3,14),
    target:new THREE.Vector3(0,2.5,-4),
    duration:3500
  },
  {
    title:'Meet the virtual instructor',
    label:'Virtual instructor',
    text:'Your XR instructor introduces the learning journey and guides every training stage clearly.',
    focus:'Meet the instructor and listen to the training overview.',
    pos:new THREE.Vector3(7,2.8,5.8),
    target:new THREE.Vector3(4.2,1.9,-1.2),
    duration:3500
  },
  {
    title:'Enter the development laboratory',
    label:'Development laboratory',
    text:'The camera now moves to the virtual workstation where Android Studio, Terminal, and the Android device will appear.',
    focus:'Inspect the workstation and training equipment.',
    pos:new THREE.Vector3(-6.6,3.6,4.7),
    target:new THREE.Vector3(0,2.8,-2.5),
    duration:4000
  },
  {
    title:'Understand the Android workflow',
    label:'Android workflow',
    text:'The training workflow begins with a LiaScript course, continues through Android Studio and Gradle, and ends with an installable APK.',
    focus:'Review the LiaScript-to-APK training pathway.',
    pos:new THREE.Vector3(0,4.4,3.2),
    target:new THREE.Vector3(0,3.2,-2.6),
    duration:4200
  },
  {
    title:'Workstation ready',
    label:'Ready for training',
    text:'Iteration 1 is complete. The cinematic environment is ready. The next iteration will animate Terminal commands and Android Studio code inside this workstation.',
    focus:'Prepare for the animated Terminal and Android Studio lesson.',
    pos:new THREE.Vector3(0,2.65,4.8),
    target:new THREE.Vector3(0,3.05,-2.6),
    duration:4200
  }
];

let state={
  step:0,
  running:false,
  paused:false,
  voice:true,
  startTime:0,
  fromPos:camera.position.clone(),
  fromTarget:controls.target.clone(),
  toPos:steps[0].pos.clone(),
  toTarget:steps[0].target.clone(),
  duration:steps[0].duration,
  sequenceTimer:null
};

function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function speak(text){
  if(!state.voice||!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=.88;
  u.pitch=1;
  u.lang='en-US';
  speechSynthesis.speak(u);
}
function setUI(index){
  const s=steps[index];
  $('#sceneLabel').textContent=s.label;
  $('#narrationTitle').textContent=s.title;
  $('#narrationText').textContent=s.text;
  $('#focusText').textContent=s.focus;
  $('#subtitle').textContent=s.text;
  $('#chapterCounter').textContent=`${index+1} / ${steps.length}`;
  $('#progressFill').style.width=`${((index+1)/steps.length)*100}%`;
  $$('.chapter').forEach((b,i)=>b.classList.toggle('active',i===index));
}
function animateTo(index,autoplay=false){
  clearTimeout(state.sequenceTimer);
  state.step=Math.max(0,Math.min(steps.length-1,index));
  const s=steps[state.step];
  state.fromPos.copy(camera.position);
  state.fromTarget.copy(controls.target);
  state.toPos.copy(s.pos);
  state.toTarget.copy(s.target);
  state.duration=s.duration;
  state.startTime=performance.now();
  state.running=true;
  state.paused=false;
  controls.enabled=false;
  setUI(state.step);
  speak(s.text);

  if(state.step===0){
    doorL.position.x=-2.2;
    doorR.position.x=2.2;
    setTimeout(()=>{
      doorL.position.x=-4.45;
      doorR.position.x=4.45;
    },900);
  }

  if(autoplay){
    state.sequenceTimer=setTimeout(()=>{
      if(state.step<steps.length-1) animateTo(state.step+1,true);
      else {
        state.running=false;
        controls.enabled=true;
        $('#subtitle').textContent='Iteration 1 complete. Use Replay or select any chapter.';
      }
    },s.duration+2500);
  }
}
function startTour(){
  animateTo(0,true);
}
function pauseTour(){
  state.paused=true;
  state.running=false;
  controls.enabled=true;
  clearTimeout(state.sequenceTimer);
  if('speechSynthesis' in window)speechSynthesis.cancel();
  $('#subtitle').textContent='Tour paused. Press Tour to continue from this chapter.';
}
function replayTour(){
  camera.position.set(0,2.2,15);
  controls.target.set(0,2,-4);
  doorL.position.x=-2.2;
  doorR.position.x=2.2;
  startTour();
}

$('#startBtn').onclick=()=>{
  $('#introOverlay').style.display='none';
  startTour();
};
$('#skipBtn').onclick=()=>{
  $('#introOverlay').style.display='none';
  animateTo(4,false);
};
$('#tourBtn').onclick=()=>animateTo(state.step,true);
$('#pauseBtn').onclick=pauseTour;
$('#replayBtn').onclick=replayTour;
$('#voiceBtn').onclick=()=>{
  state.voice=!state.voice;
  $('#voiceBtn').textContent=state.voice?'🔊 Voice':'🔇 Muted';
  $('#voiceStatus').textContent=state.voice?'On':'Off';
  if(!state.voice&&'speechSynthesis'in window)speechSynthesis.cancel();
};
$('#fullscreenBtn').onclick=async()=>{
  if(!document.fullscreenElement)await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
};
$('#vrBtn').onclick=()=>vrButton.click();

$$('.chapter').forEach(btn=>{
  btn.onclick=()=>{
    $('#introOverlay').style.display='none';
    animateTo(Number(btn.dataset.step),false);
  };
});

window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

function render(){
  const dt=clock.getElapsedTime();
  hologramRing.rotation.z=dt*.5;
  hologramCore.rotation.x=dt*.32;
  hologramCore.rotation.y=dt*.65;
  hologramCore.position.y=5.4+Math.sin(dt*1.4)*.12;
  particles.rotation.y=dt*.015;
  instructor.position.y=Math.sin(dt*1.5)*.03;

  if(state.running&&!state.paused){
    const t=Math.min(1,(performance.now()-state.startTime)/state.duration);
    const e=ease(t);
    camera.position.lerpVectors(state.fromPos,state.toPos,e);
    controls.target.lerpVectors(state.fromTarget,state.toTarget,e);
    controls.update();
    if(t>=1){
      state.running=false;
      controls.enabled=true;
    }
  } else {
    controls.update();
  }

  renderer.render(scene,camera);
}
renderer.setAnimationLoop(render);

setTimeout(()=>$('#loading').classList.add('hidden'),850);
setTimeout(()=>$('#loading').style.display='none',1500);
setUI(0);
