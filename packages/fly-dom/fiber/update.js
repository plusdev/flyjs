import { startWorkerSync } from ".";
import { assign, defer } from "../utils";

export function forceUpdate(context){
    enqueueRender(context.fiber)
}

var updateQueue = new Set();
var updateTimer;

export function unqueueRender(fiber){
    // if(updateQueue.has(fiber)) debugger
    updateQueue.delete(fiber);
    if(fiber.alternate) updateQueue.delete(fiber.alternate);
}

function enqueueRender(fiber){
    updateQueue.add(fiber);
    if(updateTimer) {
        clearTimeout(updateTimer)
    }
    updateTimer = defer(function(){
        
        updateTimer = null;

        var fibers = Array.from(updateQueue);
        
        fibers.sort((a, b) => {            
            return getLevel(a) - getLevel(b)
        })
        
        fibers.forEach(fiber=>{
            if(!updateQueue.has(fiber)) {                
                return;
            }

            var newFiber = assign({}, fiber);
            newFiber.alternate = fiber;
            fiber.context.__force = true;
            
            if(newFiber.async){
                // startWorkerAsync(newFiber);
            }else{
                startWorkerSync(newFiber);
            }
        })
        updateQueue.clear();
    })
}

function getLevel(vnode){
    var level = 0;
    while(vnode){
        level++;
        vnode = vnode.parent;
    }
    return level;
}