export default function AgenciesErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 text-center text-red-600">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}
