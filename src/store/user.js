export default {
    name: 'user',
    
    state: {
        user: null,	
        count: 100,
    },

	loadUser: async function(id){
		this.user = await api.getUser(id)
    },
    
    add: function(){
        this.count += 1;
    },

    setCount: function(value){
        this.count = value;
    }
}



