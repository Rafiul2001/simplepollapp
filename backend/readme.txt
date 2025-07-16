Adding a poll to a database using POST method in JSON format
In body:
{
  "question": "Give vote",
  "options": [
    {
      "id": "A",
      "text": "Mutton"
    },
    {
      "id": "B",
      "text": "Beef"
    },
    {
      "id": "C",
      "text": "Chicken"
    }
  ]
}

Updating a poll vote using put method in JSON format 
demo url string = "http://localhost:3000/api/poll/vote/687688182abe9e91097023b2"
In body:
{
    "optionId": "C"
}

Updating any poll vote using post method in JSON format
demo url string = 
In body:
[
    {
        "questionId": "68769d53dbdfb1d2e198cec3",
        "optionId": "A"
    },
    {
        "questionId": "68769d53dbdfb1d2e198cec3",
        "optionId": "B"
    }
]