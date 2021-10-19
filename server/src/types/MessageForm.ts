export interface MessageForm{
    sender: string;
    receiver: string;
    message: string;
    type: string;
    duration?: number;
}