// src/featured/teams/components/Highlight.tsx

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type Props = {
  text: string;
  keyword: string;
};

export default function Highlight({ text, keyword }: Props) {
  const kataKunci = keyword.trim();
  if (kataKunci === '') return <>{text}</>;

  const bagian = text.split(new RegExp(`(${escapeRegex(kataKunci)})`, 'gi'));

  return (
    <>
      {bagian.map((potongan, i) =>
        potongan.toLowerCase() === kataKunci.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm bg-[#FFD24A] px-0.5 font-semibold text-[#4A3320]"
          >
            {potongan}
          </mark>
        ) : (
          potongan
        ),
      )}
    </>
  );
}
