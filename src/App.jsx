import "./index.css";
import ratImage from "./assets/rat.png";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [screen, setScreen] = useState("invitation");
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null);

  const [guests, setGuests] = useState([]);

  async function getGuests() {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading RSVPs:", error);
      return;
    }

    setGuests(data);
  }

  useEffect(() => {
    getGuests();
  }, []);

  async function handleSubmit() {
    if (!name.trim() || attending === null) {
      return;
    }

    const newGuest = {
      name: name.trim().toUpperCase(),
      attending: attending,
    };

    const { data, error } = await supabase
      .from("rsvps")
      .insert(newGuest)
      .select()
      .single();

    if (error) {
      console.error("Error submitting RSVP:", error);
      return;
    }

    setGuests((currentGuests) => [...currentGuests, data]);

    setScreen("confirmation");
  }

  // TODO Food: cornbread muffin with mashed potato icing, and popcorn chicken on top.

  return (
    <main className="screen">
      <div className="scanlines" />

      <div className="terminal">
        {screen === "invitation" && (
          <>
            <h1>
              The RAT LORD cordially invites you to the SEWER for a TASTEFUL
              MOVIE AND DINING EXPERIENCE.
            </h1>
            <div className="rat-container">
              <img
                src={ratImage}
                alt="A suspicious rat holding a movie ticket"
                className="rat-image"
              />
            </div>

            <section className="invitation">
              <p className="status">
                Sunday, October 25th, 6:00PM
                <br />
                Location dependent on headcount.
              </p>
              <h2>How do you ACCEPT this invitation?</h2>

              <div className="options">
                <button onClick={() => setScreen("rsvp")}>
                  <span>&gt;</span>
                  With GRATITUDE
                </button>

                <button onClick={() => setScreen("rsvp")}>
                  <span>&gt;</span>
                  With ENTHUSIASM
                </button>
              </div>
            </section>

            <p className="status">AWAITING RESPONSE...</p>
          </>
        )}
        {screen === "rsvp" && (
          <div className="rsvp-screen">
            <p className="terminal-message">RESPONSE ACCEPTED.</p>

            <div className="rsvp-section">
              <label htmlFor="name" className="terminal-question">
                IDENTIFY YOURSELF:
              </label>

              <div className="terminal-input-wrapper">
                <span>&gt;</span>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="ENTER NAME"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="rsvp-section">
              <p className="terminal-question">WILL YOU BE ATTENDING?</p>

              <div className="options">
                <button
                  className={attending === true ? "selected" : ""}
                  onClick={() => setAttending(true)}
                >
                  <span>&gt;</span>
                  YES
                </button>

                <button
                  className={attending === false ? "selected" : ""}
                  onClick={() => setAttending(false)}
                >
                  <span>&gt;</span>
                  NO
                </button>
              </div>
            </div>

            <button
              className="submit-button"
              disabled={!name.trim() || attending === null}
              onClick={handleSubmit}
            >
              SUBMIT RESPONSE
            </button>

            <p className="status">AWAITING IDENTIFICATION...</p>

            <div className="guest-list">
              <p className="guest-count">
                {guests.filter((guest) => guest.attending).length} CONFIRMED
                ATTENDEES
              </p>

              <div className="guest-names">
                {guests
                  .filter((guest) => guest.attending)
                  .map((guest) => (
                    <p key={guest.id}>&gt; {guest.name}</p>
                  ))}
              </div>
            </div>
          </div>
        )}
        {screen === "confirmation" && (
          <div className="confirmation-screen">
            {attending ? (
              <>
                <p className="status">
                  YOUR ATTENDANCE HAS BEEN DOCUMENTED.
                  <br />
                  THE RATS REJOICE!
                </p>
                <h1>WELCOME TO THE OTHER WORLD, {name.toUpperCase()}.</h1>

                <div className="bobinski-container">
                  <iframe
                    src="https://giphy.com/embed/hBSkbjMsxzW0ebZrGH"
                    className="bobinsky-gif"
                    frameBorder="0"
                    allowFullScreen
                    title="Mr Bobinsky"
                  />
                </div>

                {/* <p className="status">Sunday, October 25th, 6:00PM</p>
                <p className="status">Location dependent on headcount.</p> */}

                <p className="giphy-credit">
                  <a
                    href="https://giphy.com/gifs/LAIKAstudios-stopmotion-laika-laikastudio-hBSkbjMsxzW0ebZrGH"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                </p>
              </>
            ) : (
              <>
                <h1>
                  YOUR COWARDICE HAS BEEN DOCUMENTED, {name.toUpperCase()}.
                </h1>

                <p className="status">I DIDN'T WANT YOU THERE ANYWAY.</p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
