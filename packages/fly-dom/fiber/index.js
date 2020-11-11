import { forceUpdate } from "..";
import { setEffectHandler, useEffect } from "fly-core/reactive";
import { setCurrentContext, setCurrentRenderContext, toChildArray, useContext } from "fly-core/vnode";
import { assign, createDom, diffProps, shallowEqual } from "../utils";
import { createUpdateQueue, updatePosition, syncInsertDom } from "./dom";
import { unqueueRender } from "./update";


function commitRoot(){
    
    var oldFiber = currentRoot.alternate;
    if(oldFiber && oldFiber.parent){
        oldFiber.parent.children[oldFiber.index] = currentRoot;
        currentRoot.index = oldFiber.index;
    }

    deletions.forEach(commitDeletion);
    // debugger
    commitWork(currentRoot);

    currentRoot = null;
    deletions = null;
}

function commitWork(fiber){
    var c = fiber.context,
        isNew = !fiber.alternate;

    if(c){
        if(isNew){
            callHook(c, 'onBeforeMount')
        }else{
            callHook(c, 'onBeforeUpdate')
        }        
    }

    if(fiber.dom){
        if(fiber.effectTag == 'PLACEMENT'){
            // debugger
            syncInsertDom(fiber);
        }else if(fiber.effectTag == 'UPDATE'){
            if(fiber.updateQueue){
                
            }else{
                diffProps(fiber.dom, fiber, fiber.alternate);
            }
            if(fiber.syncPosition) {                
                syncInsertDom(fiber)
            }
        }
    }

    delete fiber.effectTag;
    delete fiber.updateQueue;
    delete fiber.syncPosition;

    if(fiber.children){
        for(var child of fiber.children){
            commitWork(child);
        }
    }

    if(c){
        if(isNew){
            callHook(c, 'onMounted')
        }else{
            callHook(c, 'onUpdated')
        }        
    }
    
}

function commitDeletion(fiber){
    

    var c = fiber.context;
    if(c){
        callHook(c, 'onBeforeUnmount')
    }
    
    if (fiber.dom && fiber.dom.parentNode) {
        fiber.dom.parentNode.removeChild(fiber.dom)
    }

    if(fiber.children){
        for(var child of fiber.children){
            commitDeletion(child);
        }
    }

    if(c){
        
        clearupEffects(c);

        callHook(c, 'onUnmounted')
    }
}
///////////////////////////////////////////////////////
var effectsMap = new Map();

setEffectHandler(function(effect){
    var context = useContext();
    if(context){
        var set = effectsMap.get(context);
        if(!set) {
            set = new Set();
            effectsMap.set(context, set);
        }
        set.add(effect);
    }
})

function clearupEffects(context){
    // alert("clearupContextEffect")
    var set = effectsMap.get(context);
    // if(!set) debugger
    var effects = Array.from(set);
    effects.forEach(effect=>{
        effect.stop();
    })
    set.clear();
    effectsMap.delete(context);
}

///////////////////////////////////////////////////////
var currentRoot = null;
var nextUnitOfWork = null;
var deletions = null;
var rootQueue = [];

export function startWorkerSync(fiber){

    currentRoot = fiber;
    nextUnitOfWork = currentRoot;
    deletions = [];        

    while(nextUnitOfWork ){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    commitRoot();
}

///////////////////////////////////////////////////////
function performUnitOfWork(fiber){
    var next;
    if(typeof fiber.type == 'function'){              
        next = updateFunctionComponent(fiber);
    }else{
        next = updateHostElement(fiber);
    }
    
    var firstChild = fiber.children ?  fiber.children[0] : null;    
    if(firstChild && next !== false){
        return firstChild;
    }
    
    while(fiber && fiber.parent){
        if(fiber == currentRoot) return null;
        var sibling = fiber.parent.children[fiber.index+1];
        if(sibling) {
            return sibling;
        }
        fiber = fiber.parent;
    }
}

function updateFunctionComponent(fiber){
    var oldFiber = fiber.alternate,    
      isNew = !oldFiber,      
      c;        

    var props = fiber.props;
    if(fiber.type.defaultProps){
        props = assign({}, fiber.type.defaultProps);
        props = assign(props, fiber.props);
    }

    var render = fiber.type.render || fiber.type;
    var isStatelessComponent = render == fiber.type;               
    var children;

    if(oldFiber){
        c = oldFiber.context;
        fiber.children = oldFiber.children;        
        // render = c.render || fiber.type.render || fiber.type;
        
        // props = assign(c.props, props);
    }else{
        c = { props, fiber };
        setCurrentContext(c);

        var initialized = false;
        useEffect(()=>{
            if(!initialized){
                var args = [];
                if(isStatelessComponent) args.push(props);
                var options = fiber.type.apply(c, args);
                if(isStatelessComponent){
                    children = options;
                }else{
                    assign(c, options);
                    for(var key in c){
                        if(typeof c[key] == 'function'){
                            c[key] = c[key].bind(c);
                        }
                    }
                }
                initialized = true;
            }else{
                if(isStatelessComponent){
                    forceUpdate(c);
                }
            }            
        })
    }

    if(c.render) throw new Error();

    var shouldUpdate = true;
    if(!isNew && !c.__force){
        if(fiber.type.shouldUpdate){
            shouldUpdate = fiber.type.shouldUpdate(fiber.props, oldFiber.props);
        }else{
            shouldUpdate = !shallowEqual(fiber.props, oldFiber.props);    
        }        
    }
    delete c.__force;

    c.props = props;
    c.fiber = fiber;
    fiber.context = c;

    if(!shouldUpdate){
        setCurrentContext(null);
        return false;
    }

    // if(isNew){
    //     callHook(c, 'onBeforeMount')
    // }else{
    //     callHook(c, 'onBeforeUpdate');
    // }

    setCurrentContext(fiber.context)

    setCurrentRenderContext(c)
    if(isNew){
        if(!isStatelessComponent){
            var first = true;
            useEffect(()=>{
                if(first){
                    children = render.call(c, props);
                }else{
                    forceUpdate(c);
                }
                first = false;     
            })
        }
    }else{
        children = render.call(c, props);
    }
    setCurrentRenderContext(null)

    reconcileChildren(fiber, children);

    setCurrentContext(null);
    applyRef(fiber, c)

    unqueueRender(fiber);
}

function updateHostElement(fiber){
    if (!fiber.dom) {        
        fiber.dom = createDom(fiber)
    }
    var children = fiber.props ? fiber.props.children : null;    
    if(children != null){
        reconcileChildren(fiber, children)
    }
    applyRef(fiber, fiber.dom)
}

function applyRef(fiber, obj){
    var ref = fiber.ref;
    if(ref) {        
        var type = typeof ref;
        if(type == 'object') ref.current = obj;        
        else if(type == 'function') ref(obj);        
    }
}

var EMPTY_ARR = [];

function reconcileChildren(parent, children){
    children = toChildArray(children);
    parent.children = children;

    var oldParent = parent.alternate;
    var oldChildren = oldParent ? oldParent.children : EMPTY_ARR;
    oldChildren = [].concat(oldChildren);  

    for(var i=0, l=children.length; i<l; i++){
        var child = children[i];
        child.parent = parent;
        child.index = i;

        if(child.key == 'name') debugger
        
        var oldChild = findSameChild(child, i, oldChildren);

        if(oldChild){
            child.dom = oldChild.dom;
            child.alternate = oldChild;
            child.effectTag = "UPDATE";
            // createUpdateQueue(child);
            updatePosition(child);
        }else{
          child.effectTag = "PLACEMENT";          
        }
    }
    
    for (let i=oldChildren.length; i--; ) {
        let child = oldChildren[i];
        if (child!=null) {
            child.effectTag = "DELETION"
            deletions.push(child)
        }
    }
}

function findSameChild(child, i, oldChildren){
    var oldChild = oldChildren[i];
    if (oldChild && child.key == oldChild.key && child.type === oldChild.type) {
      oldChildren[i] = undefined;
    }else{
      for (let j = 0, k= oldChildren.length; j<k; j++) {    //这里的遍历可以优化
        oldChild = oldChildren[j];
        if (oldChild && child.key == oldChild.key && child.type === oldChild.type) {
          oldChildren[j] = undefined;
          break;
        }
        oldChild = null;
      }
    }
    return oldChild;
}

////////////////////////////////////////////////
export function getCurrentFiber(){
    return currentFiber;
}

function callHook(context, name){
    var handlers = context[name];
    if(handlers && !Array.isArray(handlers)) handlers = [handlers];
    if(handlers){
        for(var handler of handlers){
            handler.call(context);
        }
    }
}
