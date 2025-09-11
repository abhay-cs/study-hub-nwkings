export default function Resources() {
  return (
    <aside className="hidden lg:flex w-[320px] flex-col p-6 border-l border-gray-200">
      <div>
        <h2 className="text-lg font-semibold mb-4">Week Resources</h2>
        <div className="space-y-3">
          <div className="p-3 border rounded-lg bg-white">📘 Semantic HTML Guide</div>
          <div className="p-3 border rounded-lg bg-white">✅ Exercise 1.2</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded-lg">Explain article vs section</button>
          <button className="px-3 py-1 bg-gray-200 rounded-lg">What is ARIA?</button>
        </div>
      </div>
    </aside>
  )
}