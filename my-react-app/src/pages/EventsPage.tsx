
// src/pages/EventsPage.tsx
import React from "react";
import "../styles/base.css";
import "../styles/darkmode.css";
import "../styles/events.css";
import "../styles/topbar.css";

const EventsPage: React.FC = () => {
    const toggleDarkMode = () => {
        document.body.classList.toggle("dark-mode");
    };

    const handleRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        alert("Sorry, Registration is Closed");
    };

    return (
        <>
            <button id="darkModeBtn" onClick={toggleDarkMode}>
                🌙 Dark Mode
            </button>

            <div id="topbar">{/* Replace with React Topbar later */}</div>


            <section className="hero">
                <div className="hero-content">
                    <h1>Events</h1>
                </div>
            </section>

            <section className="info">
                <div>
                    <strong>Date:</strong> Tomorrow <br />
                    <strong>Time:</strong> 6:30 PM – 9:30 PM
                </div>
            </section>


            <section className="overview">
                <div>
                    <img
                        src="/Pictures/defaulticon.jpg"
                        alt="Event Image"
                        className="event-img"
                    />
                    <h2>Event Details</h2>
                    <p>
                        ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                        fugiat similique itaque? Aut dolore nulla fugiat est veritatis,
                        assumenda commodi error atque vitae aliquid aspernatur quia, neque
                        laboriosam deleniti tempora!
                    </p>
                    <iframe
                        width="700"
                        height="400"
                        src="https://www.youtube.com/embed/sDqiFFZ0MWw"
                        title="Event Video"
                    ></iframe>
                </div>

                <div>
                    <img src="/Pictures/defaulticon.jpg" alt="Event Logo" />
                    <div className="location">
                        <strong>Location: </strong> Rotterdam, Netherlands
                    </div>
                    <div>
                        <strong>Venue: </strong> AHOY Rotterdam
                    </div>
                    <div>
                        <button onClick={handleRegister}>Register</button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventsPage;
