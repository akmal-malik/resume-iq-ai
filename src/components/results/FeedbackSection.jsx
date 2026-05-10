export default function FeedbackSection({
  feedback
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
        AI Feedback
      </h3>

      <ul className="
        list-disc
        ml-5
        space-y-3
        text-black
      ">

        {feedback.map((item, index) => (

          <li key={index}>
            {item}
          </li>

        ))}

      </ul>

    </div>
  );
}