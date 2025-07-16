class OptionModel {
    id: string;
    text: string;
    votes: number;

    constructor(id: string, text: string, votes?: number) {
        this.id = id;
        this.text = text;
        this.votes = votes || 0;
    }
}

class PollModel {
    id?: string;
    question: string;
    options: OptionModel[];
    createdAt: Date;
    updatedAt: Date;

    constructor(question: string, rawOptions: OptionModel[], id?: string) {
        if (id) {
            this.id = id;
        }
        this.question = question;
        this.options = rawOptions.map(opt => new OptionModel(opt.id, opt.text, opt.votes));
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export default PollModel;