import Fly, { useInject } from "fly-core";
import { forceUpdate } from "fly-dom";

export function useRouter(){
    return useInject('router')
}

export class Router{
    query = {};
    params = {};    

    mode = '';      //hash, 
    currentRoute = null;

    beforeEach(callback){

    }

    afterEach(callback){

    }

    constructor(options){


        //options = { mode, routes }
        //route = { path, component, fallback, beforeEnter, beforeLeave }
        this.options = options;

        this._setCurrentRoute();

        var me = this;
       
        window.addEventListener("popstate", function(){ //浏览器前进/后退时引发               
            me._setCurrentRoute();
        })

        window.addEventListener('hashchange', function() {  //hash改变时引发
            if(me.mode == 'hash') me._setCurrentRoute();
        })
    }

    _routeUpdateFns = [];
    beforeRouteUpdate(fn){       
        this._routeUpdateFns.push(fn);        
    }

    _triggerRouteUpdate(to, from){
        for(var fn of this._routeUpdateFns){
            fn(to, from);
        }
    }

    _setCurrentRoute(){
        var from = this.currentRoute;
        this.currentRoute = this.getRoute(this._getPath()) || this.getRoute('*');
        // debugger
        // if(!this.currentRoute.component.render){//
        //     // debugger
        //     this._loadComponent(this.currentRoute, from);
        // }else{
            this._triggerRouteUpdate(this.currentRoute, from);
        // }        
    }

    // async _loadComponent(route, from){
    //     var module = await route.component();
    //     debugger
    //     route.component = module.default;
    //     this._triggerRouteUpdate(route, from);
    // }

    _getPath(){
        var path = window.location.pathname;
        if(this.mode == 'hash'){
            path = window.location.hash.substr(1);                
        }
        return path;
    }

    getRoute(path){    
        var base = this.options.base;
        for(var route of this.options.routes){
            if(route.path == path){
                return route;
            }
        }
    }

    //push('/user')
    //puse({ path: '/user', query: {a: 1}})     '/user?a=1'
    push(path){
        var oldPath = this._getPath();
        if(path == oldPath) return;
        window.history.pushState(null, null, path);        
        // setTimeout(()=>{
            // debugger
            // alert(this._getPath())
            this._setCurrentRoute();
        // }, 10)        
    }

    replace(path){
        window.history.replaceState(null, null, path);
        this._setCurrentRoute();
    }

    go(num){
        window.history.go(num);
    }

    back(){
        window.history.back();
    }

    forward(){
        window.history.forward();
    }

}

export function Link(){
    var router = useRouter();

    router.beforeRouteUpdate((to, from)=>{
        forceUpdate(this)
     });
    
    var onClick=(e)=>{        
        var { to } = this.props;
        e.preventDefault();
        router.push(to)
    }

    return {
        router, onClick
    }
}

Link.render = function(props){
    var { to, children } = props;
    var { router } = this;

    var route = router.currentRoute;
    var style;
    if(route.path == to){
        style = {color:'blue'}
    }

    return (
        <a href={to} style={style} onClick={this.onClick}>
            {children}
        </a>
    )
}

export function RouterView(){    
    var router = useRouter();    

    router.beforeRouteUpdate((to, from)=>{
       forceUpdate(this)
    });

    return { router }
}

RouterView.render = function(props){        
    var { router } = this;
    var route = router.currentRoute;
    var Component = route.component ? route.component : null;
    if(!Component) Component = route.fallback;
    return (
        <Component />
    )
}