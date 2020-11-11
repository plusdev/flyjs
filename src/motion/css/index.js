import Fly, {useReactive} from 'fly-core';

// import React, { Component } from '../../../rockjs';

import './index.css';

export default function Progress(){
    var state = useReactive({
        percent: 10
    });

    var increase = () => {
        const percent = state.percent + 10;
        state.percent = percent > 100 ? 100 : percent;       
    }

    var decrease = () => {
        const percent = state.percent - 10;
        state.percent = percent < 0 ? 0 : percent;        
    }    

    return { 
        state, increase, decrease
    }
}

Progress.render = function(props) {
    const { percent } = this.state;

    return (
        <div className="demo-css">
            <div className="progress">
                <div className="progress-wrapper" >
                    <div className="progress-inner" style = {{width: `${percent}%`}} ></div>
                </div>
                <div className="progress-info" >{percent}%</div>
            </div>
            <div className="btns">
                <button onClick={this.decrease}>-</button>
                <button onClick={this.increase}>+</button>
            </div>
        </div>
    );
}