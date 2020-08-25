const i18next = require('i18next');

//#region commandes
client.on('message', async message => {
    let prefix = await get_prefix(message, mongo_collection);
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    let lang = await get_language(message, mongo_collection);

    if (command === 'prefix') {
        if (args.length === 0) {
            message.channel.send(i18next.t('getprefix') + prefix);
        } else if (args.length === 1) {
            await set_prefix(message, args[0], mongo_collection)
        } else {
            message.channel.send(i18next.t('toomucharguments'));
        }
    }

    if (command === 'language') {
        if (args.length === 0) {
            return message.channel.send(i18next.t('getlanguage') + lang);
        } else if (args.length === 1) {
            await set_language(message, mongo_collection, args[0])
        } else {
            return message.channel.send(i18next.t('toomucharguments'));
        }
    }

    if (command === 'configure') {
         if (args.length < 2) {
            return message.channel.send(i18next.t('notenougharguments'));
        } else if (args.length === 2) {
            await set_language(message, mongo_collection, args[0])
            await set_prefix(message, args[1], mongo_collection);
        } else {
            return message.channel.send(i18next.t('toomucharguments'));
        }
    }

    if (command === 'stats') {
        let count = 0;
        await get_language(message, mongo_collection)
        if (args.length > 0) {
            return message.channel.send(i18next.t('noargument'));
        } if(message.author.id === "109752351643955200") {
            client.guilds.cache.forEach(guild => {
                count++;
            });
            if(lang === "fr") {
                message.channel.send('Il y a ' + count + ' serveurs qui m\'utilisent... Incroyable');
            } else {
                message.channel.send('there is ' + count + ' servers using myself... Incredible');
            }
        } else {
            console.log(message.author.username + " from " + message.guild.name + " tries to gets my stats.")
            message.channel.send(i18next.t('noauthorized'))
        }

    }

    if (command === 'search') {
        if (args.length < 1) {
            return message.channel.send(i18next.t('notenougharguments'));
        } else if (args.length >= 1) {
            let find_object = false;
            let list_found = [];

            list_items.forEach(item => {
                if(item.name_fr && item.name_fr.toLowerCase().includes(args.join(" ").toLowerCase())) {
                    find_object = true;
                    list_found.push(item);
                } else if(item.name_en && item.name_en.toLowerCase().includes(args.join(" ").toLowerCase())) {
                    find_object = true;
                    list_found.push(item);
                }
            })

            if(!find_object) {
                message.channel.send(args.join(' ') + i18next.t("noObject"));
            } else {
                if (list_found.length === 1) {
                    if (lang === 'fr') {
                        let embed = new Discord.MessageEmbed().setTitle(list_found[0].name_fr)
                            .setDescription(list_found[0].get_message_stats(lang))
                            .setColor(list_found[0].color)
                            .addField("Description: ", list_found[0].description_fr)
                            .setImage(list_found[0].image)
                        message.channel.send(embed);
                    } else {
                        let embed = new Discord.MessageEmbed().setTitle(list_found[0].name_en)
                            .setDescription(list_found[0].get_message_stats(lang))
                            .setColor(list_found[0].color)
                            .addField("Description: ", list_found[0].description_en)
                            .setImage(list_found[0].image)
                        message.channel.send(embed);
                    }
                } else {
                    if (list_found.length > 11) {
                        message.channel.send(i18next.t("toomanyobjects"));
                    } else {
                        let description = "";
                        let i = 1;
                        let answers = []
                        list_found.forEach(item_found => {
                            if (lang === "fr") {
                                description += i + "> " + item_found.name_fr + " " + i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()) + "\n";
                            } else {
                                description += i + "> " + item_found.name_en + " " + i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()) + "\n";
                            }
                            answers.push(i);
                            i++;
                        })
                        let embed = new Discord.MessageEmbed()
                            .setTitle(i18next.t("chooseNumber"))
                            .setDescription(description);

                        const filter = m => {
                            return answers.includes(parseInt(m.content));
                        };
                        message.channel.send(embed).then(() => {
                            message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                            .then(collected => {
                                if (lang === "fr") {
                                    let embed_item = new Discord.MessageEmbed().setTitle(list_found[parseInt(collected.first().content) - 1].name_fr + " " + i18next.t("level") + " " + list_found[parseInt(collected.first().content) - 1].level)
                                        .setDescription(list_found[parseInt(collected.first().content) - 1].get_message_stats(lang))
                                        .setColor(list_found[parseInt(collected.first().content) - 1].color)
                                        .addField("Description: ", list_found[parseInt(collected.first().content) - 1].description_fr)
                                        .setImage(list_found[parseInt(collected.first().content) - 1].image)
                                    message.channel.send(embed_item);
                                } else {
                                    let embed_item = new Discord.MessageEmbed().setTitle(list_found[parseInt(collected.first().content) - 1].name_en + " " + i18next.t("level") + " " + list_found[parseInt(collected.first().content) - 1].level)
                                        .setDescription(list_found[parseInt(collected.first().content) - 1].get_message_stats(lang))
                                        .setColor(list_found[parseInt(collected.first().content) - 1].color)
                                        .addField("Description: ", list_found[parseInt(collected.first().content) - 1].description_en)
                                        .setImage(list_found[parseInt(collected.first().content) - 1].image)
                                    message.channel.send(embed_item)
                                }
                            })
                            .catch(collected => {
                                message.channel.send(i18next.t("timesup"));
                            });
                        })
                    }
                }
            }
        }
    }

    if (command === 'compare') {
        let find_object1 = false
        let find_object2 = false
        let item1 = null
        let item2 = null
        let answer_name = []

        if (args.length > 1) {
            return message.channel.send(i18next.t('notenougharguments'));
        } else {
            list_items.forEach(item => {
                answer_name.push(item.name_fr.toLowerCase());
                answer_name.push(item.name_en.toLowerCase());
            });
            const filter_item1 = m => {
                return answer_name.includes(m.content);
            };
            message.channel.send(i18next.t('choose_first_item')).then(() => {
                message.channel.awaitMessages(filter_item1, {max: 1, time: 30000, errors: ['time']})
                .then(collected => {
                    let list_found = [];
                    list_items.forEach(item => {
                        if(item.name_fr && item.name_fr.toString().toLowerCase().includes(collected.first().content.toLowerCase())) {
                            find_object1 = true;
                            list_found.push(item);
                        } else if(item.name_en && item.name_en.toString().toLowerCase().includes(collected.first().content.toLowerCase())) {
                            find_object1 = true;
                            list_found.push(item);
                        }
                    })
                    let description = "";
                    let i = 1;
                    let answers_list1 = []
                    list_found.forEach(item_found => {
                        if (lang === "fr") {
                            description += i + "> " + item_found.name_fr + " " + i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()) + "\n";
                        } else {
                            description += i + "> " + item_found.name_en + " " + i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()) + "\n";
                        }
                        answers_list1.push(i);
                        i++;
                    })
                    let embed = new Discord.MessageEmbed()
                        .setTitle(i18next.t("chooseNumber"))
                        .setDescription(description);

                    const filter_list1 = m => {
                        return answers_list1.includes(parseInt(m.content));
                    };
                    message.channel.send(embed).then(() => {
                        message.channel.awaitMessages(filter_list1, {max: 1, time: 30000, errors: ['time']})
                        .then(collected => {
                            item1 = list_found[parseInt(collected.first().content) - 1];
                            list_items.forEach(item => {
                                answer_name.push(item.name_fr.toLowerCase());
                                answer_name.push(item.name_en.toLowerCase());
                            });
                            const filter_item2 = m => {
                                return answer_name.includes(m.content);
                            };
                            message.channel.send(i18next.t('choose_second_item')).then(() => {
                                message.channel.awaitMessages(filter_item2, {max: 1, time: 30000, errors: ['time']})
                                .then(collected => {
                                    let list_found = [];
                                    list_items.forEach(item => {
                                        if(item.name_fr && item.name_fr.toString().toLowerCase().includes(collected.first().content.toLowerCase())) {
                                            find_object2 = true;
                                            list_found.push(item);
                                        } else if(item.name_en && item.name_en.toString().toLowerCase().includes(collected.first().content.toLowerCase())) {
                                            find_object2 = true;
                                            list_found.push(item);
                                        }
                                    })
                                    let description = "";
                                    let i = 1;
                                    let answers_list2 = []
                                    list_found.forEach(item_found => {
                                        if (lang === "fr") {
                                            description += i + "> " + item_found.name_fr + " " + i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()) + "\n";
                                        } else {
                                            description += i + "> " + item_found.name_en + " " + i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()) + "\n";
                                        }
                                        answers_list2.push(i);
                                        i++;
                                    })
                                    let embed = new Discord.MessageEmbed()
                                        .setTitle(i18next.t("chooseNumber"))
                                        .setDescription(description);

                                    const filter_list2 = m => {
                                        return answers_list2.includes(parseInt(m.content));
                                    };
                                    message.channel.send(embed).then(() => {
                                        message.channel.awaitMessages(filter_list2, {max: 1, time: 30000, errors: ['time']})
                                        .then(collected => {
                                            item2 = list_found[parseInt(collected.first().content) - 1];
                                            if (find_object1 && find_object2) {
                                                let tabStats1 = []
                                                let tabStats2 = []
                                                item1.stats_fr.forEach(stat1 => {
                                                    let id_found = false;
                                                    if (debuff_ids.includes(stat1[0])) {
                                                        stat1[1] = stat1[1] * -1
                                                    }
                                                    item2.stats_fr.forEach(stat2 => {
                                                        if (stat1[0] === stat2[0]) {
                                                            id_found = true;
                                                            if (stat1[2] === stat2[2]) {
                                                                tabStats1.push([stat1[0], stat1[1] - stat2[1], 0])
                                                            } else {
                                                                tabStats1.push([stat1[0], stat1[1] - stat2[1], stat1[2] - stat2[2]])
                                                            }
                                                        }
                                                    })
                                                    if (!id_found) {
                                                        tabStats1.push([stat1[0], stat1[1], stat1[2]])
                                                    }
                                                })


                                                item2.stats_fr.forEach(stat1 => {
                                                    let id_found = false
                                                    if (debuff_ids.includes(stat1[0])) {
                                                        stat1[1] = stat1[1] * -1
                                                    }
                                                    item1.stats_fr.forEach(stat2 => {
                                                        if (stat1[0] === stat2[0]) {
                                                            id_found = true
                                                            if (stat1[2] === stat2[2]) {
                                                                tabStats2.push([stat1[0], stat1[1] - stat2[1], 0])
                                                            } else {
                                                                tabStats2.push([stat1[0], stat1[1] - stat2[1], stat1[2] - stat2[2]])
                                                            }
                                                        }
                                                    })
                                                    if (!id_found) {
                                                        tabStats2.push([stat1[0], stat1[1], stat1[2]])
                                                    }
                                                })
                                                let i = 0
                                                let j = 0
                                                let tmpMessage1 = ""
                                                let tmpMessage2 = ""
                                                if(lang === "fr") {
                                                    item1.stats_fr.forEach(stat => {
                                                        let indicator = ""
                                                        if (tabStats1[i][1] >= 0) {
                                                            indicator = "+"
                                                        }
                                                        let stat_message = stat[4].toString();
                                                        stat_message += " (" + indicator.toString() + tabStats1[i][1].toString() + ")"
                                                        tmpMessage1 += stat_message + "\n"
                                                        i++
                                                    })
                                                    item2.stats_fr.forEach(stat => {
                                                        let indicator = ""
                                                        if (tabStats2[j][1] >= 0) {
                                                            indicator = "+"
                                                        }
                                                        let stat_message = stat[4].toString()
                                                        stat_message += " (" + indicator.toString() + tabStats2[j][1].toString() + ")"
                                                        tmpMessage2 += stat_message + "\n"
                                                        j++
                                                    });
                                                } else {
                                                    item1.stats_en.forEach(stat => {
                                                        let indicator = ""
                                                        if (tabStats1[i][1] >= 0) {
                                                            indicator = "+"
                                                        }
                                                        let stat_message = stat[4].toString();
                                                        stat_message += " (" + indicator.toString() + tabStats1[i][1].toString() + ")"
                                                        tmpMessage1 += stat_message + "\n"
                                                        i++
                                                    })
                                                    item2.stats_en.forEach(stat => {
                                                        let indicator = ""
                                                        if (tabStats2[j][1] >= 0) {
                                                            indicator = "+"
                                                        }
                                                        let stat_message = stat[4].toString()
                                                        stat_message += " (" + indicator.toString() + tabStats2[j][1].toString() + ")"
                                                        tmpMessage2 += stat_message + "\n"
                                                        j++
                                                    });
                                                }
                                                let item_one_name;
                                                let item_two_name;
                                                if (lang === "fr") {
                                                    item_one_name = item1.name_fr
                                                    item_two_name = item2.name_fr
                                                } else {
                                                    item_one_name = item1.name_en
                                                    item_two_name = item2.name_en
                                                }
                                                let embed_message = new Discord.MessageEmbed()
                                                    .setTitle(i18next.t("itemVS") + item_one_name + " " + i18next.t(item1.rarity) + " VS " + item_two_name + " " + i18next.t(item2.rarity))
                                                    .setColor("#000000")
                                                    .addField(item_one_name, tmpMessage1, true)
                                                    .addField(item_two_name, tmpMessage2, true);
                                                message.channel.send(embed_message);
                                            }
                                        })
                                        .catch(collected => {
                                            message.channel.send(i18next.t("timesup"));
                                        });
                                    })

                                })
                                .catch(collected => {
                                    message.channel.send(i18next.t("timesup"));
                                })
                            })
                        })
                        .catch(collected => {
                            message.channel.send(i18next.t("timesup"));
                        });
                    })

                })
                .catch(collected => {
                    message.channel.send(i18next.t("timesup"));
                })
            })
        }
    }

    if(command === "help") {
        if(args.length === 0) {
            let embed_message = new Discord.MessageEmbed()
                .setTitle(i18next.t("help"))
                .setDescription(i18next.t("help_precisions"))
                .setColor("#FFFFFF")
                .addField("Configuration ", "**" + prefix + i18next.t("help_configure") + "\n**" + prefix + i18next.t("help_language") + "\n**" + prefix + i18next.t("help_prefix") , false)
                .addField("Objects ", "**" + prefix + i18next.t("help_search") + "\n**" + prefix + i18next.t("help_compare"), false)
                .addField("Help ", "**" + prefix + i18next.t("help_help"), false)
                .addField("Almanax ", "**" + prefix + i18next.t("help_almanax"), false)
            message.channel.send(embed_message);
        } else {
            message.channel.send(i18next.t("toomucharguments"))
        }
    }

    if(command === "almanax") {
        if(args.length === 0) {
            fetch('http://almanax.kasswat.com', {method: 'get'}).then(res => res.json()).then((json) => {
                let embed  = null;
                if(lang === "fr") {
                    embed = new Discord.MessageEmbed().setTitle(json['day'] + " " + json['month'] + " 977")
                        .setDescription(json['description'][0])
                        .addField('bonus', json['bonus'][0])
                        .setImage('https://vertylo.github.io/wakassets/merydes/' + json['img'] + '.png')
                } else {
                    embed = new Discord.MessageEmbed().setTitle(json['day'] + " " + json['month'] + " 977")
                        .setDescription(json['description'][1])
                        .addField('bonus', json['bonus'][1])
                        .setImage('https://vertylo.github.io/wakassets/merydes/' + json['img'] + '.png')
                }
                message.channel.send(embed);
            });
        } else {
            message.channel.send(i18next.t("toomucharguments"))
        }
    }
});
//#endregion
