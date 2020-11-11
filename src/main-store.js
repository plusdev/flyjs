import Fly, { useReactive, onMounted, onUpdated, useProvide, useInject, useRef, useEffect, useWatch } from 'fly-core'
import { render, forceUpdate, findDOMNode } from 'fly-dom'
import { useStore } from 'fly-store';
import { useRouter } from 'fly-router';

import store from './store'
import useMouse from './hooks/useMouse';

function StatelessConter(props){
    var { label } = props;
    var { user } = useStore();
    
    return <div style={{border: 'solid 1px black'}}>
        <h3>{label}</h3>
        user.count: {user.count}<br/>
        <button onClick={()=>user.add()}>addUser</button>
        {Date.now()}
    </div>
}

function Counter(){
    var { user } = useStore();

    var state = useReactive({
        count: 100
    })
    return {
        state,
        user
    }
}
Counter.render = function(props){
    //this.state
    let { count } = props;
    let { user } = this;
    return (
        <div style={{border: 'solid 1px blue'}}>
            <div style={{color:'blue'}}>{props.label}</div>
            props.count: {count}<br/>
            user.count: {user.count}<br/>
            <button onClick={()=>user.add()}>addUser</button>
        </div>
    )
}
Counter.defaultProps = {
    label: 'counter'
}

function App(){ 
    var state = useReactive({
        count: 0
    })
    useProvide('store', store);    
    var { user } = useStore();
    return { 
        state, 
        user,
        onClick(e){            
            var {children} = this.props;
            state.count++
        }
    }
}
App.render = function(props){
    var { count } = this.state;
    var { user } = this;
    return (
        <div>
            <h3>Flyjs v2.0</h3>  
            <StatelessConter label="StatelessConter123"></StatelessConter>
            <Counter label="test" count={count}></Counter>
            user: {user.count} <br/>
            count: { count }<br/>
            <button onClick={ this.onClick }>test</button>
            <button onClick={()=>user.add()}>addUser</button>
        </div>
    )
}


render(<App/>, document.getElementById('root'));

