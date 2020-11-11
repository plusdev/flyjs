import Fly from 'fly-core';
import { useStore } from 'fly-store'

export default function Home(){
    
    var { user } = useStore();
    return <div>
        Home
        <div>
            user.count: {user.count}    
            <button onClick={()=>user.add()}>addUse</button>
        </div>    
    </div>;
}
