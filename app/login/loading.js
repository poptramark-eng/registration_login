export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#1F1F1F]">
      <div className="flex flex-col items-center gap-4 animate-fadeIn">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1F1F1F] rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm font-medium text-gray-700 animate-pulse">
          Loading login page...
        </p>
      </div>
    </div>
  );
}
