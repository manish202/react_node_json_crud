import {useContext} from "react";
import {MyContext} from "./App";
import {customeMessage} from "./App";
import formValidation from "./formValidation";
const EditForm = () => {
    console.log("I Am EditForm Compo");
    let {reloadUsers,toggleForm,user_update_obj,userStateEdit} = useContext(MyContext);
    let {fname,lname,phone,password,gender} = user_update_obj;
    const changeHandler = (e) => {
      let {name,value} = e.target;
      let updated_obj = {...user_update_obj,[name]:value};
      userStateEdit(updated_obj);
    }
    const handelSubmit = (e) => {
    e.preventDefault();
    if(formValidation(user_update_obj)){
        console.log("Request Gone For update users");
        fetch("/user/update",{
          method:"PATCH",
          body:JSON.stringify(user_update_obj),
          headers:{
            "Content-Type":"application/json"
          }
        }).then(res => res.json())
        .then((data) => {
          if(data.status){
            userStateEdit({});
            toggleForm(true);
            customeMessage(data.message,"success");
            // reloadUsers is used For Reload Users Component
            reloadUsers();
          }else{
            customeMessage(data.message);
          }
        }).catch(err => console.log(`Custome Error Is ${err}`));
      }
  }
  return(
    <form onSubmit={handelSubmit} autoComplete="off">
      <div className="form-control">
        <label>first name</label>
        <input onChange={changeHandler} value={fname} className="inp" type="text" name="fname" />
      </div>
      <div className="form-control">
        <label>last name</label>
        <input onChange={changeHandler} value={lname} className="inp" type="text" name="lname" />
      </div>
      <div className="form-control">
        <label>phone</label>
        <input onChange={changeHandler} value={phone} className="inp" type="text" name="phone" />
      </div>
      <div className="form-control">
        <label>password</label>
        <input onChange={changeHandler} value={password} className="inp" type="text" name="password" />
      </div>
      <div className="form-control d-ib">
        <input onChange={changeHandler} type="radio" name="gender" value="male" checked={gender === "male"} />
        <label>male</label>
        <input onChange={changeHandler} type="radio" name="gender" value="female" checked={gender === "female"} />
        <label>female</label>
      </div>
      <div className="form-control">
        <input type="submit" value="update" />
      </div>
    </form>
  )
}
export default EditForm;