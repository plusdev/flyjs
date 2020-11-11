import Fly, { cloneElement, useReactive, Children, onMounted, onUnmounted, useInject, useProvide } from 'fly-core'
import AsyncValidator from 'async-validator'

export function useForm(){
    return useInject('form')
}

export function Form(){    
    useProvide('form', this);

    this.fields = [];

    this.getData=()=>{
        return this.props.model;
    }

    this.reset=()=>{
        this.fields.forEach(field=>{
            field.reset();
        })
    }

    this.validate=(fn)=>{
        return new Promise((resolve, reject)=>{
            var isValid = true,
                count = 0;
            var errors = [];

            this.fields.forEach(field=>{
                field.validate(error=>{
                    if(error) {
                        isValid = false;
                        errors.push({name: field.props.name, message: error})
                    }
                    if(++count == this.fields.length){
                        resolve(isValid, this.getData(), errors);
                        if(fn) fn(isValid, this.getData(), errors);
                    }
                })
            })
        })        
    }
    
    this.changeModel = (name, value) => {       
        this.props.onChange(name, value);
    }    
}
Form.render = (props)=>{
    var {children, model, rules} = props;
    // var {model} = this.state;

    return (
        <form className="form">
            {children}
        </form>            
    )
}

export function FormItem(){    
    var form = useForm();

    var getValue=()=>{
        return form.props.model[this.props.name];        
    }

    var state = useReactive({
        isValid: true,
        invalidMessage: '',
        defaultValue: getValue()
    })

    onMounted(()=>{        
        form.fields.push(this);
    })    

    onUnmounted(()=>{
        form.fields.splice(form.fields.indexOf(this), 1);
    })
    
    var onChange = (e)=>{        
        var {name} = this.props;
        let {onChange} = this.props.children.props;
        
        this.validate(e.target.value);
        
        form.changeModel(name, e.target.value);

        if(onChange) onChange(e);
    }

    this.reset=()=>{
        var {name} = this.props;
        // debugger
        
        form.changeModel(name, state.defaultValue);
        state.isValid = true;
        state.invalidMessage = '';
    }

    this.validate=(value, fn)=>{
        var name = this.props.name,
            rules = getRules();
            // value = this.getValue();

        if(typeof value == 'function') {
            fn = value;
            value = getValue();
        }

        var validator = new AsyncValidator({[name]: rules});
        var model = {[name]: value};

        var me = this;
        validator.validate(model, {firstFields: true}, errors=>{
            
            var invalidMessage = errors ? errors[0].message : '';
            state.isValid = invalidMessage === '';
            state.invalidMessage = invalidMessage;
            
            if(fn) fn(invalidMessage);
        })
    }

    var getRules=()=>{
        var { rules } = form.props;
        rules = rules[this.props.name];
        return rules || [];
    }

    return {
        state, getValue, onChange
    }
}
FormItem.render = function(props){       
    var {name, label, children} = props;     
    
    let {isValid, invalidMessage} = this.state;

    children = Children.map(children, (child)=>{
        return cloneElement(child, {
            value: this.getValue(),
            onChange: this.onChange
        })
    });

    return (
        <div className="form-item">
            <div>{label}</div>
            {children}
            {
                isValid ? null : <div key={name} className="form-item-error">{invalidMessage}</div>
            }
        </div>
    )
}

export function Input(){
    var state = useReactive({
        value: null
    })
}
Input.render = function(){
    var { ...rest } = this.props;
    return (
        <div className="input">
            <input {...rest}/>
        </div>
    )
}