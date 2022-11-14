import {useContext,useEffect} from "react";
import {MyContext} from "./App";
import {customeMessage} from "./App";
const getUsers = (updateUser) => {
    console.log("Request Gone For getUsers");
    fetch("/user/get").then(res => res.json())
        .then((data) => {
            console.log(data);
        if(data.message){
            customeMessage(data.message);
        }else{
            Array.isArray(data) && updateUser(data);
        }
        }).catch(err => console.log(`Custome Error Is ${err}`));
}
const Users = () => {
    console.log("I Am Users Compo");
    let {formState,reloadUsers,user,updateUser,toggleForm,userStateEdit} = useContext(MyContext);
    useEffect(() => {
        getUsers(updateUser);
    },[formState]);
    const popup = (obj) => {
        userStateEdit(obj);
        toggleForm(false);
    }
    const delProcess = (id) => {
        if(window.confirm("Are You Sure You Want To Delete This Recoard ?")){
            fetch("/user/delete",{
                method:"DELETE",
                body:JSON.stringify({id}),
                headers:{
                  "Content-Type":"application/json"
                }
              }).then(res => res.json())
              .then((data) => {
                if(data.status){
                  customeMessage(data.message,"success");
                    // reloadUsers is used For Reload Users Component
                    reloadUsers();
                }else{
                  customeMessage(data.message);
                }
              }).catch(err => console.log(`Custome Error Is ${err}`));
        }
    }
    return <table>
        <thead>
            <tr>
                <th>first name</th>
                <th>last name</th>
                <th>email</th>
                <th>phone</th>
                <th>password</th>
                <th>gender</th>
                <th>actions</th>
            </tr>
        </thead>
        <tbody>
            {(Array.isArray(user) && user.length > 0) ? user.map((val,ind) => {
                return <tr key={ind}>
                    <td>{val.fname}</td>
                    <td>{val.lname}</td>
                    <td>{val.email}</td>
                    <td>{val.phone}</td>
                    <td>{val.password}</td>
                    <td>{val.gender}</td>
                    <td><button onClick={() => popup(val)} className="edit" type="button">E</button><button onClick={() => delProcess(val.id)} className="delete" type="button">D</button></td>
                    </tr>
            }):<tr><td colSpan='7'>No Users Found</td></tr>}
        </tbody>
    </table>
}
export default Users;