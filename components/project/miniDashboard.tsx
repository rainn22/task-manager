type Props = {
  Name: string;
  Total: number;
};

export default function MiniDashboard({ Name, Total }: Props) {
  return (
    <div className="p-4 border rounded-md hover:bg-gray-50">
      <p className="text-sm text-gray-500">{Name}</p>
      <h2 className="text-2xl font-semibold">{Total}</h2>
    </div>
  );
}
