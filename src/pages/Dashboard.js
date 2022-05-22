import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {Toast} from "react-bootstrap";
import './css/Dashboard.css';
import './css/Cart.css';
import { auth, db, logout } from "./firebase";
import * as firestore from 'firebase/firestore';
import { query, collection, getDocs, where, setDoc, getDoc, doc } from "firebase/firestore";
import { async } from "@firebase/util";
  function Dashboard() {
     const [user, loading, error] = useAuthState(auth);
     const [name, setName] = useState("");
     const [arra, setArra] = useState([]);
     const navigate = useNavigate();
     const [show, setShow] = useState(false);
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
      if (loading) return;
      if (!user) return navigate("/");
      fetchUserName();
    }, [user, loading]);
    
    useEffect(() => { 
      firestore.getDocs(firestore.collection(db, "products")).then((snapshot) => {
        setArra(snapshot.docs.map(doc => ({id:doc.id,
           name:doc.data().name, 
           price:doc.data().price, 
           descr:doc.data().descr,
           img:doc.data().img,
           quantity:doc.data().quantity})))
      })
    }, []);

    const addToCart = async (val, quan) => {
      const snap = await getDoc(doc(db, "users", user?.uid, "cart", val));
      if(snap.exists()){
        if((quan - snap.data().quantity) > 0){
          await setDoc(doc(db, "users", user?.uid, "cart", val), {
            quantity: (snap.data().quantity + 1)
          });
        } else if((quan - snap.data().quantity) <= 0){
          await setDoc(doc(db, "users", user?.uid, "cart", val), {
            quantity: quan
          });
        }
      } else {
        await setDoc(doc(db, "users", user?.uid, "cart", val), {
          quantity: 1
        });
      }
      setShow(true);
    }

    return (
      <div className="dashboard">
        <div className="products">
        {arra.map(v => {
            return (
              <div key={v.id} className='prod'>
                <img src={v.img} alt="Logo" width='250vh'/>
                <div>{v.descr}</div>
                <p>
                  <span className="price">Price: {v.price}</span>
                  <span className="quantity">Quantity: {v.quantity}</span>
                </p>
                <button type="button" className="btn btn-outline-secondary" onClick={() => addToCart(v.id, v.quantity)}>Add To Cart</button>
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
       <Toast className="d-inline-block m-1" onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          Go To Cart!
        </Toast.Header>
        <Toast.Body>
          Product Added
        </Toast.Body>
      </Toast>
     </div>
  );
}
export default Dashboard;
