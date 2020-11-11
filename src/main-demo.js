import Fly, { useReactive, onMounted, onUpdated, useProvide, useInject, useRef, useEffect, useWatch } from 'fly-core'
import { render, forceUpdate, findDOMNode } from 'fly-dom'

import App from './demo'

function update(){
    render(<App/>, document.getElementById('root'));
}

update();

window.addEventListener('hashchange', function() {     
    update();
})





