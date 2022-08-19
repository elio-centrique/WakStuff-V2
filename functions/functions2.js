const Item = require("./assets/Classes/Item");
const JobItem = require("./assets/Classes/JobItem");

async function get_frame_fr(){
    let tmp_frame;
    await axios.get('http://www.krosmoz.com/fr/almanax').then((res) => {
        let $ = cheerio.load(res.data);
        jsonframe($);

        let frame = {
            day: "span[class=day-number]",
            month: "span[class=day-text]",
            name: "div#almanax_boss span.title",
            description_fr: "div#almanax_boss_desc",
            img: "div#almanax_boss_image img",
            dofus_bonus_fr: {
                bonus: "div.more"
            }
        }
        return $('body').scrape(frame, {string: true});
    }).then((frame) => {
        tmp_frame = JSON.parse(frame);
    })
    return tmp_frame;
}

async function get_frame_en() {
    let tmp_frame;
    await axios.get('http://www.krosmoz.com/en/almanax').then((res) => {
        let $ = cheerio.load(res.data);
        jsonframe($);

        let frame = {
            description_en: "div#almanax_boss_desc",
            dofus_bonus_en: {
                bonus: "div.more"
            }
        }
        return $('body').scrape(frame, {string: true});
    }).then((frame) => {
        tmp_frame = JSON.parse(frame);
    })
    return tmp_frame;
}

async function get_frame_total() {
    let json_total;
    let tmp_json;
    await get_frame_fr().then(async(json_fr) => {
        json_total = json_fr;
    })
    await get_frame_en().then(async(json_en) => {
        tmp_json = json_en;
    })
    json_total['description_en'] = tmp_json['description_en'];
    json_total['dofus_bonus_en'] = tmp_json['dofus_bonus_en'];
    return json_total;
}

function get_wakfu_bonus(){
    let bonus = [];
    const today = Date.now();
    const compare = Date.parse("2019-11-21");
    let difference = Math.floor((((today - compare)/1000)/3600)/24);
    switch(difference % 5) {
        case 0:
            bonus[0] = "+40 Prospection";
            bonus[1] = "+40 Prospecting";
            break;
        case 1:
            bonus[0] = "+20% XP & Vitesse de Fabrication";
            bonus[1] = "+20% XP & Speed Craft";
            break;
        case 2:
            bonus[0] = "+30% XP Récolte et Plantation";
            bonus[1] = "+30% XP Harvest & Planting";
            break;
        case 3:
            bonus[0] = "+20% Quantité de Récolte et Chance de Plantation";
            bonus[1] = "+20% Quantity of Harvest & +20% Chance of Planting";
            break;
        case 4:
            bonus[0] = "+40 Sagesse";
            bonus[1] = "+40 Wisdom";
            break;
    }
    return bonus;
}

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
            message.channel.send(i18next.t('updatedlanguageguild') + language)
        } else {
            await collection.insertOne({id_server: message.guild.id, language: language})
            i18next.changeLanguage(language);
            console.log(message.guild.name + i18next.t('guildconfigurated'));
            message.channel.send(i18next.t('configuratedguild'))
        }
        return language;
    } catch(e) {
        console.log(i18next.t("failsetlanguage") + e);
    }
}

async function get_prefix(message, collection) {
    try {
        let result = await collection.findOne({id_server: {$eq: message.guild.id}})
        if(result && result.id_server === message.guild.id) {
            if(result.prefix) {
                return result.prefix;
            } else {
                return "w!"
            }
        } else {
            return "w!"
        }
    } catch(e) {
        console.log(i18next.t("failgetprefix") + e);
    }
}

async function set_prefix(message, a_prefix, collection) {
    try {
        let result = await collection.findOne({id_server: {$eq: message.guild.id}})
        if(result && result.id_server === message.guild.id) {
            await collection.updateOne({id_server: {$eq: message.guild.id}}, {$set: {prefix: a_prefix}})
            console.log(message.guild.name + i18next.t('guildupdated'))
            message.channel.send(i18next.t('updatedprefixguild') + a_prefix)
        } else {
            await collection.insertOne({id_server: message.guild.id, language: "en", prefix: a_prefix})
            console.log(message.guild.name + i18next.t('guildconfigurated'));
            message.channel.send(i18next.t('configuratedguild'))
        }
        return a_prefix;
    } catch(e) {
        console.log(i18next.t("failsetlanguage") + e);
    }
}

function load_itemslist() {
    //#region parsing JSON
    console.log("Loading items... ⏳");
    let parsed_items;
    let parsed_actions;
    let parsed_jobitems;
    fs.readFile('assets/JSON/jobsItems.json', (err,jobItems) => {
        parsed_jobitems = JSON.parse(jobItems);
        console.log("Parsing Jobs: ✔");

        parsed_jobitems.forEach(jobitem => {
          let rarity_number = jobitem['definition']['rarity'];
          let rarity = rarity_number;
          let color;
          let level = jobitem['definition']['level'];
          switch(rarity_number) {
              case 1:
                 color = 16777215;
                  rarity = "common";
                  break;
              case 2:
                     color = 65280;
                  rarity = "rare";
                  break;
                }
                //fin 0.1

                let description_fr = ""
                if(jobitem['description'] != null) {
                    description_fr = "*" + jobitem['description']["fr"] + "*";
                }
                let description_en = ""
                if(jobitem['description'] != null) {
                    description_en = "*" + jobitem['description']["en"] + "*";
                }

                let name_fr, name_en;
                if(jobitem["title"]) {
                    name_fr = jobitem["title"]["fr"];
                    name_en = jobitem["title"]["en"];
                }


                //console.log(sorted_stats_en)
                list_jobitems.push(new JobItem.JobItem(
                    name_fr,
                    name_en,
                    rarity,
                    color,
                    level,
                    loc,
                    description_fr,
                    description_en,
                    "https://vertylo.github.io/wakassets/items/" + jobitem['definition']['graphicParameters']['gfxId'].toString() + ".png"
                  ));
                });

                  console.log("jobitems loaded! ✔");
            });

    fs.readFile('assets/JSON/items.json', (err, items) => {
        parsed_items = JSON.parse(items);
        fs.readFile('assets/JSON/actions.json', (err, actions) => {
            parsed_actions = JSON.parse(actions);
            console.log("Parsing JSON: ✔");

            //#region items creation.
            parsed_items.forEach(item => {
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
                //fin 0.1
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
