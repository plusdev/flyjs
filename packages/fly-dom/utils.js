export function assign(to, from){
    return Object.assign(to, from);
}

export function defer(fn) {
    // return Promise.resolve().then(fn);
    return setTimeout(fn, 10);
}

export function createDom(fiber) {
    const dom =
      fiber.type
        ? document.createElement(fiber.type)
        : document.createTextNode("")        
  
    // updateDom(dom, {}, fiber.props)

    diffProps(dom, fiber, {})
    
    return dom
}


const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

////////////////////////////////////////////////////////////////////////////
export function setAttribute(dom, name, value ) {
    // 如果属性名是class，则改回className
    if ( name === 'className' ) name = 'class';
  
    // 如果属性名是onXXX，则是一个事件监听方法
    if ( /on\w+/.test( name ) ) {
        name = name.toLowerCase();
  
        // if(name == 'onchange' ){
          
        // }else{
          dom[ name ] = value || '';
        // }      
    // 如果属性名是style，则更新style对象
    } else if ( name === 'style' ) {
        if ( !value || typeof value === 'string' ) {
            dom.style.cssText = value || '';
        } else if ( value && typeof value === 'object' ) {
            for ( let name in value ) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
            }
        }    
    } else {
        // 普通属性则直接更新属性
        if ( name in dom ) {
            dom[ name ] = value || '';
        }
        if ( value ) {
            dom.setAttribute( name, value );
        } else {
            dom.removeAttribute( name, value );
        }
    }
  }
  
var EMPTY_OBJ = {};
export function diffProps(dom, newVnode, oldVNode){    
    let i,v;
    let newProps = newVnode.props == null ? EMPTY_OBJ : newVnode.props;
    let oldProps = (oldVNode && oldVNode.props != null) ? oldVNode.props : EMPTY_OBJ;
  
    //if(newVnode.type == "input") debugger
    
    if(dom.nodeType == 3) {
        if(oldProps != newProps){
            dom.textContent = newProps;
        }
        return;
    }
  
    for (i in newProps) {
        if(i == "children") continue;
        v = newProps[i];
        if(v != oldProps[i]){
          setAttribute(dom, i, v);
        }
    }
    
    for(i in oldProps){
        if(i == "children") continue;
        if(!newProps[i]){
            setAttribute(dom, i, null);
        }
    }
  
    if(dom.tagName == 'INPUT' && dom.type == 'text' && (('value' in newProps) || newProps.onChange)){    
      bindInput(dom, newProps.onChange);
      dom.onchange = null;
    }
}

function bindInput(input, handler) {          
    if(input.__change) return;
    input.__change = true;

    var oldValue = input.value;
    if(!handler) input.style["ime-mode"] = "disabled";
  
    input.addEventListener("input", function(e){            
        if(e.target.composing) return;
        if(handler){
            handler.call(this, e);
        }else{
            input.value = oldValue;
        }
    });
  
    input.addEventListener("compositionstart", onCompositionStart);
    input.addEventListener("compositionend", onCompositionEnd);
    
    function onCompositionStart (e) {
      e.target.composing = true
    }
  
    function onCompositionEnd (e) {
      // prevent triggering an input event for no reason
      if (!e.target.composing) return
      e.target.composing = false
      trigger(e.target, 'input')
    }
  
    function trigger (el, type) {
      const e = document.createEvent('HTMLEvents')
      e.initEvent(type, true, true)
      el.dispatchEvent(e)
    }
}