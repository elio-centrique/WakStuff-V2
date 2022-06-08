const i18next = require('i18next');
const Discord = require("discord.js");


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
                    try {
                        if (lang === 'fr') {
                            let embed = new Discord.MessageEmbed().setTitle(list_found[0].name_fr + " "  + i18next.t("level") + " " + list_found[0].level)
                                .setDescription(list_found[0].get_message_stats(lang))
                                .setColor(list_found[0].color)
                                .addField("Description: ", list_found[0].description_fr)
                                .setImage(list_found[0].image)
                            message.channel.send({embeds: [embed.toJSON()]});
                        } else {
                            let embed = new Discord.MessageEmbed().setTitle(list_found[0].name_en + " "  + i18next.t("level") + " " + list_found[0].level)
                                .setDescription(list_found[0].get_message_stats(lang))
                                .setColor(list_found[0].color)
                                .addField("Description: ", list_found[0].description_en)
                                .setImage(list_found[0].image)
                            message.channel.send({embeds: [embed.toJSON()]});
                        }
                    } catch(e) {
                        message.member.createDM().then(dm => {
                            dm.send("can't send message in #" + message.channel.name + ". Please check my permission in this channel.");
                        });
                    }
                } else {
                    if (list_found.length > 25) {
                        message.channel.send(i18next.t("toomanyobjects"));
                    } else {
                        let options = []
                        let i = 0;
                        list_found.forEach(item_found => {
                            let option
                            if (lang === "fr") {
                                option = new Option.Option(item_found.name_fr, i.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                            } else {
                                option = new Option.Option(item_found.name_en, i.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                            }
                            options.push(option);
                            i++;
                        });
                        let selectMessage = new Discord.MessageSelectMenu();
                        selectMessage.setPlaceholder(i18next.t("chooseNumber"))
                            .addOptions(options)
                            .setCustomId("search");

                        /*let embed = new Discord.MessageEmbed()
                            .setTitle(i18next.t("chooseNumber"))
                            .setDescription(description);
                        */
                        const filter = (interaction) => interaction.customId === selectMessage.customId;
                        const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });
                        message.channel.send({
                            content: selectMessage.placeholder,
                            components: [{
                                "type": "ACTION_ROW",
                                components: [{
                                    "type": "SELECT_MENU",
                                    "customId": selectMessage.customId,
                                    "options": selectMessage.options,
                                }]
                            }],
                            ephemeral: true,
                        });
                        collector.on('collect', collected => {
                            message.channel.lastMessage.delete();
                            try {
                                if (lang === "fr") {
                                    let embed_item = new Discord.MessageEmbed()
                                        .setTitle(list_found[parseInt(collected.values[0])].name_fr + " "  + i18next.t("level") + " " + list_found[parseInt(collected.values[0])].level)
                                        .setDescription(list_found[parseInt(collected.values[0])].get_message_stats(lang))
                                        .setColor(list_found[parseInt(collected.values[0])].color)
                                        .addField("Description: ", list_found[parseInt(collected.values[0])].description_fr)
                                        .setImage(list_found[parseInt(collected.values[0])].image)
                                    message.channel.send({
                                        embeds: [embed_item.toJSON()]
                                    });
                                    collector.stop("finish")
                                } else {
                                    let embed_item = new Discord.MessageEmbed()
                                        .setTitle(list_found[parseInt(collected.values[0])].name_en + " " + i18next.t("level") + " " + list_found[parseInt(collected.values[0])].level)
                                        .setDescription(list_found[parseInt(collected.values[0])].get_message_stats(lang))
                                        .setColor(list_found[parseInt(collected.values[0])].color)
                                        .addField("Description: ", list_found[parseInt(collected.values[0])].description_en)
                                        .setImage(list_found[parseInt(collected.values[0])].image)
                                    message.channel.send({
                                        embeds: [embed_item.toJSON()]
                                    });
                                    collector.stop("finish")
                                }
                            } catch(e) {
                                message.member.createDM().then(dm => {
                                    dm.send("can't send message in #" + message.channel.name + ". Please check my permission in this channel.");
                                });
                            }
                        });
                        collector.on('end', (collected, reason) => {
                            if(reason === "time"){
                                message.channel.send(i18next.t("timesup"))
                            }
                        });
                    }
                }
            }
        }
    }

    /*
    if (command === 'compare') {
        let find_object1 = false
        let find_object2 = false
        let item1 = null
        let item2 = null
        let answer_name = []

        if (args.length > 1) {
            return message.channel.send(i18next.t('toomanyarguments'));
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
                    let options1 = []
                    let i = 1;
                    let answers_list1 = []
                    list_found.forEach(item_found => {
                        if (lang === "fr") {
                                option = new Option.Option(item_found.name_fr, i.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                            } else {
                                option = new Option.Option(item_found.name_en, i.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                            }
                        answers_list1.push(option);
                        i++;
                    })
                    let selectMessage = new Discord.MessageSelectMenu();
                        selectMessage.setPlaceholder(i18next.t("chooseNumber"))
                            .addOptions(answer_list1)
                            .setCustomId("search1");

                        /*let embed = new Discord.MessageEmbed()
                            .setTitle(i18next.t("chooseNumber"))
                            .setDescription(description);
                        */ /*
                    const filter_1 = (interaction) => interaction.customId === selectMessage.customId;
                    const collector_1 = message.channel.createMessageComponentCollector({ filter_1, time: 120000 });
                    collector_1.channel.send({
                        content: selectMessage.placeholder,
                        components: [{
                            "type": "ACTION_ROW",
                            components: [{
                                "type": "SELECT_MENU",
                                "customId": selectMessage.customId,
                                "options": selectMessage.options,
                            }]
                        }],
                        ephemeral: false,
                    });
                    collector_1.on('collect', collected => {
                        item1 = list_found[parseInt(collected.values[0])];
                        //collector.channel.lastMessage.delete();
                        if (lang === "fr") {
                            /*let embed_item = new Discord.MessageEmbed()
                                .setTitle(list_found[parseInt(collected.values[0])].name_fr + " "  + i18next.t("level") + " " + list_found[parseInt(collected.values[0])].level)
                                .setDescription(list_found[parseInt(collected.values[0])].get_message_stats(lang))
                                .setColor(list_found[parseInt(collected.values[0])].color)
                                .addField("Description: ", list_found[parseInt(collected.values[0])].description_fr)
                                .setImage(list_found[parseInt(collected.values[0])].image)
                            message.channel.send({
                                embeds: [embed_item.toJSON()]
                            });
                            */ /*
                            //collector.stop("finish")
                        } else {
                            /*
                            let embed_item = new Discord.MessageEmbed()
                                .setTitle(list_found[parseInt(collected.values[0])].name_en + " " + i18next.t("level") + " " + list_found[parseInt(collected.values[0])].level)
                                .setDescription(list_found[parseInt(collected.values[0])].get_message_stats(lang))
                                .setColor(list_found[parseInt(collected.values[0])].color)
                                .addField("Description: ", list_found[parseInt(collected.values[0])].description_en)
                                .setImage(list_found[parseInt(collected.values[0])].image)
                            message.channel.send({
                                embeds: [embed_item.toJSON()]
                            });
                            */ /*
                            //collector.stop("finish")
                        }
                        collector_1.stop("finish")
                    });
                    collector_1.on('end', (collected, reason) => {
                        if(reason === "time"){
                            message.channel.send(i18next.t("timesup"))
                        }
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
                            let options2 = []
                            let j = 1;
                            let answers_list2 = []
                            list_found.forEach(item_found => {
                                if (lang === "fr") {
                                        option = new Option.Option(item_found.name_fr, j.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                                    } else {
                                        option = new Option.Option(item_found.name_en, j.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                                    }
                                answers_list1.push(option);
                                i++;
                            })
                            let selectMessage = new Discord.MessageSelectMenu();
                                selectMessage.setPlaceholder(i18next.t("chooseNumber"))
                                    .addOptions(answer_list2)
                                    .setCustomId("search2");

                                /*let embed = new Discord.MessageEmbed()
                                    .setTitle(i18next.t("chooseNumber"))
                                    .setDescription(description);
                                */ /*
                            const filter_2 = (interaction) => interaction.customId === selectMessage.customId;
                            const collector_2 = message.channel.createMessageComponentCollector({ filter_2, time: 120000 });
                            collector_2.channel.send({
                                content: selectMessage.placeholder,
                                components: [{
                                    "type": "ACTION_ROW",
                                    components: [{
                                        "type": "SELECT_MENU",
                                        "customId": selectMessage.customId,
                                        "options": selectMessage.options,
                                    }]
                                }],
                                ephemeral: false,
                            });
                            collector_2.on('collect', collected => {
                                item2 = list_found[parseInt(collected.values[0])];
                                //collector.channel.lastMessage.delete();
                                if (lang === "fr") {
                                    /*let embed_item = new Discord.MessageEmbed()
                                        .setTitle(list_found[parseInt(collected.values[0])].name_fr + " "  + i18next.t("level") + " " + list_found[parseInt(collected.values[0])].level)
                                        .setDescription(list_found[parseInt(collected.values[0])].get_message_stats(lang))
                                        .setColor(list_found[parseInt(collected.values[0])].color)
                                        .addField("Description: ", list_found[parseInt(collected.values[0])].description_fr)
                                        .setImage(list_found[parseInt(collected.values[0])].image)
                                    message.channel.send({
                                        embeds: [embed_item.toJSON()]
                                    });
                                    */ /*
                                    //collector.stop("finish")
                                } else {
                                    /*
                                    let embed_item = new Discord.MessageEmbed()
                                        .setTitle(list_found[parseInt(collected.values[0])].name_en + " " + i18next.t("level") + " " + list_found[parseInt(collected.values[0])].level)
                                        .setDescription(list_found[parseInt(collected.values[0])].get_message_stats(lang))
                                        .setColor(list_found[parseInt(collected.values[0])].color)
                                        .addField("Description: ", list_found[parseInt(collected.values[0])].description_en)
                                        .setImage(list_found[parseInt(collected.values[0])].image)
                                    message.channel.send({
                                        embeds: [embed_item.toJSON()]
                                    });
                                    */ /*
                                    //collector.stop("finish")
                                }
                                collector_2.stop("finish")
                            });
                            collector_2.on('end', (collected, reason) => {
                                if(reason === "time"){
                                    message.channel.send(i18next.t("timesup"))
                                }
                            });
                                   
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
                                let k = 0
                                let l = 0
                                let tmpMessage1 = ""
                                let tmpMessage2 = ""
                                if(lang === "fr") {
                                    item1.stats_fr.forEach(stat => {
                                        let indicator = ""
                                        if (tabStats1[k][1] >= 0) {
                                            indicator = "+"
                                        }
                                        let stat_message = stat[4].toString();
                                        stat_message += " (" + indicator.toString() + tabStats1[k][1].toString() + ")"
                                        tmpMessage1 += stat_message + "\n"
                                        k++
                                    })
                                    item2.stats_fr.forEach(stat => {
                                        let indicator = ""
                                        if (tabStats2[l][1] >= 0) {
                                            indicator = "+"
                                        }
                                        let stat_message = stat[4].toString()
                                        stat_message += " (" + indicator.toString() + tabStats2[l][1].toString() + ")"
                                        tmpMessage2 += stat_message + "\n"
                                        j++
                                    });
                                } else {
                                    item1.stats_en.forEach(stat => {
                                        let indicator = ""
                                        if (tabStats1[k][1] >= 0) {
                                            indicator = "+"
                                        }
                                        let stat_message = stat[4].toString();
                                        stat_message += " (" + indicator.toString() + tabStats1[k][1].toString() + ")"
                                        tmpMessage1 += stat_message + "\n"
                                        k++
                                    })
                                    item2.stats_en.forEach(stat => {
                                        let indicator = ""
                                        if (tabStats2[l][1] >= 0) {
                                            indicator = "+"
                                        }
                                        let stat_message = stat[4].toString()
                                        stat_message += " (" + indicator.toString() + tabStats2[l][1].toString() + ")"
                                        tmpMessage2 += stat_message + "\n"
                                        l++
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
                                message.channel.send({embeds: [embed_message]});
                            }
                        })
                    }).catch(collected => {
                        message.channel.send(i18next.t("timesup"));
                    });
                })
            }).catch(collected => {
                message.channel.send(i18next.t("timesup"));
            });                
        }
    }
    */
    
    if(command === "help") {
        if(args.length === 0) {
            let embed_message = new Discord.MessageEmbed()
                .setTitle(i18next.t("help"))
                .setDescription(i18next.t("help_precisions"))
                .setColor("#FFFFFF")
                .addField("Configuration ", "**" + prefix + i18next.t("help_configure") + "\n**" + prefix + i18next.t("help_language") + "\n**" + prefix + i18next.t("help_prefix") , false)
                .addField("Objects ", "**" + prefix + i18next.t("help_search") + "\n**", false)
                .addField("Help ", "**" + prefix + i18next.t("help_help"), false)
                .addField("Almanax ", "**" + prefix + i18next.t("help_almanax"), false)
            message.channel.send({embeds: [embed_message]});
        } else {
            message.channel.send(i18next.t("toomucharguments"))
        }
    }

    if(command === "almanax") {
        if(args.length === 0) {
            get_frame_total().then((json) => {
                let wakfu_bonus = get_wakfu_bonus();
                json['description_fr'] = json['description_fr'].slice(json['description_fr'].indexOf(" "));
                json['description_en'] = json['description_en'].slice(json['description_en'].indexOf(" "));
                let embed  = null;
                if(lang === "fr") {
                    embed = new Discord.MessageEmbed().setTitle(json['day'] + " " + json['month'] + " 977")
                        .setDescription(json['description_fr'])
                        .addField('\u200b', '\u200b')
                        .addField('BONUS WAKFU', wakfu_bonus[0])
                        .addField('\u200b', '\u200b')
                        .addField('BONUS DOFUS', json['dofus_bonus_fr']['bonus'])
                        .setImage(json['img'])
                } else {
                    embed = new Discord.MessageEmbed().setTitle(json['day'] + " " + json['month'] + " 977")
                        .setDescription(json['description_en'])
                        .addField('\u200b', '\u200b')
                        .addField('WAKFU\'S BONUS', wakfu_bonus[1])
                        .addField('\u200b', '\u200b')
                        .addField('BONUS DOFUS', json['dofus_bonus_en']['bonus'])
                        .setImage(json['img'])
                }
                message.channel.send({embeds: [embed]});
            });
        } else {
            message.channel.send(i18next.t("toomucharguments"))
        }
    }

    if (command === 'bdd') {
        if (args.length > 0) {
            return message.channel.send(i18next.t('noargument'));
        } if(message.author.id === "109752351643955200") {
            client.guilds.cache.forEach(guild => {
                let id_guild = guild.id;
                let guild_name = guild.name;
                try {
                    collection.updateOne({id_server: {$eq: id_guild}}, {$set: {guild_name: guild_name}})
                } catch (e) {
                    console.log("erreur en modifiant " + guild_name)
                }
            });
        } else {
            console.log(message.author.username + " from " + message.guild.name + " tries to use bdd command.")
            message.channel.send(i18next.t('noauthorized'))
        }
    }
});
//#endregion
