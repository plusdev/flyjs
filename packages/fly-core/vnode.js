export function useContext(){
    return currentContext;
}

var currentContext;
var currentRenderContext;

export function setCurrentContext(context){
    currentContext = context;
}

export function setCurrentRenderContext(context){
    currentRenderContext = context;
}

export function throwInRender(message){
    if(currentRenderContext) throw new Error(message);   
}

export function createVnode(type, props, key, ref){
    return {
        type,
        props,
        key,
        ref,
        children: null,		      
        // context: null,       
        // dom: null,             
        // hooks: null
    }
}

function coerceToVNode(possibleVNode) {
    var type = typeof possibleVNode;
    if (possibleVNode == null ) return null;
    if (type === 'boolean' || type === 'string' || type === 'number' || possibleVNode instanceof Date) {
    // if(possibleVNode === 0) debugger
        return createVnode(null, possibleVNode, null, null);
    }
    return possibleVNode;
}

export function toChildArray(children, flattened) {	// makeArray+
    if (flattened == null) flattened = [];
    
    // if(children === 0) debugger

    // if (children==null || typeof children === 'boolean') {		
    // 	flattened.push(null)
    // }
    if (children==null) {
        flattened.push()
    }
    else if (Array.isArray(children)) {
        for (let i=0; i < children.length; i++) {
            toChildArray(children[i], flattened);
        }
    }
    else {

        //从children中删除Fragment，不存在视觉树中
        // if(children.type == Fragment && !children.container){
        // 	toChildArray(children.props.children, flattened);
        // }else{
        // 	children = coerceToVNode(children)
        // 	flattened.push(children);
        // }	
        
        children = coerceToVNode(children)
        if(children){
        flattened.push(children);
        }        
    }

    return flattened;
}

