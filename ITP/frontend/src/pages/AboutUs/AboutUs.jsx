import React from "react";
import "./AboutUs.css";
import { assets } from '../../assets/assets.js'

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Jayanga Pabasara",
      image: assets.jayanga,
      email: "it22273680@my.sliit.lk",
      phone: "072-6370884",
    },
    {
      name: "Irushi Umesha",
      image: assets.irushi,
      email: "it22268426@my.sliit.lk",
      phone: "076-6321560",
    },
    {
      name: "Sashini Diwyangi",
      image: assets.sashi,
      email: "it22559968@my.sliit.lk ",
      phone: "076-4483796",
    },
    {
      name: "Hashan Budhika",
      image: assets.hashan,
      email: "it22270788@my.sliit.lk",
      phone: "071-0867234",
    },
    {
      name: "Vimukthi Kolitha",
      image: assets.vimukthi,
      email: "it22291714@my.sliit.lk",
      phone: "077-4283236",
    },
    {
      name: "Gihara Nishadi",
      image: assets.gihara,
      email: "it22116710 @my.sliit.lk",
      phone: "070-2622185",
    },
    {
      name: "Sithija Laknidu",
      image: assets.sithija,
      email: "it22273208@my.sliit.lk",
      phone: "076-9156692",
    },
  ];

  return (
    <div className="about-us-container">
      <h1 className="about-us-heading">Meet Our Team</h1>
      <div className="cards-container">
        {teamMembers.map((member, index) => (
          <div className="card" key={index}>
            <img src={member.image} alt={member.name} className="profile-image" style={{ width: '150px', height: '150px', borderRadius: '50%'}}/>
            <h3 className="member-name">{member.name}</h3>
            <p className="contact-info">📞 {member.phone}</p>
            <p className="contact-info">📧 {member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
