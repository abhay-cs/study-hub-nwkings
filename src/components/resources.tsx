type ResourcesProps = {
  course: any;
};

export default function Resources({ course }: ResourcesProps) {
  return (
    <aside className="hidden lg:flex w-[320px] flex-col p-6 border-l border-gray-200 bg-white">
      {/* Resources */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Week Resources
        </h2>
        <div className="space-y-3">
          <div className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
            📘 Semantic HTML Guide
          </div>
          <div className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
            ✅ Exercise 1.2
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-200 transition">
            Explain article vs section
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-200 transition">
            What is ARIA?
          </button>
        </div>
      </div>
    </aside>
  );
}