import './../assets/css/about-page.css';

export default function AboutPage() {
    return (
        <div
            className="page-container about-page"
            role="img"
            aria-label="mysterious person in white clothes standing on rocks by the sea at dusk, looking into the distance"
        >
            <div className="content-box">
                <h1 className="heading-primary">About Axiomata</h1>
                <p className="text-body">
                    Axiomata was created to help writers, world builders, and game masters tame the chaos of their projects.
                    If you’ve ever felt overwhelmed by scattered notes, half-finished ideas, or sprawling worlds,
                    Axiomata gives you a place to bring it all together.
                </p>
                <p className="text-body">
                    Delve into millions of procedurally generated worlds, or create your own from scratch. Track your
                    stories, and watch your worlds grow all in one unified place.
                </p>
                <p className="text-body">
                    We’re just getting started. Soon, you’ll be able to map your worlds, build histories, and create
                    dynamic timelines that give your universes depth and life.
                </p>
                <p className="text-body">
                    Ready to get organized and bring your worlds to life? <strong>Sign up today</strong> and start exploring with Axiomata.
                </p>

                {/* Artist credit */}
                <p className="text-body" style={{ fontSize: '0.8rem', marginTop: '2rem', color: '#555' }}>
                    Background art courtesy of Liuzishan
                </p>
            </div>
        </div>
    );
}