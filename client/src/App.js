import MyForm from "./form";
import Users from "./users";
import EditForm from "./EditForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useReducer,createContext} from "react";
export let MyContext = createContext();
export const customeMessage = (msg,alert_color="warn") => {
  toast[alert_color](msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
}
const reducer = (state,action) => {
  console.log("i am reducer");
  switch(action.type){
    case "CHECKBOX":
      return {...state,isChecked: !state.isChecked}
    case "FORMSTATE":
      return {...state,formState: !state.formState,isChecked:false}
    case "UPDATEUSER":
      return {...state,user:action.user}
    case "TOGGLE_FORM":
      return {...state,which_form: action.which}
    case "USER_STATE_EDIT":
      return {...state,user_update_obj:action.user_update_obj}
    default:
      return state;
  }
}
function App(){
  console.log("I Am App Compo");
  let [state,dispatch] = useReducer(reducer,{which_form:true,formState:false,isChecked:false,user:[],user_update_obj:{}});
  const checkme = () => dispatch({type:"CHECKBOX"});
  const reloadUsers = () => dispatch({type:"FORMSTATE"});
  const updateUser = (data) => dispatch({type:"UPDATEUSER",user:data});
  const toggleForm = (which) => dispatch({type:"TOGGLE_FORM",which});
  const userStateEdit = (obj) => dispatch({type:"USER_STATE_EDIT",user_update_obj:obj});
  return(
    <MyContext.Provider value={{...state,checkme,reloadUsers,updateUser,toggleForm,userStateEdit}}>
      <div className="container">
        {state.which_form ? <MyForm /> : <EditForm />}
        <Users />
        <ToastContainer />
      </div>
    </MyContext.Provider>
  )
}

export default App;