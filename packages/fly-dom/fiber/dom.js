var EMPTY_OBJ = {};

//需要合并之前计算节点的updateQueue属性！
export function createUpdateQueue(child){
    
    delete child.updateQueue;
    var oldChild = child.alternate;
    
    if(child.dom){
        if(child.dom.nodeType == 3){
            if(child.props != oldChild.props){
                child.updateQueue = [];
                child.updateQueue.push("textContent", child.props);
            }
        }else{
            let newProps = child.props == null ? EMPTY_OBJ : child.props;
            let oldProps = oldChild.props == null ? EMPTY_OBJ : oldChild.props;
            
            for(var key in newProps){
                if(key == 'children') continue;
                var val = newProps[key];
                var oldVal = oldProps[key];
                if(key == 'style'){
                    val = getStyleText(val);
                    oldVal = getStyleText(oldVal)
                }
                if(key == 'defaultValue') {
                    if(child.dom.tagName == 'INPUT' && child.dom.defaultValue) continue;
                }
                if(val != oldVal){
                    if(!child.updateQueue) child.updateQueue = [];
                    // debugger
                    if(key.indexOf("on") == 0) key = key.toLowerCase();                            

                    child.updateQueue.push(key, val);
                }
            }

            for(var key in oldProps){
                if(key == 'children') continue;
                if(newProps[key] === undefined){
                    if(!child.updateQueue) child.updateQueue = [];
                    // debugger
                    if(key.indexOf("on") == 0) key = key.toLowerCase();
                    
                    child.updateQueue.push(key, null);
                }
            }
        }



        // if(child.updateQueue){
        //     effectList.push(child);
        // }

    }else{
        // effectList.push(child);
    }
}

export function updatePosition(child){
    var oldChild = child.alternate;
    var oldChildren = oldChild.parent.children;
    var children = child.parent.children;

    var oldPrevFiber = oldChildren[oldChild.index-1];
    var prevFiber = children[child.index-1];

    if(!oldPrevFiber && !prevFiber){

    }else if(oldPrevFiber && prevFiber){            
        if(oldPrevFiber.dom != prevFiber.dom){
            child.syncPosition = true;
            child.updateQueue = [];
        }
    }else{
        child.syncPosition = true;
        child.updateQueue = [];
    }
}

/////////////////////////////////////////////////////
export function syncInsertDom(child){
    var prevDom = findPrevDom(child);
    if(prevDom){
        if(prevDom.nextSibling != child.dom){    
            var parentDom = prevDom.parentNode;
            if(prevDom.nextSibling){
                parentDom.insertBefore(child.dom, prevDom.nextSibling);
            }else{
                parentDom.appendChild(child.dom);
            }
        }
    }else{
        var parentDom = findParentDom(child);
        if(parentDom && parentDom != child.dom.parentNode){
            parentDom.appendChild(child.dom);

            // if(parentDom.firstChild != child.dom){

            // }
            // // if(parentDom.nodeType == 3) debugger
            // if(parentDom.firstChild){
            //     parentDom.insertBefore(child.dom, parentDom.firstChild);
            // }else{
            //     parentDom.appendChild(child.dom);
            // }
        }
    }
}

function findParentDom(vnode){
    while (vnode.parent) {
        vnode = vnode.parent;
        if(vnode.dom) return vnode.dom;
    }
}

function findPrevDom(vnode){
    if(!vnode.parent) return null;      
    var parent = vnode.parent,
        children = parent.children;

    var prevNode = children[vnode.index-1];  
    while(prevNode){
        if(prevNode.dom) return prevNode.dom;
        var dom = findLastDom(prevNode);
        if(dom) return dom;     
        prevNode = children[prevNode.index-1];  
    }
    
    //如果父组件有dom，则不用继续找
    if(parent.dom) return null;
    return findPrevDom(parent);      
}

function findLastDom(vnode){
    var children = vnode.children;
    for(var i = children.length-1; i>=0; i--){
        var child = children[i];
        var dom = child.dom;
        if(dom){
            return dom;
            // if(dom.parentNode == parentDom) return dom;
            // return null;
        }
        dom = findLastDom(child);
        if(dom) return dom;
    }
}