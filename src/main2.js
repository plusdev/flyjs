import Fly, { useReactive, onMounted, onUpdated, useProvide, onUnmounted, useInject, useRef, useEffect, useWatch } from 'fly-core'
import { render, forceUpdate, findDOMNode } from 'fly-dom'
import { useStore } from 'fly-store';
import { useRouter } from 'fly-router';
import useMouse from './hooks/useMouse';

function Counter(props){
    var { label, count } = props;

    var store = useStore();
    var router = useRouter('router');
    
    var onClick=()=>{
        alert("onClick")
    }    
    
    return (
        <div style={{border: 'solid 1px blue'}}>
            <div style={{color:'blue'}}>{label}</div>
            {store}-{router}
            - {count}
            - {Date.now()}
            <button onClick={onClick}>click</button>
        </div>
    )
}
Counter.defaultProps = {
    label: 'counter'
}
// Counter.shouleUpdate = function(props, prevProps){

// }

function App(){
    var state = useReactive({
        count: 100
    })

    var { stop } = useWatch(()=>state.count, function(value, oldValue){
        document.title = value+","+oldValue;        
    })

    // var { stop } = useEffect(()=>{
    //     document.title = state.count;        
    // })

    var button = useRef();
    var counter = useRef();
    
    useProvide('store', 1);
    useProvide('router', 2);

    var mouse = useMouse();
    // var mouse = {x:0, y:0 };

    onMounted(function(){
        console.log("onMounted")
        button.current.style.color = 'red';
        // button.current.focus();
        // counter.current.doClick();
        var dom = findDOMNode(this);
        console.log(dom);
    })

    onUpdated(function(){        
        console.log("onUpdated")
    })

    onUnmounted(function(){        
        console.log("onUnmounted")
    })

    this.onClick=()=>{
        state.count++;
        // forceUpdate(this)
    }

    return {
        state,
        mouse,
        button,
        counter
    }
}
App.render = function(props){
    var { count } = this.state;
    var { mouse, counter, button } = this;    
    return (
        <div>
            <h3>Flyjs v2.0</h3>
            mouse: {mouse.x}, {mouse.y}<br />                
            count: { count }<br/>
            <Counter ref={counter} label="test" count={count}></Counter>
            <button ref={button} onClick={this.onClick}>test</button>
        </div>
    )
}

function AppWrapper(){
    var state = useReactive({
        visible: true
    })    
    return {
        state,
        destroyApp(){
            state.visible = !state.visible;
        }
    }
}
AppWrapper.render = function(props){      
    var { visible } = this.state;
    return (
        <div>
            { visible ? <App></App> : null }
            <button onClick={this.destroyApp}>destroyApp</button>
        </div>
    )
}

render(<AppWrapper/>, document.getElementById('root'));






