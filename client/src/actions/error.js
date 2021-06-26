import store from "../store/store";
export const setMessage = (err) => {
               setTimeout(function(){
                            store.dispatch(clearMessage());
               },3000)
return {
type:"SET_MESSAGE",
payload:err
}
}

export const clearMessage = () => {
return {
type:"CLEAR_MESSAGE"
}
}
