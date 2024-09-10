import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Check, Star } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface RatingFormProps {
  toggleModal: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({ toggleModal }) => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<{
    user: any;
    userId: string;
  } | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

  const getSession = async () => {
    const session = await fetch(`/api/auth`).then((res) => res.json());
    setUserInfo(session);

    if (session) {
      setIsSignedIn(true);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <div
      className="rounded-md bg-card px-4 py-8 font-geistsans"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const review = formData.get("review") as string;

          if (isSignedIn) {
            await fetch(`/api/reviews`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                review,
                rating,
                userId: userInfo?.userId,
              }),
            });
            toggleModal?.();
          } else {
            alert("sign in first");
          }
          router.refresh();
        }}
      >
        <h1 className="text-2xl font-bold leading-6">jje</h1>
        <p>Tell others what you think</p>
        <div className="my-2 flex justify-between">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={`cursor-pointer border-none bg-transparent`}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <Star
                  className={`size-7 ${
                    index <= (hover || rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  fill={
                    index <= (hover || rating) ? "currentColor" : "transparent"
                  }
                />
              </button>
            );
          })}
        </div>
        <Textarea name="review" placeholder="write a review..." />
        <Button
          className="mt-3 flex w-full items-center gap-1 text-center"
          type="submit"
        >
          Rate
          <Check className="border-2 border-white/0" />
        </Button>
      </form>
    </div>
  );
};