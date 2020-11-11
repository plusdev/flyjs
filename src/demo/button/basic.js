import Fly from 'fly-core';

function Button(props){
    var { label, onClick } = props;
    return (
        <button onClick={onClick}>{label}</button>
    )
}

function Demo(){

}
Demo.render = function(){
    return (
        <div>
            444
            <Button label={"按钮"} onClick={()=>alert(1)}></Button>
        </div>
    )
}

export default Demo;