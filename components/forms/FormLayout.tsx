interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  progressIndicator?: React.ReactNode;
}

export default function FormLayout({
  children,
  title,
  progressIndicator,
}: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        {progressIndicator && (
          <div className="mb-8">
            {progressIndicator}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {title}
          </h1>

          {/* Form Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
