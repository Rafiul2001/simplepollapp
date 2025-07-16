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

  const getColor = (index: number) => {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#a66cff', '#f97316'];
    return colors[index % colors.length];
  };

  return (
    <div>
      <h1>Poll App</h1>
      {
        pollQuestions.map((poll, index) => {
          // Build the gradient string from poll options
          let totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
          let currentPercent = 0;

          const gradientStops = poll.options.map((option, i) => {
            const percentage = totalVotes === 0 ? 100 / poll.options.length : (option.votes / totalVotes) * 100;
            const start = currentPercent;
            const end = currentPercent + percentage;
            currentPercent = end;
            const color = getColor(i); // pick color for this slice
            return `${color} ${start}% ${end}%`;
          }).join(',');

          return (
            <div key={index}>
              <div
                className="h-40 w-40 rounded-full"
                style={{ backgroundImage: `conic-gradient(${gradientStops})` }}
              ></div>
              <h2>{poll.question}</h2>
            </div>
          );
        })
      }

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
