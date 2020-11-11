import { Store } from 'fly-store';
import user from './user'
import process from './process'

var store = new Store([
    user,
    process
]);

export default store;
