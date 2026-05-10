export default function KeywordSection({
  title,
  keywords,
  color
}) {

  return (

    <div className="
      bg-white
      rounded-3xl
      p-6
      shadow-sm
      border
    ">

      <h3 className="
        text-xl
        font-bold
        text-black
        mb-4
      ">
        {title}
      </h3>

      <div className="
        flex
        flex-wrap
        gap-3
      ">

        {keywords.map((keyword, index) => (

          <span
            key={index}
            className={`
              px-4
              py-2
              rounded-full
              text-black
              ${color}
            `}
          >
            {keyword}
          </span>

        ))}

      </div>

    </div>
  );
}