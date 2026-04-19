function Spinner() {
  return (
    <div
      className="flex justify-center py-8"
      role="status"
      aria-label="Loading"
    >
      <div className="w-6 h-6 border-2 border-neutral-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
}

export default Spinner;
