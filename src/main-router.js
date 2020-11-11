import Fly, { useReactive, onMounted, onUpdated, useProvide, useInject, useRef, useEffect, useWatch } from 'fly-core'
import { render, findDOMNode } from 'fly-dom'
import { useStore } from 'fly-store'
import { Link, RouterView } from 'fly-router'
import router from './router'
import store from './store'

function App(){
    var state = useReactive({
        count: 0,
        value: 'abc'
    })
    
    useProvide('store', store)
    useProvide("router", router);

    function onChange(e){
        state.value = e.target.value;
    }
    
    return {
        state, router, onChange
    }
}
App.render = function(props){
    var { count, value } = this.state;

    var { user } = useStore();
    
    return (
        <div>
            <h3>Flyjs v2.0</h3>
            <ul>
                <li><Link to="/">/</Link></li>
                <li><Link to="/foo">/foo</Link></li>
                <li><Link to="/bar">/bar</Link></li>
                <li><Link to="/user/123">/user</Link></li>
                <li><Link to="/process/123/delete?a=1&b=2">/process</Link></li>
            </ul>
            <RouterView></RouterView>
            <button onClick={()=>router.push('/foo')}>push</button>
            <button onClick={()=>router.back()}>back</button>
            <button onClick={()=>router.forward()}>forward</button>
            <div>
                user.count: {user.count}    
                <button onClick={()=>user.add()}>addUse</button>
            </div> 
        </div>
    )
}

render(<App/>, document.getElementById('root'));






