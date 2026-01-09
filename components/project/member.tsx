type MemberProps = {
  name?: string;
  meta?: string;
  secondaryText?: string;
};

export default function Member({ name, meta, secondaryText }: MemberProps) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("")
    : "•";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
        {initials}
      </div>

      {name && (
        <div className="leading-snug">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{name}</p>

            {meta && (
              <span className="text-xs text-muted-foreground">{meta}</span>
            )}
          </div>

          {secondaryText && (
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {secondaryText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
