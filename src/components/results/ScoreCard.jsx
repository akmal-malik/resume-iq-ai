export default function ScoreCard({ score }) {

  let status = "Needs Improvement";

  if (score >= 90) {
    status = "Excellent";
  } else if (score >= 70) {
    status = "Good";
  }

  return (

    <div className="
      bg-white
      rounded-3xl
      p-8
      shadow-sm
      border
    ">

      <h2 className="
        text-2xl
        font-bold
        text-black
        mb-6
      ">
        ATS Score
      </h2>

      <div className="
        flex
        items-center
        gap-6
      ">

        <div className="
          w-32
          h-32
          rounded-full
          border-8
          border-black
          flex
          items-center
          justify-center
        ">

          <span className="
            text-4xl
            font-bold
            text-black
          ">
            {score}
          </span>

        </div>

        <div>

          <p className="
            text-2xl
            font-semibold
            text-black
          ">
            {status}
          </p>

          <p className="
            text-gray-600
            mt-2
          ">
            Resume ATS Performance
          </p>

        </div>

      </div>

    </div>
  );
}