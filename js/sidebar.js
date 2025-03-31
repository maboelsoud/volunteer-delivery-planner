
function useVolunteerConfig(initialVolunteerCount = 3) {
    const [volunteerCount, setVolunteerCount] = React.useState(initialVolunteerCount);
    const [volunteerBags, setVolunteerBags] = React.useState([]);

    React.useEffect(() => {
        const newBags = Array.from({ length: volunteerCount }, (_, i) =>
            volunteerBags[i] || 1
        );
        setVolunteerBags(newBags);
    }, [volunteerCount]);

    return {
        volunteerCount,
        setVolunteerCount,
        volunteerBags,
        setVolunteerBags,
    };
}

function VolunteerBagInputs({ volunteerBags, setVolunteerBags }) {
    const handleBagChange = (index, value) => {
        const copy = [...volunteerBags];
        copy[index] = parseInt(value) || 1;
        setVolunteerBags(copy);
    };

    return (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {volunteerBags.map((bags, i) => (
                <div key={i}>
                    <label>Volunteer {i + 1}:</label>
                    <input
                        type="number"
                        value={bags}
                        min="1"
                        max="10"
                        onChange={e => handleBagChange(i, e.target.value)}
                        style={{ width: "60px", marginBottom: "5px" }}
                    />
                </div>
            ))}
        </div>
    );
}

function Sidebar({ routes, onGenerateRoutes }) {

    const [addressInput, setAddressInput] = React.useState('');
    const { volunteerCount, setVolunteerCount, volunteerBags, setVolunteerBags } = useVolunteerConfig();

    const handleGenerateClick = () => {
        // Pass the current state to the handler function provided by the parent
        onGenerateRoutes(addressInput, volunteerBags);
    };
    return (
        <div style={{ width: "400px", overflowY: "auto", padding: "10px", background: "#fff" }}>
            <h2>Ramadan Giving</h2>

            <label>Addresses:</label>
            <textarea
                value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                placeholder="Paste addresses here..."
                style={{ width: "100%", height: "100px" }}
            />

            <label>Number of Volunteers:</label>
            <input
                type="number"
                value={volunteerCount}
                onChange={e => setVolunteerCount(parseInt(e.target.value) || 0)}
                style={{ width: "100%" }}
            />

            <label>Bag capacity for each volunteer:</label>
            <VolunteerBagInputs volunteerBags={volunteerBags} setVolunteerBags={setVolunteerBags} />

            <button onClick={handleGenerateClick}>Generate Routes</button>

            <hr />

            <RoutesPanel routes={routes} />
        </div>
    );
}
