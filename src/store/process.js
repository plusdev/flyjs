export default {
    name: 'process',
    
    state: {        
        count: 200,
    },
        
    add: function(){        
        this.count += 1;
        this.store.user.setCount(this.count+100);

        // this.store.user.count++; //不能直接操作其他model的属性，必须用方法。
    }
}
