import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import './css/Contact.css';
import './css/Cart.css';
import {Button, Form}  from "react-bootstrap";
import { auth, db, logout } from "./firebase";
import * as firestore from 'firebase/firestore';
import { query, collection, getDocs, where, setDoc, getDoc, doc } from "firebase/firestore";
import { async } from "@firebase/util";
  function Dashboard() {
     const [user, loading, error] = useAuthState(auth);
     const [name, setName] = useState("");
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
      if (loading) return;
      if (!user) return navigate("/");
      fetchUserName();
    }, [user, loading]);


    return (
    <div className="dashboard">
        <div className="products">
        <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="name" placeholder="Your Name" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicIssue">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={8}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
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
export default Dashboard;
