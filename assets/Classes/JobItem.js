class JobItem {
    constructor(name_fr, name_en, rarity, color, level, description_fr, description_en, image) {
        this.name_fr = name_fr;
        this.name_en = name_en;
        this.rarity = rarity;
        this.color = color;
        this.level = level;
        this.description_fr = description_fr;
        this.description_en = description_en;
        this.image = image;
    }
}

module.exports = {JobItem: JobItem};
