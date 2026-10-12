import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { nodes } from './content'

export type SceneController = { dispose: () => void; select: (index:number) => void; pause: (paused:boolean) => void }

export async function createScene(host: HTMLElement, mode: 'hero'|'explorer', onSelect:(index:number)=>void, onFailure:()=>void, labels:string[]): Promise<SceneController> {
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,window.innerWidth<768?1.25:1.65))
  renderer.setSize(host.clientWidth,host.clientHeight)
  renderer.outputColorSpace=THREE.SRGBColorSpace
  renderer.toneMapping=THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure=1.3
  renderer.domElement.setAttribute('aria-hidden','true')
  host.appendChild(renderer.domElement)
  const scene=new THREE.Scene()
  const environment=new RoomEnvironment()
  const pmrem=new THREE.PMREMGenerator(renderer)
  const envTarget=pmrem.fromScene(environment,.04)
  scene.environment=envTarget.texture
  environment.dispose()
  pmrem.dispose()
  scene.add(new THREE.AmbientLight('#b6c7c0',1.1))
  const keyLight=new THREE.DirectionalLight('#ecfff2',3.5)
  keyLight.position.set(4,7,5)
  scene.add(keyLight)
  const rimLight=new THREE.DirectionalLight('#adc7f9',2.5)
  rimLight.position.set(-5,2,-3)
  scene.add(rimLight)
  const mintLight=new THREE.PointLight('#9ef2d0',35,12,2)
  mintLight.position.set(0,-1,2)
  scene.add(mintLight)
  const aspect=host.clientWidth/host.clientHeight
  const extent=mode==='hero'?3.3:4.35
  const camera=new THREE.OrthographicCamera(-extent*aspect,extent*aspect,extent,-extent,.1,70)
  camera.position.set(mode==='hero'?6.3:6,mode==='hero'?4.7:7.4,mode==='hero'?7.5:8)
  camera.lookAt(0,0,0)
  const model=new THREE.Group()
  scene.add(model)
  const dark=new THREE.MeshStandardMaterial({color:'#23332f',roughness:.28,metalness:.92})
  const side=new THREE.MeshStandardMaterial({color:'#14201e',roughness:.35,metalness:.8})
  const black=new THREE.MeshStandardMaterial({color:'#080f0d',roughness:.5,metalness:.4})
  const silver=new THREE.MeshStandardMaterial({color:'#809e8b',roughness:.29,metalness:.9})
  const mint=new THREE.MeshStandardMaterial({color:'#b5ffdb',emissive:'#8ef6c6',emissiveIntensity:1.5,roughness:.35,metalness:.4})
  const violet=new THREE.MeshStandardMaterial({color:'#a89be0',emissive:'#9987df',emissiveIntensity:.8,roughness:.4,metalness:.4})
  const disposables=new Set<THREE.BufferGeometry|THREE.Material|THREE.Texture>([dark,side,black,silver,mint,violet])
  const layers:THREE.Group[]=[]
  const nodeGroups:THREE.Group[]=[]
  const nodeMaterials:THREE.MeshStandardMaterial[]=[]
  const hitTargets:THREE.Object3D[]=[]
  const pulsePaths:THREE.CatmullRomCurve3[]=[]
  const pulses:THREE.Mesh[]=[]
  const connections:THREE.Line[]=[]
  const labelMaterials:THREE.SpriteMaterial[]=[]
  const lineMaterial=new THREE.LineBasicMaterial({color:'#698675',transparent:true,opacity:.4})
  const edgeMaterial=new THREE.LineBasicMaterial({color:'#cce7d6',transparent:true,opacity:.19})
  disposables.add(lineMaterial);disposables.add(edgeMaterial)

  function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material){
    const geo=new THREE.BoxGeometry(w,h,d)
    disposables.add(geo)
    const mesh=new THREE.Mesh(geo,material)
    mesh.position.set(x,y,z)
    parent.add(mesh)
    return mesh
  }
  function edge(mesh:THREE.Mesh){
    const geo=new THREE.EdgesGeometry(mesh.geometry)
    disposables.add(geo)
    mesh.add(new THREE.LineSegments(geo,edgeMaterial))
  }
  function drawLine(points:THREE.Vector3[],mat= lineMaterial){
    const geometry=new THREE.BufferGeometry().setFromPoints(points)
    disposables.add(geometry)
    const line=new THREE.Line(geometry,mat)
    model.add(line)
    return line
  }

  if(mode==='hero'){
    model.rotation.y=-.2
    for(let layer=0;layer<4;layer++){
      const group=new THREE.Group()
      group.position.y=(layer-1.5)*.85
      layers.push(group);model.add(group)
      for(let x=0;x<3;x++)for(let z=0;z<3;z++){
        if(x===1&&z===1)continue
        const mesh=box(group,.84,.29,.84,(x-1)*.89,0,(z-1)*.89,dark)
        edge(mesh)
        const chip=box(group,.6,.018,.6,(x-1)*.89,.155,(z-1)*.89,side)
        edge(chip)
        for(let slot=0;slot<3;slot++){
          box(group,.1,.025,.025,(x-1)*.89-.23+slot*.16,-.04,(z-1)*.89+.427,black)
          box(group,.02,.023,.014,(x-1)*.89+.3,-.03,(z-1)*.89+.432,layer===1?violet:mint)
        }
      }
      box(group,2.66,.016,.022,0,.025,1.333,layer===1?violet:mint)
      box(group,.022,.016,2.66,1.333,.025,0,layer===1?violet:mint)
      box(group,.57,.04,.57,0,.015,0,layer===3?mint:side)
      const core=box(group,.31,.09,.31,0,.08,0,black);edge(core)
      for(let k=0;k<4;k++){
        const x=k<2?-.9:.9,z=k%2?-.9:.9
        box(group,.035,.46,.035,x,-.36,z,silver)
      }
    }
    const base=box(model,3.8,.045,3.8,0,-2.1,0,black)
    edge(base)
    for(let i=-5;i<=5;i++){
      drawLine([new THREE.Vector3(i*.42,-2.068,-2.1),new THREE.Vector3(i*.42,-2.068,2.1)])
      drawLine([new THREE.Vector3(-2.1,-2.068,i*.42),new THREE.Vector3(2.1,-2.068,i*.42)])
    }
  }else{
    nodes.forEach((node,index)=>{
      const group=new THREE.Group();group.position.set(...node.position as [number,number,number]);model.add(group);nodeGroups.push(group)
      const mat=dark.clone();nodeMaterials.push(mat);disposables.add(mat)
      const mainBox=box(group,index===0?1.1:.78,index===0?.52:.33,index===0?1.1:.78,0,0,0,mat)
      mainBox.userData.node=index;hitTargets.push(mainBox);edge(mainBox)
      box(group,index===0?1.02:.7,.014,.025,0,-.07,index===0?.559:.399,mint)
      const top=box(group,index===0?.82:.54,.022,index===0?.82:.54,0,index===0?.278:.185,0,side);edge(top)
      if(index===0){
        for(let i=0;i<3;i++)box(group,.72,.012,.02,0,.03+i*.085,.559,black)
        box(group,.46,.08,.46,0,.329,0,mint)
      }else if(index===4){
        for(let i=0;i<4;i++)box(group,.045,.04+(i*13%7)/25,.07,-.17+i*.12,.24,0,silver)
      }else{
        const geometry=index===5?new THREE.CylinderGeometry(.14,.14,.18,16):new THREE.BoxGeometry(.22,.09,.22)
        disposables.add(geometry)
        const icon=new THREE.Mesh(geometry,index===3?violet:silver)
        icon.position.y=.25;group.add(icon)
      }
      const foot=box(group,index===0?1.4:1.03,.025,index===0?1.4:1.03,0,-.31,0,black);edge(foot)
      const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=96
      const context=labelCanvas.getContext('2d')!
      context.fillStyle='#0d1411dd';context.fillRect(0,0,512,96)
      context.font='25px "IBM Plex Mono", monospace';context.textAlign='center';context.textBaseline='middle';context.fillStyle='#ffffff'
      context.fillText(`${String(index+1).padStart(2,'0')} / ${labels[index]}`,256,48)
      const texture=new THREE.CanvasTexture(labelCanvas);texture.colorSpace=THREE.SRGBColorSpace;disposables.add(texture)
      const labelMat=new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,toneMapped:false});labelMaterials.push(labelMat);disposables.add(labelMat)
      const label=new THREE.Sprite(labelMat);label.position.set(0,-.35,.7);label.scale.set(1.85,.347,1);group.add(label)
      label.userData.node=index;hitTargets.push(label)
      if(index>0){
        const start=new THREE.Vector3(0,-.23,0)
        const finish=new THREE.Vector3(...node.position as [number,number,number]);finish.y=-.23
        const mid=start.clone().lerp(finish,.5);mid.y=-.17
        const curve=new THREE.CatmullRomCurve3([start,mid,finish])
        const mat=lineMaterial.clone();disposables.add(mat)
        connections.push(drawLine(curve.getPoints(30),mat))
        pulsePaths.push(curve)
        const geometry=new THREE.SphereGeometry(.025,6,6);disposables.add(geometry)
        const pulse=new THREE.Mesh(geometry,mint);model.add(pulse);pulses.push(pulse)
      }
    })
    for(let i=-8;i<=8;i++){
      drawLine([new THREE.Vector3(i*.6,-.34,-4.5),new THREE.Vector3(i*.6,-.34,4.5)])
      drawLine([new THREE.Vector3(-4.5,-.34,i*.6),new THREE.Vector3(4.5,-.34,i*.6)])
    }
  }

  const controls=mode==='explorer'?new OrbitControls(camera,renderer.domElement):null
  if(controls){controls.enableDamping=true;controls.enableZoom=false;controls.enablePan=false;controls.minPolarAngle=.4;controls.maxPolarAngle=1.2;controls.rotateSpeed=.55;controls.target.set(0,0,0);controls.update()}
  let selected=0,paused=false,visible=true,frame=0,last=0,disposed=false,compiled=false
  let pointerX=0,pointerY=0,downX=0,downY=0
  const raycaster=new THREE.Raycaster()
  const mouse=new THREE.Vector2()
  const pointer=(event:PointerEvent)=>{
    const rect=host.getBoundingClientRect()
    pointerX=(event.clientX-rect.left)/rect.width-.5
    pointerY=(event.clientY-rect.top)/rect.height-.5
  }
  const pointerLeave=()=>{pointerX=pointerY=0}
  const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY}
  const click=(e:PointerEvent)=>{
    if(mode!=='explorer'||Math.hypot(e.clientX-downX,e.clientY-downY)>8)return
    const rect=renderer.domElement.getBoundingClientRect()
    mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)
    raycaster.setFromCamera(mouse,camera)
    const hits=raycaster.intersectObjects(hitTargets)
    if(hits.length)onSelect(hits[0].object.userData.node)
  }
  host.addEventListener('pointermove',pointer)
  host.addEventListener('pointerleave',pointerLeave)
  renderer.domElement.addEventListener('pointerdown',down)
  renderer.domElement.addEventListener('pointerup',click)
  const loss=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);onFailure()}
  renderer.domElement.addEventListener('webglcontextlost',loss)
  function resize(){
    if(disposed||!compiled)return
    const aspect=host.clientWidth/Math.max(host.clientHeight,1)
    camera.left=-extent*aspect;camera.right=extent*aspect;camera.updateProjectionMatrix()
    renderer.setSize(host.clientWidth,host.clientHeight)
    render(last)
  }
  const resizer=new ResizeObserver(resize);resizer.observe(host)
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting
    if(visible&&!paused)start()
    else cancelAnimationFrame(frame)
  },{rootMargin:'50px'});observer.observe(host)
  const visibility=()=>{if(document.hidden)cancelAnimationFrame(frame);else if(visible&&!paused)start()}
  document.addEventListener('visibilitychange',visibility)
  const timer=new THREE.Timer()
  timer.connect(document)
  function render(time:number){
    if(disposed||!compiled)return
    if(mode==='hero'&&!paused){
      model.rotation.y=THREE.MathUtils.lerp(model.rotation.y,-.2+pointerX*.3,.045)
      model.rotation.x=THREE.MathUtils.lerp(model.rotation.x,pointerY*.09,.045)
      const scroll=Math.min(1,Math.max(0,-host.getBoundingClientRect().top/window.innerHeight))
      layers.forEach((layer,i)=>{layer.position.y=(i-1.5)*(.85+scroll*.28)+Math.sin(time*.55+i*.7)*.03})
    }
    if(mode==='explorer'){
      controls?.update()
      nodeGroups.forEach((group,i)=>{ group.position.y=THREE.MathUtils.lerp(group.position.y,i===selected?.12:0,.08) })
      if(!paused)pulses.forEach((pulse,i)=>{pulse.position.copy(pulsePaths[i].getPoint((time*.13+i*.17)%1))})
    }
    renderer.render(scene,camera)
  }
  function animate(){
    if(disposed||!visible||document.hidden||paused)return
    frame=requestAnimationFrame(animate)
    timer.update();const time=timer.getElapsed()
    if(time-last<1/30)return
    last=time;render(time)
  }
  function start(){cancelAnimationFrame(frame);frame=requestAnimationFrame(animate)}
  function select(index:number){
    selected=index
    nodeMaterials.forEach((mat,i)=>{mat.color.set(i===index?'#537761':'#23332f');mat.emissive.set(i===index?'#163523':'#000000');mat.emissiveIntensity=.4})
    labelMaterials.forEach((mat,i)=>mat.color.set(i===index?'#b6f4da':'#a4b3a7'))
    connections.forEach((line,i)=>{(line.material as THREE.LineBasicMaterial).opacity=index===0||index===i+1?.65:.2})
    render(last)
  }
  // Camera interaction remains available while ambient animation is paused.
  controls?.addEventListener('change',()=>{if(paused)render(last)})
  await renderer.compileAsync(scene,camera)
  compiled=true
  resize()
  render(0);select(0);start()
  return {
    select,
    pause(value){paused=value;if(paused){cancelAnimationFrame(frame);render(last)}else if(visible)start()},
    dispose(){disposed=true;cancelAnimationFrame(frame);resizer.disconnect();observer.disconnect();timer.dispose();controls?.dispose();document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',pointerLeave);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',click);renderer.domElement.removeEventListener('webglcontextlost',loss);disposables.forEach(item=>item.dispose());envTarget.dispose();renderer.dispose();renderer.domElement.remove()},
  }
}
