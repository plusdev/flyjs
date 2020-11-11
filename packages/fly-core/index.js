import { useReactive, useEffect, useWatch } from './reactive'
import { createVnode, useContext, throwInRender } from './vnode';
import { makeArray } from './utils'

export function createElement(type, props, ...children){
    props = {
        ...props,
        children
    }   
    
    if(arguments.length == 3) props.children = arguments[2];
    if(arguments.length < 3) props.children = null;
    
    var { key, ref } = props;
    delete props.key;
    delete props.ref;
    return createVnode(type, props, key, ref)
}

export function Fragment(){
    this.render = function(props){
        return props.children;
    }
}

export function cloneElement(vnode, props, children) {
	props = Object.assign(Object.assign({}, vnode.props), props);
	if (arguments.length>2) children = [].slice.call(arguments, 2);
    return createElement(vnode.type, props, children);
}


function bindHook(name, hook){
    throwInRender('Life cycle hooks cannot be bound in render.')
    var context = useContext();
    if(!context[name]) context[name] = [];
    context[name].push(hook);
}

export function onBeforeMount(hook){
    bindHook("onBeforeMount", hook)
}

export function onMounted(hook){    
    bindHook("onMounted", hook)
}

export function onBeforeUpdate(hook){
    bindHook("onBeforeUpdate", hook)
}

export function onUpdated(hook){
    bindHook("onUpdated", hook)
}

export function onBeforeUnmount(hook){
    bindHook("onBeforeUnmount", hook)
}

export function onUnmounted(hook){
    bindHook("onUnmounted", hook)
}

export function useProvide(name, value){
    var context = useContext();
    if(!context.provide){
        context.provide = {};
    }
    context.provide[name] = value;
}

export function useInject(name){
    var context = useContext();
    while(context){
        if(context.provide && context.provide[name] != null) return context.provide[name];
        context = findParent(context);
    }
}

export function findParent(context){
    var fiber = context.fiber.parent;
    while(fiber){
        if(fiber.context) return fiber.context;
        fiber = fiber.parent;
    }
}

// export function findChildren(context){
//     var children = [];
//     function each(fiber){
//         if(fiber.children){
//             for(var child of fiber.children){
//                 if(child.context){
//                     children.push(child.context);
//                 }else{
//                     each(child);
//                 }
//             }
//         }
//     }
//     each(context.fiber);
//     return children;
// }

export function useRef(){
    return {};
}



export {
    useReactive,
    useEffect,
    useWatch,

    useContext,
    throwInRender
}    

export default {
    createElement    
}


export var Children = {
    map: function(children, fn){
        children = makeArray(children);
        return children.map(fn);
    },
    forEach: function(children, fn){
        children = makeArray(children);
        children.forEach(fn);
    },
    count: function(children){
        children = makeArray(children);
        return children.length;
    },
    only: function(children){
        children = makeArray(children);
        if(children.length > 1) throw new Error()
        return children[0];
    },
    toArray: function(children){
        children = makeArray(children);
        children.forEach(function(item, index){
            if(item.key) item.key = item.key + '-' + index;
            else item.key = index;
        })
        return children;
    }
}
