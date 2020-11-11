import Fly, { useReactive, onMounted, onUpdated, useProvide, useInject, useRef, useEffect, useWatch } from 'fly-core'
import { render, findDOMNode } from 'fly-dom'
import { Transition, TransitionGroup } from 'fly-transition'

import Progress from './motion/css'
import './motion/1.css'

function App(){    
    var state = useReactive({
        count: 0,
        inProp: true
    })
    return { 
        state,
        onClick(e){
            state.inProp = !state.inProp
        }
    }
}
App.render = function(props){
    var { count, value, inProp } = this.state;
    
    return (
        <div>
            <h3>Flyjs v2.0</h3>
            <Progress></Progress>
            <button type="button" onClick={ this.onClick }>
                Click to Enter
            </button>
            <Transition in={inProp} name="my-node">
                <div>
                    {"I'll receive my-node-* classes"}
                </div>
            </Transition>
            {/* <button onClick={()=>router.push('/foo')}>push</button>
            <button onClick={()=>router.back()}>back</button>
            <button onClick={()=>router.forward()}>forward</button> */}
        </div>
    )
}

render(<App/>, document.getElementById('root'));






