export default function EntityCard() {
    return (
        <div>
            <h3>{Entity?.name || "Entity name"}</h3>
            <p>Type: {entity?.type || "Entity type"}</p>
        </div>
    );
}