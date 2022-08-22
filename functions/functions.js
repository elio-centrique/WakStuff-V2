const Item = require("./assets/Classes/Item");

async function get_language(message, collection, language = undefined) {
    if (language !== undefined) {
        i18next.changeLanguage(language);
        return language;
    } else {
        try {
            let lang = "";
            let result = await collection.findOne({id_server: {$eq: message.guild.id}})
            if (result && result.id_server === message.guild.id) {
                if (result.language) {
                    i18next.changeLanguage(result.language)
                    return result.language

                } else {
                    i18next.changeLanguage('en');
                    return "en"
                }
            } else {
                i18next.changeLanguage('en');
                return "en";
            }
        } catch (e) {
            console.log(i18next.t("failsetlanguage") + e);
        }
    }
}

async function set_language(message, collection, language) {
    try {
        let result = await collection.findOne({id_server: {$eq: message.guild.id}})
        if(result && result.id_server === message.guild.id) {
            await collection.updateOne({id_server: {$eq: message.guild.id}}, {$set: {language: language}})
            console.log(message.guild.name + i18next.t('guildupdated'))
            i18next.changeLanguage(language);
            message.editReply(i18next.t('updatedlanguageguild') + language)
        } else {
            await collection.insertOne({id_server: message.guild.id, language: language})
            i18next.changeLanguage(language);
            console.log(message.guild.name + i18next.t('guildconfigurated'));
            message.editReply(i18next.t('configuratedguild'))
        }
        return language;
    } catch(e) {
        console.log(i18next.t("failsetlanguage") + e);
    }
}

function load_itemslist() {
    //#region parsing JSON
    console.log("Loading items... ⏳");
    let parsed_items;
    let parsed_actions;
    fs.readFile('assets/JSON/items.json', (err, items) => {
        parsed_items = JSON.parse(items);
        fs.readFile('assets/JSON/actions.json', (err, actions) => {
            parsed_actions = JSON.parse(actions);
            console.log("Parsing JSON: ✔");

            //#region items creation. 
            parsed_items.forEach(item => {
                let id = item["definition"]["item"]["id"]
                let rarity_number = item['definition']['item']['baseParameters']['rarity'];
                let rarity
                let color;
                let tmp_stats_fr = []
                let tmp_stats_en = []
                let level;
                switch(rarity_number) {
                    case 1:
                        color = 16777215;
                        rarity = "common";
                        break;
                    case 2:
                        color = 65280;
                        rarity = "rare";
                        break;
                    case 3:
                        color = 16750592;
                        rarity = "mythic";
                        break;
                    case 4:
                        color = 16776960;
                        rarity = "legendary";
                        break;
                    case 5:
                        color = 11075839;
                        rarity = "relic";
                        break;
                    case 6:
                        color = 52991;
                        rarity = "souvenir";
                        break;
                    case 7:
                        color = 16711935;
                        rarity = "epic";
                        break;
                }
                item['definition']['equipEffects'].forEach(bonus => {
                    let bonus_id = bonus['effect']['definition']['actionId'];
                    parsed_actions.forEach(action => {
                        if(bonus_id === action['definition']['id']) {
                            let stats_fr = "";
                            let stats_en = "";
                            let param = bonus['effect']['definition']['params'];
                            level = parseInt(item['definition']['item']['level']);
                            if (item['definition']['item']['baseParameters']['itemTypeId'] === 582) {
                                level += 50
                            }
                            
                            if(action['description'] != null) {
                                stats_fr = action['description']["fr"];
                                stats_fr = stats_fr.replace('[~3]?[#1] Maîtrise [#3]:', "");
                                stats_fr = stats_fr.replace('[~3]?[#1] Résistance [#3]:', "");

                                if(stats_fr.includes("{[~2]? en [#2]:}")) {
                                    switch(parseInt(param[3]) * level + parseInt(param[2])) {
                                        case 64:
                                            stats_fr = stats_fr.replace("{[~2]? en [#2]:}", " en paysan.");
                                            break;
                                        case 71:
                                            stats_fr = stats_fr.replace("{[~2]? en [#2]:}", " en forestier.");
                                            break;
                                        case 72:
                                            stats_fr = stats_fr.replace("{[~2]? en [#2]:}", " en herboriste.");
                                            break;
                                        case 73:
                                            stats_fr = stats_fr.replace("{[~2]? en [#2]:}", " en mineur.");
                                            break;
                                        case 74:
                                            stats_fr = stats_fr.replace("{[~2]? en [#2]:}", " en trappeur.");
                                            break;
                                        case 75:
                                            stats_fr = stats_fr.replace("{[~2]? en [#2]:}", " en pêcheur.");
                                            break;
                                    }
                                }

                                stats_fr = stats_fr.replace('[#1]', parseInt(param[1]) * level + parseInt(param[0]));
                                stats_fr = stats_fr.replace('[#2]', parseInt(param[3]) * level + parseInt(param[2]));
                                stats_fr = stats_fr.replace('[#3]', parseInt(param[5]) * level + parseInt(param[4]));

                                stats_fr = stats_fr.replace('[>1]?', "");
                                stats_fr = stats_fr.replace('{[>2]?:s}', "s");
                                stats_fr = stats_fr.replace('{[>2]?s:}', "s");
                                stats_fr = stats_fr.replace('{[>2]?s:}', "s");
                                stats_fr = stats_fr.replace('{[=2]?:s}', "");
                                stats_fr = stats_fr.replace('{[=2]?s:}', "");
                                stats_fr = stats_fr.replace('{[=2]?:}', "");
                                stats_fr = stats_fr.replace('[~3]?', "");
                                stats_fr = stats_fr.replace("{", "");
                                stats_fr = stats_fr.replace("}", "");
                                stats_fr = stats_fr.replace('[el1]', "feu");
                                stats_fr = stats_fr.replace('[el2]', "eau");
                                stats_fr = stats_fr.replace('[el3]', "terre");
                                stats_fr = stats_fr.replace('[el4]', "air");

                                tmp_stats_fr.push([bonus_id,
                                    parseInt(param[1]) * level + parseInt(param[0]),
                                    parseInt(param[3]) * level + parseInt(param[2]),
                                    parseInt(param[5]) * level + parseInt(param[4]),
                                    stats_fr]
                                );

                                stats_en = action['description']["en"];
                                stats_en = stats_en.replace('[~3]?[#1] Mastery [#3]:', "");
                                stats_en = stats_en.replace('[~3]?[#1] Resistance [#3]:', "");

                                if(stats_en.includes("{[~2]? in [#2]:}")) {
                                    switch(parseInt(param[3]) * level + parseInt(param[2])) {
                                        case 64:
                                            stats_en = stats_en.replace("{[~2]? in [#2]:}", " in farmer.");
                                            break;
                                        case 71:
                                            stats_en = stats_en.replace("{[~2]? in [#2]:}", " in lumberjack.");
                                            break;
                                        case 72:
                                            stats_en = stats_en.replace("{[~2]? in [#2]:}", " in herborist.");
                                            break;
                                        case 73:
                                            stats_en = stats_en.replace("{[~2]? in [#2]:}", " in miner.");
                                            break;
                                        case 74:
                                            stats_en = stats_en.replace("{[~2]? in [#2]:}", " in trapper.");
                                            break;
                                        case 75:
                                            stats_en = stats_en.replace("{[~2]? in [#2]:}", " in fisherman.");
                                            break;
                                    }
                                }

                                stats_en = stats_en.replace('[#1]', parseInt(param[1]) * level + parseInt(param[0]));
                                stats_en = stats_en.replace('[#2]', parseInt(param[3]) * level + parseInt(param[2]));
                                stats_en = stats_en.replace('[#3]', parseInt(param[5]) * level + parseInt(param[4]));

                                stats_en = stats_en.replace('[>1]?', "");
                                stats_en = stats_en.replace('{[>2]?:s}', "s");
                                stats_en = stats_en.replace('{[>2]?s:}', "s");
                                stats_en = stats_en.replace('{[>2]?s:}', "s");
                                stats_en = stats_en.replace('{[=2]?:s}', "");
                                stats_en = stats_en.replace('{[=2]?s:}', "");
                                stats_en = stats_en.replace('{[=2]?:}', "");
                                stats_en = stats_en.replace('[~3]?', "");
                                stats_en = stats_en.replace("{", "");
                                stats_en = stats_en.replace("}", "");
                                stats_en = stats_en.replace('[el1]', "fire");
                                stats_en = stats_en.replace('[el2]', "water");
                                stats_en = stats_en.replace('[el3]', "earth");
                                stats_en = stats_en.replace('[el4]', "air");

                                tmp_stats_en.push([bonus_id,
                                    (parseInt(param[1]) * level + parseInt(param[0])),
                                    (parseInt(param[3]) * level + parseInt(param[2])),
                                    (parseInt(param[5]) * level + parseInt(param[4])),
                                    stats_en]
                                );
                            }
                        }
                    })
                })

                let description_fr = ""
                if(item['description'] != null) {
                    description_fr = "*" + item['description']["fr"] + "*";
                }
                let description_en = ""
                if(item['description'] != null) {
                    description_en = "*" + item['description']["en"] + "*";
                }
                    
                let sorted_stats_fr = [];
                let sorted_stats_en = [];

                sorted_ids.forEach((id, index) => {
                    tmp_stats_fr.forEach(stat => {
                        //console.log(stat)
                        if(stat[0] === id) {
                            sorted_stats_fr[index] = stat;
                        }
                    })
                    tmp_stats_en.forEach(stat => {
                        if(stat[0] === id) {
                            sorted_stats_en[index] = stat;
                        }
                    })
                })
                let name_fr, name_en;
                if(item["title"]) {
                    name_fr = item["title"]["fr"];
                    name_en = item["title"]["en"];
                }

                //console.log(sorted_stats_en)
                list_items.push(new Item.Item(
                    id,
                    name_fr, 
                    name_en, 
                    rarity, 
                    color, 
                    level, 
                    description_fr, 
                    description_en, 
                    sorted_stats_fr, 
                    sorted_stats_en, 
                    "https://vertylo.github.io/wakassets/items/" + item['definition']['item']['graphicParameters']['gfxId'].toString() + ".png"
                ));
            });
            console.log("items loaded! ✔");
        })
    });

    //#endregion
}