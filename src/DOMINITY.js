class DominityElement{ 

   constructor (qry){ 
     if(typeof qry=='string'){ 
       this.elem=document.querySelector(qry) 
     }else{ 
       this.elem=qry 
     } 
     if(this.elem==null){
       console.error(`DominityError: element of query '${qry}'  NOT  FOUND `)
       return
     }
     //properties goes here 
     this.dominityElem=true 
     this.childCount=this.elem.childElementCount 
     this.tag=this.elem.tagName

    
   } 
   

   //content updation 
   text(val=null){ 
     if(val==null){ 
       return this.elem.textContent 
     }else{ 
       this.elem.textContent=val 
       return this 
     } 
   }
   
   //reactive states
   reactTo(...s){
     
     let template=this.html()
     
    s.forEach((r)=>{
      
     r.subscribe((t)=>{
       if(typeof t.value!='object'){
      this.text(template.replace(new RegExp('{{'+r.name+'}}','gi'),t.value))
       }else{
         
         Object.keys(t.value).forEach((k)=>{
           this.html(template.replace(new RegExp('{{'+r.name+'.'+k+'}}','gi'),t.value[k]))
           template=this.html()
         })
       }
      
     })
     r.update()
    })
   
    return this
   }
   
   html(val=null){ 
     if(val==null){ 
       return this.elem.innerHTML 
     }else{ 
       this.elem.innerHTML=val 
       return this 
     } 
   } 
   
   code(val=null){ 
     if(val==null){ 
       return this.elem.outerHTML 
     }else{ 
       this.elem.outerHTML=val 
       return this 
     } 
   } 

   //content addition 
   addText(val=''){ 
     this.elem.textContent+=val 
     return this 
   } 
   addHtml(val=''){ 
     this.elem.innerHTML+=val 
     return this 
   } 
   addCode(val=''){ 
     this.elem.outerHTML+=val 
     return this 
   } 
  

   //content placement 
   insertHtml(placement,code){ 
     this.elem.insertAdjacentHTML(placement,code) 
     return this 
     } 
   insertTxt(placement,txt){ 
     this.elem.insertAdjacentText(placement,txt) 
     return this 
     } 
 //css styling  

   style(prp,val=null){ 
     if(typeof prp=='string'){ 
       if(val==null){ 
         return window.getComputedStyle(this.elem,null).getPropertyValue(prp) 
       }else{ 
         this.elem.style[prp]=val 
         return this 
       } 
     }else if(typeof prp=='object'){ 
       let props=Object.keys(prp) 
       let values=Object.values(prp) 
       props.forEach((p,i)=>{ 
         this.style(p,values[i]+'') 
       }) 
       return this 
     } 
   } 

   //class manipulation 
   class(){ 
     Array.from(arguments).forEach((c)=>{ 
       this.elem.classList.add(c) 
     }) 
     return this 
   } 
   removeClass() { 
     Array.from(arguments).forEach((c) => { 
       this.elem.classList.remove(c) 
     }) 
     return this 
   } 
   toggleClass() { 
     Array.from(arguments).forEach((c) => { 
       this.elem.classList.toggle(c) 
     }) 
     return this 
   } 
   hasClass(cls) { 
     return this.elem.classList.contains(cls) 
   } 
   getClass(index = 0) { 
     return this.elem.classList.item(index) 
   } 


   //attribute manipulation 
   attr(prp,val=null){ 
     if(typeof prp=='string'){ 
       if(val==null){ 
         return this.elem.getAttribute(prp) 
       }else{ 
         this.elem.setAttribute(prp,val) 
         return this 
       } 
     }else if(typeof prp=='object'){ 
       let attrs=Object.keys(prp) 
       let vals=Object.values(prp) 
       attrs.forEach((p,i)=>{ 
         this.attr(p,vals[i]) 
       }) 
       return this 
     } 
   } 
   hasAttr(val=null){ 
     if(val!=null){ 
    return this.elem.hasAttribute(val) 
     }else if(val==null){ 
       return this.elem.hasAttributes() 
     } 
   } 
   removeAttr(){ 
     Array.from(arguments).forEach((at)=>{ 
       this.elem.removeAttribute(at) 
     }) 
   } 
   toggleAttr(atr,val=""){ 
     if(this.hasAttr(atr)){ 
       this.removeAttr(atr) 
     }else{ 
       this.attr(atr,val) 
     } 
     return this 
   } 

   //value and input methods 
   value(val=null){ 
     if(val==null){ 
       return this.elem.value 
     }else{ 
       this.elem.value=val 
     } 
   } 
   

   //events manipulation 
   checkFor(e,cb,bub){
     this.elem.addEventListener(e,cb,bub) 
     return this 
   } 
   stopCheckFor(ev, func, bub) { 
     this.elem.removeEventListener(ev, func, bub) 
     return this 
   } 
   causeEvent(ev) { 
     this.elem.dispatchEvent(ev) 

     return this 
   }
  onClick(cb){
    this.checkFor('click',(e)=>{
      cb(this,e)
    })
    return this
  }
  enableHold(holdtime=0.5){
    this.isHolding=false
    const element=this
    function handleDOWN(e){

      this.isHolding=true
      this.timeout=setTimeout((e)=>{

        if(this.isHolding){

        element.causeEvent(new CustomEvent('hold',{details:e}))
        }
      },holdtime*1000)

    }
    function handleUP(e){
      this.isHolding=false
      clearTimeout(this.timeout)
    }
    this.checkFor('mousedown',handleDOWN)
    this.checkFor('touchstart',handleDOWN)
    this.checkFor('mouseup',handleUP)
    this.checkFor('touchend',handleUP)
    return this
  }

  enableSwipe(swipeDistance=50){
    this.isSwiping=false
    let sx,sy,ex,ey;
    function handleStart(e){
      e.preventDefault();
    this.isSwiping= true;

    if (e.type === 'touchstart') {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    } else if (e.type === 'mousedown') {
      sx= event.clientX;
      sy = event.clientY;
    }
    }
    function handleMove(e) {
    if (!this.isSwiping) return;

    if (e.type === 'touchmove') {
      ex = e.touches[0].clientX;
      ey= e.touches[0].clientY;
    } else if (e.type === 'mousemove') {
      ex = e.clientX;
      ey = e.clientY;
    }
  }
  let element=this
  function handleEnd(event) {
    if (!this.isSwiping) return;

    this.isSwiping = false;

    const dx = ex-sx;
    const dy= ey - sy;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    let actualDirection;
    if (Math.abs(dx) > Math.abs(dy)) {
      actualDirection = dx > 0 ? 'right' : 'left';
    } else {
      actualDirection = dy > 0 ? 'down' : 'up';
    }

    if ( distance >= swipeDistanc) {

      const swipeEvent = new CustomEvent('swipe', { direction: actualDirection ,distance:distance});
      element.dispatchEvent(swipeEvent);
    }
    // Add both touch and mouse event listeners to the element
  element.checkFor('touchstart',()=>{ handleStart(e)});
  element.checkFor('touchmove',()=>{ handleMove(e)});
  element.checkFor('touchend',()=>{handleEnd(e)});

  element.checkFor('mousedown', handleStart);
  element.checkFor('mousemove', handleMove);
  element.checkFor('mouseup', handleEnd);

  }
  return this

  }


   //dom manipulation{this} 

   addTo(elm){ 
     if(elm.dominityElem){ 
       elm.addChild(this) 
     }else{ 
       elm.appendChild(this.elem) 
     } 

     return this 
   } 

   insertTo(olb,placement){ 
          if(olb!=null){ 
         if(olb.dominityElem){ 
             olb.insertChild(placement,this.elem) 
         }else{ 
             olb.insertAdjacentElement(placement,this.elem) 
         } 
     }} 

   remove(){ 
     this.elem.remove() 
     return this 
   } 

   _el(el,t='',o={}){
     return this.create(el).text(t).attr(o)
     
   }
   
   
  create(el){
    this.addedChild=create(el)
    this.addChild(this.addedChild)
    return this.addedChild
  }
   addChild(){ 
     Array.from(arguments).forEach((child)=>{ 

       if(child.dominityElem){ 
         this.elem.appendChild(child.elem) 
       }else{ 
         this.elem.appendChild(child) 
       } 

     }) 

     return this 
   } 
   insertChild(placement, nod) { 
     this.elem.insertAdjacentElement(placement, nod) 
     return this 
   }   
   removeChild(){ 
     Array.from(arguments).forEach((nod)=>{ 
       this.elem.removeChild(this.elem.childNodes[nod]) 
     }) 
       return this 
   } 

   replaceChild(child, nod) { 
     this.elem.replaceChild(nod, child) 

     return this 
   } 

   getChild(t) { 

     return new DominityElement(this.elem.querySelector(t)) 
   } 
   getChildren(q) { 
     return Array.from(this.elem.querySelectorAll(q)).map(x => new DominityElement(x)) 
   } 

   child(pos){ 
     return new DominityElement(this.elem.children[pos]) 
   } 

   parent() { 
     return new DominityElement(this.elem.parentNode) 

   }
   $end(){
     return this.parent()
   }
   

   next(){ 
       return new DominityElement(this.elem.nextElementSibling) 
   } 

   previous (){ 
       return new DominityElement(this.elem.previousElementSibling) 
   } 

  clone(condition = true) {
    return new DominityElement(this.elem.cloneNode(condition))
  }
  cloneContent(condition=true){
    return new DominityElement(this.elem.content.cloneNode(condition))
  }


  closest(q){ 
     return new DominityElement(this.elem.closest(q))    
  } 

  contains(nod){ 
    if(nod.dominityElem){ 
    return this.elem.contains(nod.elem) 
    }else{ 
         return this.elem.contains(nod) 

    } 
  } 

  matches(q){ 
    if(typeof q=='string'){ 
      return this.elem.matches(q) 
    }else if(typeof q=='object'){ 
      if(q.dominityElem){ 
        return q===this 
      }else{ 
        return q===this.elem 
      } 
    } 
  } 

  //appearance 
  hide() { 
    this.style("display", "none"); 
    return this 
  } 
  show(disp = "block") { 
    this.style("display", disp); 
    return this 
  } 
  toggleHide(ondisp, onhide) { 
    if (this.style("display") == "none") { 
      this.show() 
      if (ondisp != undefined) { 
        ondisp(new DominityElement(this.elem)) 
      } 
    } else if (this.style("display") != "none") { 
      this.hide() 
      if (onhide != undefined) { 
        onhide(new DominityElement(this.elem)) 
      } 
    } 

    return this 
  }
  //reactive functions
  showIf(bool){
    let elemS=this
    if(bool instanceof reactive){

      bool.subscribe((data)=>{
        elemS.showIf(data.value)
      })
      bool.update()
      
      return this
    }

    if(bool){
      this.show()
    }else{
      this.hide()
    }
    return this
    
  }
  
  loops(list,callback){
    let elemS=this
    if(list instanceof reactive){
      list.subscribe((data)=>{
        elemS.html('')
        data.value.forEach((item,count)=>{
          callback(item,elemS,count)
        })
      })
      list.update()
      return this
    }
    console.error('DominityError: list item for ._elFor has to be a reactive object made with reactable(')
    return this
  }
  
  modal(target){
    let linkValue=(data)=>{
      
      this.attr('value',data.value)
      
    }
    if(target instanceof reactive){
      target.subscribe(linkValue)
      target.update()
    }
    
    this.checkFor('input',()=>{
      target.set(this.value())
    })
    
    return this
  }
  

  //actions
  focus(val = true) { 
    if (val == true) { 
      this.elem.focus() 
    } else if (val == false) { 
      this.elem.blur() 
    } 
    return this 
  } 

  click(){ 
    this.elem.click() 

    return this 
  } 

  scrollTo(s = true) { 
    this.elem.scrollIntoView(s) 
    return this 
  } 

  getScrollInfo(){ 
    return { 
      height:this.elem.scrollHeight, 
      width:this.elem.scrollWidth, 
      x:this.elem.scrollLeft, 
      y:this.elem.scrollTop 
    } 
  } 


  getSizeInfo(){ 
    return this.elem.getBoundingClientRect() 
  } 

  fullScreen(val = true) { 
    if (val == true) { 
      if (this.elem.requestFullScreen) { this.elem.requestFullScreen() } 
      else if (this.elem.webkitRequestFullscreen) { 
        this.elem.webkitRequestFullscreen() 
      } else if (this.elem.msRequestFullScreen) { 
        this.elem.msRequestFullscreen() 
      } 

    } else { 
      if (this.elem.exitFullScreen) { this.elem.exitFullScreen() } 
      else if (this.elem.webkitExitFullscreen) { 
        this.elem.webkitExitFullscreen() 
      } else if (this.elem.msExitFullScreen) { 
        this.elem.msExitFullscreen() 
      } 
    } 

    return this 
  } 


 } 


 class finderAll{ 
     constructor(qry){ 
        this.elemArr=[] 
         document.querySelectorAll(qry).forEach((e)=>{ 
             this.elemArr.push(new DominityElement(e)) 
         }) 

         return this.elemArr 
     } 
 }
 
 

 


 //fuctions-------------------------


 //make elem 
 function create(eli,app=true,target=document.body) { 
     this.element=document.createElement(eli) 
     if(app){ 
     target.appendChild(this.element) 
     } 
     return new DominityElement(this.element) 
 } 
//el
function el(typ,txt='',attrs={}){
  if(typeof txt!=Object){
  return create(typ).text(txt).attr(attrs)
  }else{
    return create(typ).addChild(txt).attr(attrs)
  }
}

//find 
function $el(qry){
  return new DominityElement(qry)
}
function $$el(qry){
  return new finderAll(qry)
}





 //repeat 

 function repeat(cd,limit,jump=1,ti=0.07) { 
     this.cnt=1 
     this.cntrl="this.cnt+="+jump 
     this.code="()=>{"+cd+";if(this.cnt>="+limit+"){clearInterval(this.inter)}else{"+this.cntrl+"}}" 
     this.inter=setInterval(eval(this.code),ti*1000); 
 } 




 //range 
 function range(s,e,ingrement=1){ 
     let nums=[] 


     if(typeof s=="string" && typeof e=="string"){ 

     for(i=s.charCodeAt(0)-96;i<e.charCodeAt(0)-96+1;i+=ingrement){ 
         nums.push(i) 
     } 
         return nums.map((c)=>{ 
             return  String.fromCharCode(96+c) 
         }) 


     }else if(typeof s=="number" && typeof e=="number"){ 
     for(i=s;i<e+1;i+=ingrement){ 
         nums.push(i) 
     } 

     return nums 
     } 
 } 



 //random 

 function random(end,start=0){ 
     if(Array.isArray(end)){ 
         return end[Math.floor(Math.random()*(end.length-start))+start] 
     }else{ 
         return Math.floor(Math.random()*(end-start))+start 

     } 

 } 


 //copy function 
 function copy(txt){ 
                     let input=create("input"); 


                 input.val(txt) 
                 input.elem.select(); 
                 input.elem.setSelectionRange(0, 99999);  
                 document.execCommand("copy"); 
                 input.remove()           
 } 

//reactable 

class reactive{
  constructor(value){
    this.value=value
    this.subscribers=[]
    this.name=''
    
  }
  as(na){
    this.name=na
    return this
  }
  subscribe(callback){
    this.subscribers.push(callback)
  }
  unsubscribe(callback){
    this.subscribers.pop(subscribers.indexOf(callback))
  }
  set(newval){
    this.value=newval
    this.update()
  }
  get(prop=''){
    if(prop!=''){
    return this.value[prop]
    }else{
      return this.value
    }
  }
  setProp(prop,val){
    this.value[prop]=val
    update()
  }
  deriveFrom(reaction,callback){
    if(reaction instanceof reactive){
      reaction.subscribe(()=>{
        this.set(callback(reaction.value))
      })
      reaction.update()
      return this
    }
    
  }
  
  update(){
    this.subscribers.forEach(callback=>{
      callback(this)
    })
    
  }
  
}

function reactable(ini){
  return new reactive(ini)
}


