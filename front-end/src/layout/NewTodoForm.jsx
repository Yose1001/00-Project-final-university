import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import table from "../media/table-crowd.jpg";

import "../css/home.css";
import "../css/about.css";
import "../css/menu.css";
import "../css/booking.css";
import "../css/contact.css";
import "../css/Todo.css";

export default function NewTodoForm() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "medium",
  });

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!input.title.trim()) {
        return alert("Please enter a title");
      }
      const output = { ...input, dueDate: new Date(input.dueDate) };
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8889/Reservation", output, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Create new OK");
      navigate("/userhome");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <img src={table} alt="err" width={"100%"} height={"100%"} />
      <div className="flex Bontent1">
        <div className="Bcontact">
          <div className="flex Bontent2">
            <div>
              <Fade triggerOnce>
                {" "}
                <div className="flex">
                  <p className="Adash">___________</p>
                  <p className="Adash mx-2">Food land</p>
                  <p className="Adash">___________</p>
                </div>
              </Fade>
            </div>
          </div>

          <Fade triggerOnce>
            {" "}
            <p className="book-head">MAKE YOUR RESERVATION</p>
          </Fade>
          <Fade triggerOnce delay={200}>
            {" "}
            <div className="Bmt">
              <div className="flex">
                <form className="Tform-container" onSubmit={hdlSubmit}>
                  <div className="form-control w-full max-w-[220px]">
                    <div className="label">
                      <span className="label-text text-white">Title</span>
                    </div>
                    <input
                      className="Tp"
                      type="text"
                      name="title"
                      placeholder="What to reserve / do"
                      value={input.title}
                      onChange={hdlChange}
                    />
                  </div>
                  <div className="form-control w-full max-w-[220px]">
                    <div className="label">
                      <span className="label-text text-white">Due Date</span>
                    </div>
                    <input
                      className="Tp"
                      type="date"
                      name="dueDate"
                      value={input.dueDate}
                      onChange={hdlChange}
                    />
                  </div>
                  <div className="form-control w-full max-w-[220px]">
                    <div className="label">
                      <span className="label-text text-white">Status</span>
                    </div>
                    <select
                      className="Tp"
                      name="status"
                      value={input.status}
                      onChange={hdlChange}
                    >
                      <option value="medium">medium</option>
                      <option value="vip">vip</option>
                    </select>
                  </div>
                  <div className="flex Bontent1 Bmt1 Bmt2">
                    <button className="Bbook-btn">BOOK A TABLE</button>
                  </div>
                </form>
              </div>
              <br />
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}
