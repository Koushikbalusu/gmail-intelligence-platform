export default function ThreadPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Thread {params.id}</h1>
      <p className="text-gray-600">Thread page coming soon...</p>
    </div>
  );
}
