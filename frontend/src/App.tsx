import axios from "axios";
import { useEffect, useState } from "react";

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
      alert("Votes submitted!");
      getAllPolls(); // Refresh after voting
      setPollIdsAndOptions([]); // Clear selected options
    } catch (error) {
      console.error("Error submitting votes", error);
      alert("There was an error submitting your votes.");
    }
  };

  return (
    <div>
      <h1>Poll App</h1>
      <form onSubmit={handleSubmit}>
        {
          pollQuestions.map((poll: Poll, index: number) => {
            return (
              <div key={index}>
                <h2>{poll.question}</h2>
                {
                  poll.options.map((option: OptionModel, index: number) => {
                    return (
                      <div key={index}>
                        <label key={index}>
                          <input required name={`poll-${poll.id}`} type="radio" value={option.id} checked={isChecked(poll.id, option.id)} onChange={() => handleUpdate(poll.id, option.id)} />
                          <span>{option.text}</span>
                        </label>
                        <br />
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default App;
