import { startWorkerSync } from "./fiber";
import { assign, defer } from "./utils";

export function render(element, container){
    var fiber = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: container.__root
    }

    if(fiber.alternate){
        fiber.alternate.children[0].context.__force = true;
    }
    
    startWorkerSync(fiber);

    container.__root = fiber;
}

import { forceUpdate } from './fiber/update'

export {
    forceUpdate
}

function findFirstDom(vnode){
    if(!vnode.children) return null;
    for(var child of vnode.children){
        if(child.dom) return child.dom;
        var dom = findFirstDom(child);
        if(dom) return dom;
    }
}

export function findDOMNode(context){
    return findFirstDom(context.fiber);
}

// export function findDOMNodeList(context){
    
// }

export default {
    render
}
