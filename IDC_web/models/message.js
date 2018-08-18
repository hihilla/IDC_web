
function Message(id, message, from, to, sendTime){
    this.id = id;
    this.message = message;
    this.from = from;
    this.to = to;
    this.sendTime = sendTime;
}

module.exports = Message;