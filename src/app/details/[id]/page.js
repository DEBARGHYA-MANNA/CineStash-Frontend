export default function DetailsPage({ params }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Content Details</h1>
            <p className="text-gray-400">Coming in Phase 8 — ID: {params.id}</p>
        </div>
    );
}