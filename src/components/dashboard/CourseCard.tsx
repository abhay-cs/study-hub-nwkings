import Link from "next/link"

export function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col group">
      <div className="p-6 flex-grow">
        <div className="flex items-center gap-4 mb-4">
          <div className="gradient-circle w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {course.name
              .split(" ")
              .map((w: string) => w[0])
              .join("")}
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{course.name}</h2>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {course.description || "Explore course materials with AI-powered assistance"}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <span>Enrolled: <span className="font-medium text-gray-700">{new Date(course.created_at).toLocaleDateString()}</span></span>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Link
          href={`/courses/${course.id}`}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 group-hover:bg-gray-100 text-gray-700 rounded-lg py-3 px-4 font-medium transition-colors duration-300"
        >
          Open Course →
        </Link>
      </div>
    </div>
  )
}