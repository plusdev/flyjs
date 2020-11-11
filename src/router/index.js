import { Router } from 'fly-router';
import NotFound from './404';
import Bar from './Bar';
import Foo from './Foo';
import Home from './home';

// const Home = () => import('./pages/Home.js');

var router = new Router({
    // base: './pages/',
    routes: [
        { path: '/', component: Home },
        { path: '/foo', component: Foo },
        { path: '/bar', component: Bar },
        // { path: '/user/:id', component: Bar },
        { path: '*', component: NotFound }
    ]
})

export default router;

// router.beforeEach(function(to, from, next){
//     //如果未登陆，跳转到登陆页面
//     if(!store.user.isLogin){
//         router.push({path: '/login'});
//         return;
//     }
//     //如果已经登陆，并跳转到登陆页，则到主页面
//     if(to.name == 'login'){
//         router.push({path: '/'});
//         return;
//     }
//     //不是前面两种情况，则正常跳转
//     next();
// })


