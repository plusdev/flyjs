import { isObject } from "../utils";
import { throwInRender } from "../vnode";

const toProxy = new WeakMap();      
const toRow = new WeakMap();

const handlers = {
    get(target, key, receiver){
        var value = Reflect.get(target, key, receiver);
        // if(isRef(value)) value = value.value;

        track(target, key);

        return isObject(value) ? useReactive(value) : value;
    },
    set(target, key, value, receiver){
        var oldValue = target[key];

        var result = Reflect.set(target, key, value, receiver);        
        trigger(target, key, value, oldValue);
                
        return result;
    },
    deleteProperty(target, key){
        return Reflect.deleteProperty(target, key)
    }
}

export function useReactive(target){

    // if(target.x != null) debugger

    // throwInRender('useReactive cannot be used in render.');

    var observed = toProxy.get(target);
    if(observed){
        return observed;
    }

    if(toRow.has(target)){
        return target;
    }

    observed = new Proxy(target, handlers);
    toProxy.set(target, observed);
    toRow.set(observed, target);
    
    return observed;
}

const EMPTY_OBJ = {};

export function useEffect(fn, options = EMPTY_OBJ){
    // throwInRender('useEffect cannot be used in render.');

    var effect = createReactiveEffect(fn, options);
    if(!options.lazy){
        effect();
    }
    return effect;
}

function createReactiveEffect(fn, options){
    // options = { lazy, computed, scheduler, onTrack, onTrigger, onStop }
    var effect = function(...args){
        return run(effect, fn, args);
    }    
    effect.raw = fn;
    effect.options = options;
    effect.deps = [];
    effectHandler(effect);

    effect.stop = function(){
        stop(effect)
    }
    return effect;
}

const activeEffectStack = [];
function run(effect, fn, args){
    if(activeEffectStack.indexOf(effect) == -1){
        try{
            activeEffectStack.push(effect);            
            return fn(...args);
        }finally{
            activeEffectStack.pop();
        }
    }
}

var effectHandler = function (effect){

}
export function setEffectHandler(handler){
    effectHandler = handler;
}

// 存储effect
const targetMap = new WeakMap()

export function track(target, key){
    const effect = activeEffectStack[activeEffectStack.length - 1];
    if(effect){
        var depsMap = targetMap.get(target);
        if(!depsMap){
            depsMap = new Map();
            targetMap.set(target, depsMap);
        }
        var dep = depsMap.get(key);
        if(!dep){
            dep = new Set();
            depsMap.set(key, dep);
        }
        if(!dep.has(effect)){
            dep.add(effect);
            effect.deps.push(dep);
        }
    }
}

export function trigger(target, key, newValue, oldValue){
    var depsMap = targetMap.get(target);
    if(!depsMap) return;
    var deps = depsMap.get(key);
    if(!deps) return;

    deps.forEach(effect=>{
        if(effect.options.onTrigger){
            effect.options.onTrigger({
                effect,
                target,
                key,
                newValue,
                oldValue
            })
        }
        effect();
    })
}

function stop(effect){
    clearup(effect);
    if(effect.options.onStop){
        effect.options.onStop();
    }
}

function clearup(effect){
    var deps = effect.deps;
    deps.forEach(dep=>{
        dep.delete(effect);
    })
    deps.length = 0;
}

export function useWatch(target, fn, options){
    var value;

    // throwInRender('useWatch cannot be used in render.');
    
    var first = true;
    var reactiveEffect = useEffect(function(){
        var oldVal = value;
        if(typeof target == "function") value = target();
        else {
            value = target;
            if(first){
                JSON.stringify(target);
            }
        }        
        if(first){
            first = false;            
        }else{
            fn(value, oldVal);
        }
    }, options)
    return reactiveEffect;
    // return function(){
    //     stop(reactiveEffect);
    // }
}

// export function watchEffect(fn, options){
//     var reactiveEffect = effect(fn, options)
//     return function(){
//         stop(reactiveEffect)
//     }
// }