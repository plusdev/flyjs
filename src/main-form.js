import Fly, { useReactive, onMounted, onUpdated, useProvide, useInject, useRef, useEffect, useWatch } from 'fly-core'
import { render, findDOMNode } from 'fly-dom'
import { Form, FormItem, Input } from './form'


function FormTest(){
    var state = useReactive({
        data: {
            name: 'aaa',
            mail: '123@gmail.com'
        },        
        rules: {
            name: [{ required: true, message: '不能为空', trigger: 'blur'}],
            mail: [
                { required: true, message: '不能为空', trigger: 'blur'},
                { type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
            ]
        }
    })
    
    var onChange=(name, value)=>{
        state.data[name] = value;
    }
    
    var onSubmit=()=>{
        this.form.validate((isValid, model, errors)=>{
          if(isValid){
            alert(JSON.stringify(model));
          }else{
            alert("校验失败:\n" + JSON.stringify(errors))
          }
        })            
    }
    
    var onReset=()=>{
        this.form.reset();
    }

    return{
        state, onChange, onSubmit, onReset
    }
}

FormTest.render = function(props){
    let {data, rules} = this.state;
    return (
        <div style={{border: 'solid 1px blue'}}>
            {JSON.stringify(data)}
            <Form model={data} rules={rules} onChange={this.onChange}
                ref={(value)=>this.form=value} >
                <FormItem name="name" label="账号：">
                    <Input/>
                </FormItem>
                <FormItem name="mail" label="邮箱：">
                    <Input/>
                </FormItem>
                <input type="button" onClick={this.onSubmit} value="提交"/>
                <input type="button" onClick={this.onReset} value="重置"/>
            </Form>
        </div>
    )
}

function App(props){    
    var state = useReactive({
        count: 0,
        value: 'abc'
    })

    function onChange(e){
        state.value = e.target.value;
    }

    return {
        state, onChange
    }
}
App.render = function(){
    var { count, value } = this.state;
    return (
        <div>
            <h3>Flyjs v2.0</h3>
            <FormTest></FormTest>
            <input type="text" value={value} onChange={this.onChange}/>
            {/* {value ? null : <div>error</div>} */}
            {value}<br/>
            <button onClick={()=>this.state.count++}>test</button>
        </div>
    )
}

render(<App/>, document.getElementById('root'));






