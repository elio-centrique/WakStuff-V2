class Option {
    constructor(label, value, description, emoji, disabled) {
        this.label = label;
        this.value = value;
        this.description = description;
        this.emoji = emoji;
        this.disabled = disabled;
    }
}

module.exports = {Option: Option};