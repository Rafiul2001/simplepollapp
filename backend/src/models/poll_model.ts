class OptionModel {
    id: string;
    text: string;
    votes: number;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
        this.votes = 0;
    }
}

class PollModel {
    id: string;
    question: string;
    options: OptionModel[];
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, question: string, options: OptionModel[]) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export default PollModel;