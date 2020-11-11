import { onMounted, onUnmounted, useContext, useEffect, useReactive, throwInRender } from 'fly-core'
import { findDOMNode, forceUpdate } from 'fly-dom';

export default function useMouse(){
    var mouse = useReactive({
        x: 0, y: 0
    });

    // var store = useStore(); 
    // alert(store);

    useEffect(()=>{
        document.title = mouse.x+","+mouse.y;
    })

    function onMove(e){
        mouse.x = e.pageX;
        mouse.y = e.pageY;        
    }    

    // var context = useContext();
    
    onMounted(()=>{
        window.addEventListener('mousemove', onMove);

        // var dom = findDOMNode(context);
        // dom.addEventListener('click', function(){

        // })
    })

    onUnmounted(()=>{
        window.removeEventListener('mousemove', onMove);
    })

    return mouse;
}