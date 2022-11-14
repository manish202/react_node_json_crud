import {useContext} from "react";
import {MyContext} from "./App";
import {customeMessage} from "./App";
import formValidation,{isValidEmail} from "./formValidation";
const MyForm = () => {
    console.log("I Am MyForm Compo");
    let {reloadUsers,isChecked,checkme} = useContext(MyContext);
    const handelSubmit = (e) => {
    e.preventDefault();
    let {fname,lname,email,phone,password,gender} = e.target;
    fname = fname.value.trim();
    lname = lname.value.trim();
    phone = phone.value.trim();
    password = password.value.trim();
    gender = gender.value.trim();
    email = email.value.trim();
    if(!isValidEmail(email)){
      customeMessage("email is invalid");
    }else if(!isChecked){
      customeMessage("Please Accept T & C");
    }else{
      if(formValidation({fname,lname,phone,password,gender})){
        // 3 STEP AJAX Request When All Data Is Valid
        console.log("Request Gone For set users");
        fetch("/user/set",{
          method:"POST",
          body:JSON.stringify({fname,lname,email,phone,password,gender}),
          headers:{
            "Content-Type":"application/json"
          }
        }).then(res => res.json())
        .then((data) => {
          if(data.status){
            e.target.reset();
            customeMessage(data.message,"success");
              // reloadUsers is used For Reload Users Component
              reloadUsers();
          }else{
            customeMessage(data.message);
          }
        }).catch(err => console.log(`Custome Error Is ${err}`));
      }
    }
  }
  // 1 STEP Create Form
  return(
    <form onSubmit={handelSubmit} autoComplete="off">
      <div className="form-control">
        <label>first name</label>
        <input className="inp" type="text" name="fname" />
      </div>
      <div className="form-control">
        <label>last name</label>
        <input className="inp" type="text" name="lname" />
      </div>
      <div className="form-control">
        <label>email</label>
        <input className="inp" type="text" name="email" />
      </div>
      <div className="form-control">
        <label>phone</label>
        <input className="inp" type="number" name="phone" />
      </div>
      <div className="form-control">
        <label>password</label>
        <input className="inp" type="text" name="password" />
      </div>
      <div className="form-control d-ib">
        <input type="radio" name="gender" value="male" />
        <label>male</label>
        <input type="radio" name="gender" value="female" />
        <label>female</label>
      </div>
      <div className="form-control d-ib">
        <input onClick={checkme} type="checkbox" />
        <label>Accept T & C</label>
      </div>
      <div className="form-control">
        <input type="submit" value="add" />
      </div>
    </form>
  )
}
export default MyForm;