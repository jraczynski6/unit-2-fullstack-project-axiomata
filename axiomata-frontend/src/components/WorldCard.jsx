export default function WorldCard({ world, onClick }) {
    return (
        <div onClick={onClick}>
            <h3>{world?.name || "World Name"}</h3>
            <p>{world?.description || "World Description"}</p>
        </div>
    );
}