import Fly, {useContext} from 'fly-core';
import {forceUpdate} from 'fly-dom';
import routes from './routes';

export default function App(){
    
    var path = window.location.hash.substr(1);

    var obj = routes;

    
    path.split('/').forEach(name=>{
        if(!name) return;
        name =name.toLowerCase(); 
        var parent = obj;
        obj = obj[name];

        if(obj.then){
            obj.parent = parent;
            obj.name = name;
        }
        
    })
    
    var Component = obj;
    
    if(path == ""){
        
        function createExamples(component, componentName){
            var children = [];
            for(var name in component){
                var path = "#"+componentName+"/"+name;
                children.push(<li>
                    <a href={path} onClick={(e)=>{
                        // e.preventDefault();                        
                        // window.location.hash = path;
                        // window.location.reload();
                    }}>{name}</a>
                </li>)
            }
            return children;
        }

        function createLinks(){
            var children = [];
            for(var name in routes){
                children.push(<li>
                    <a>{name}</a>
                    <ul>                    
                        { createExamples(routes[name], name) }
                    </ul>
                </li>)
            }
            return children;
        }

        return <ul>
            {
                createLinks()
            }
        </ul>
        
        return children;
    }

    var context = useContext();

    if(Component.then){
        Component.then(module=>{
            Component.parent[Component.name] = module.default;
            forceUpdate(context)
        })
        return <div>Loading</div>
    }

    return <Component />;
}

