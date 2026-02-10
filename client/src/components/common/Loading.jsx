function Loading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="relative h-16 w-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-primary-200"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-white shadow-soft"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

export default Loading;
