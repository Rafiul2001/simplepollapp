import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CiLogin } from "react-icons/ci";

type OptionModel = {
  id: string
  text: string
  votes: number
}

type Poll = {
  id: string
  question: string
  options: OptionModel[]
  createdAt: Date
  updatedAt: Date
}

const App = () => {

  const [pollQuestions, setPollQuestions] = useState<Poll[]>([])
  const [pollIdsAndOptions, setPollIdsAndOptions] = useState<{ pollId: string, optionId: string }[]>([])
  const [message, setMessage] = useState<string>("")
  const popupRef = useRef<HTMLDivElement | null>(null)

  const getAllPolls = async (): Promise<void> => {
    const response = await axios.get('http://localhost:3000/api/poll/get_all_polls')
    console.log(response.data)
    setPollQuestions(response.data)
  }

  const isChecked = (pollId: string, optionId: string) => {
    const entry = pollIdsAndOptions.find((item) => item.pollId === pollId);
    return entry?.optionId === optionId;
  };

  useEffect(() => {
    getAllPolls()
  }, [])

  const handleUpdate = (pollId: string, optionId: string) => {
    setPollIdsAndOptions((prev) => {
      const exists = prev.find((entry) => entry.pollId === pollId);
      if (exists) {
        return prev.map((entry) =>
          entry.pollId === pollId ? { pollId, optionId } : entry
        );
      } else {
        return [...prev, { pollId, optionId }];
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/poll/vote", pollIdsAndOptions);
      setMessage("Votes submitted!")
      getAllPolls(); // Refresh after voting
      setPollIdsAndOptions([]); // Clear selected options
    } catch (error) {
      // console.error("Error submitting votes", error);
      setMessage("There was an error submitting your votes.\nError: " + error)
    }
  };

  const getColor = (index: number) => {
    const colors = ['#FF6F6F', '#FFB26F', '#6F9DFF', '#8C6FFF', '#00DDB9', '#ECCD1E'];
    return colors[index % colors.length];
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setMessage(""); // close if clicked outside
      }
    }

    if (message) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [message, setMessage]);


  return (
    <div className="relative min-h-screen flex flex-col">
      {/* popup message */}
      {
        message ? <div ref={popupRef} className="absolute transition-all z-2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-100 py-7 px-4 rounded shadow-lg shadow-gray-400">
          <p className="text-2xl">Poll App says,</p>
          <p className="text-xl my-7">{message}</p>
          <button onClick={() => setMessage("")} className="text-xl font-semibold bg-teal-500 text-white px-7 py-2 rounded cursor-pointer">Okay</button>
        </div> : <></>
      }
      {/* popup message */}

      <div className="py-4 bg-linear-to-b from-gray-200 to-gray-100">
        <div className="container mx-auto flex items-center justify-between">
          <h2 className="text-4xl">Poll App</h2>
          <div>
            <CiLogin size={24} />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="container px-2 mx-auto flex-1 flex flex-col gap-5 my-4">
        {
          pollQuestions.map((poll: Poll, index: number) => {
            // Build the gradient string from poll options
            let totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

            return (
              <div key={index}>
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex-1">
                    <div className="flex flex-row justify-between text-[16px] md:text-xl lg:text-2xl font-semibold">
                      <h2>{poll.question}</h2>
                      <p>Total Votes: {totalVotes}</p>
                    </div>
                    {
                      poll.options.map((option: OptionModel, index2: number) => {
                        return (
                          <div key={index2} className="flex items-center gap-2">
                            <label style={
                              isChecked(poll.id, option.id)
                                ? { background: "black" }
                                : {
                                  background: `linear-gradient(to right, ${getColor(index2)} ${totalVotes ? (option.votes * 100 / totalVotes).toFixed(2) : 0}%, #6c727c ${totalVotes ? (option.votes * 100 / totalVotes).toFixed(2) : 0}%)`
                                }
                            }
                              className={`flex-1 block font-semibold text-[16px] md:text-xl lg:text-2xl py-2 px-4 my-2 rounded w-full text-white cursor-pointer`}>
                              <input required
                                className="sr-only"
                                name={`poll-${poll.id}`}
                                type="radio"
                                value={option.id}
                                checked={isChecked(poll.id, option.id)}
                                onChange={() => handleUpdate(poll.id, option.id)}
                              />
                              <span>{option.text}</span>
                            </label>
                            <p className="flex-1 max-w-16 text-[16px] md:text-xl lg:text-2xl font-semibold">{totalVotes ? (option.votes * 100 / totalVotes).toFixed(2) : 0}%</p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
        <button type="submit" className="text-xl font-semibold text-white cursor-pointer bg-teal-500 px-8 py-1 w-fit self-center rounded">Submit</button>
      </form>

      <footer className="py-4 bg-linear-to-t from-gray-200 to-gray-100">
        <p className="text-center">&copy; 2025 | Poll App</p>
      </footer>
    </div>
  );
};
export default App;
