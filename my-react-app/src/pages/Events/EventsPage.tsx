export default function EventsPage() {
    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>Event Details</h1>
                </div>
            </section>

            <section className="overview">
                <div>
                    <h2>Overview</h2>
                    <p>Description goes here.</p>
                    <button>Register</button>
                    <img className="event-img" src="/src/assets/defaulticon.jpg" alt="event" />
                    <div className="location">Rotterdam • Venue name</div>
                </div>

                <div className="info">
                    <div>Date: 20–22 Jun 2025</div>
                    <div>Status: Upcoming</div>
                </div>
            </section>
        </>
    );
}
