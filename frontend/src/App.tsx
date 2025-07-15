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

  const getAllPolls = async (): Promise<void> => {
    const response = await axios.get('http://localhost:3000/api/poll/get_all_polls')
    console.log(response.data)
    setPollQuestions(response.data)
  }

  useEffect(() => {
    getAllPolls()
  }, [])

  return (
    <div>
      <h1>Poll App</h1>
      <form action="" method="post">
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
                          <input type="radio" name="option" value={option.id} />
                          <span>{option.text}</span>
                        </label>
                        <br />
                      </div>
                    )
                  })
                }
                <button type="submit">Submit</button>
              </div>
            )
          })
        }
      </form>
    </div>
  );
};
export default App;
