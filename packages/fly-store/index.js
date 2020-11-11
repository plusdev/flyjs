import { useInject, useReactive } from "fly-core";

export function useStore(){
    return useInject('store');
}

export class Store{
    constructor(models){
        for(var model of models){
            createModel(this, model)
        }
    }
    
    // static install = function(fly){
    //     after(fly, 'onBeforeCreate', function(props, ctx){
            
    //         if(ctx.parent){
    //             ctx.store = ctx.parent.store;
    //         }
    //     })
    // }
}


function createModel(store, model){
    model.state = useReactive(model.state || {});
    model.store = store;

    var inMethod = false;

    var handlers = {
        get: function(target, key){
            if(key in target) return target[key];
            return target.state[key];
        },
        set: function(target, key, value){
            if(!inMethod) throw new Error("Cannot directly set the state value.");
            target.state[key] = value;
            return true;
        }
    }

    var proxy = new Proxy(model, handlers)
    store[model.name] = proxy;
    
    function bind(fn){
        return async function(...args){
            inMethod = true;
            var result = await fn.apply(proxy, args);
            inMethod = false;
            return result;
        }
    }

    for(var key in model){
        var val = model[key];
        if(typeof val == 'function'){
            model[key] = bind(val);
        }
    }

}