import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import './css/Dashboard.css';
import { auth, db, logout } from "./firebase";
import * as firestore from 'firebase/firestore';
import { query, collection, getDocs, where } from "firebase/firestore";
import { async } from "@firebase/util";
  function Cart() {
     const [user, loading, error] = useAuthState(auth);
     const [name, setName] = useState("");
     const [ar, setAr] = useState([]);
     const [arra, setArra] = useState([]);
     const navigate = useNavigate();
     const fetchUserName = async () => {
       try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
      } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
      }
    };
    
    useEffect(() => {
      if (loading) return ;
      if (!user) return navigate("/");
      fetchUserName();
      carts();
    }, [user, loading]);
    
    const carts = async () => {
        try{
            firestore.getDocs(firestore.collection(db, "users/" + user?.uid + "/cart")).then((snapshot) => {
                snapshot.forEach(function(doc){
                    const q = query(collection(db, "users"), where("pid", "==", "2"));
                    const doc2 = getDocs(q);
                    console.log(doc.id);
                    //console.log(doc2.docs[0].data());
                    //const data = doc2.docs[0].data();
                    //console.log(data);
                })
            })
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };


    return (
      <div className="dashboard">
        <div className="products">
        {ar.map(v => {
            let x = 0;
            return (
              <div key={v.id + (x++)} className='prod'>
              <p>{v.id}</p>
                <img src={v.img} alt="Logo" width='250vh'/>
                <div>{v.descr}</div>
                <p>
                  Price: {v.price}
                </p>
                <p>
                  Quantity: {v.quantity}
                </p>
              </div>
            );
          })}

       </div>
       <div className="dashboard__container">
         
         <div>Hi! {name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Cart;
