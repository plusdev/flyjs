import Fly, {useReactive} from 'fly-core';

function Input(props){
    var { value, onChange } = props;
    return (
        <input type="text" value={value} onChange={onChange} />
    )
}

export default function Demo(){

    var state = useReactive({
        value: 'abc'
    })

    function onChange(e){
        state.value = e.target.value;
    }
    return {
        state, onChange
    }
}

Demo.render = function(){
    var { value } = this.state;
    return (
        <div>
            111
            <Input value={ value } onChange={this.onChange}></Input>
            {value}
        </div>
    )
}