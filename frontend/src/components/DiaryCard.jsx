export default function DiaryCard({ image, place, author, description }) {
  return (
    <article className="rounded-xl overflow-hidden shadow bg-white">
      <img src={image} alt={place} className="h-40 w-full object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{place}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500">By {author}</p>
      </div>
    </article>
  )
}
