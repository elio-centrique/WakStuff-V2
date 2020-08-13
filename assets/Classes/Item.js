class Item {
    constructor(name_fr, name_en, rarity, color, level, description_fr, description_en, stats_fr, stats_en, image) {
        this.name_fr = name_fr;
        this.name_en = name_en;
        this.rarity = rarity;
        this.color = color;
        this.level = level;
        this.description_fr = description_fr;
        this.description_en = description_en;
        this.stats_fr = stats_fr;
        this.stats_en = stats_en;
        this.image = image;
    }

    get_message_stats(language) {
        let message = "";
        if(language === "fr") {
            if(this.stats_fr != null) {
                this.stats_fr.forEach(stat => {
                    message += stat[4] + "\n";
                });
            }
        } else {
            if(this.stats_en != null) {
                this.stats_en.forEach(stat => {
                    message += stat[4] + "\n";
                });
            }
        }
        return message;
    }
}

module.exports = {Item: Item};