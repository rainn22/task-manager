type Props = {
  name: string;
  position: string;
};

export default function Member({ name, position }: Props) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-md">
      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
        {name.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{position}</p>
      </div>
    </div>
  );
}
