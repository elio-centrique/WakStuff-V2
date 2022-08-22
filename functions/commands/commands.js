const i18next = require('i18next');
const {EmbedBuilder, SelectMenuBuilder, ModalBuilder , ActionRowBuilder} = require("discord.js");
const {Option} = require("./assets/Classes/Option");

//#region commandes
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isSelectMenu()) return;
    let lang = await get_language(interaction, mongo_collection);
    await interaction.deferReply();

    if(interaction.isCommand()){
        const { commandName } = interaction;
        //await setLanguage(interaction)

        if (commandName === 'language') {
            if (interaction.options._hoistedOptions.length === 0) {
                return interaction.editReply(i18next.t('getlanguage') + lang);
            } else if (interaction.options._hoistedOptions.length === 1) {
                await set_language(interaction, mongo_collection, interaction.options.getString('language'))
            } else {
                return interaction.editReply(i18next.t('toomucharguments'));
            }
        }

        if (commandName === 'stats') {
            let count = 0;
            await get_language(interaction, mongo_collection)
            if (interaction.options._hoistedOptions.length > 0) {
                return interaction.editReply(i18next.t('noargument'));
            } if(interaction.author.id === "109752351643955200") {
                client.guilds.cache.forEach(guild => {
                    count++;
                });
                if(lang === "fr") {
                    interaction.editReply('Il y a ' + count + ' serveurs qui m\'utilisent... Incroyable');
                } else {
                    interaction.editReply('there is ' + count + ' servers using myself... Incredible');
                }
            } else {
                console.log(interaction.author.username + " from " + interaction.guild.name + " tries to gets my stats.")
                interaction.editReply(i18next.t('noauthorized'))
            }

        }

        if (commandName === 'search') {
            if (interaction.options._hoistedOptions.length < 1) {
                return interaction.editReply(i18next.t('notenougharguments'));
            }
            if (interaction.options._hoistedOptions.length > 1) {
                return interaction.editReply(i18next.t('toomucharguments'));
            }
            if (interaction.options._hoistedOptions.length === 1) {
                let find_object = false;
                let list_found = [];

                list_items.forEach(item => {
                    if(item.name_fr && item.name_fr.toLowerCase().includes(interaction.options.getString('gear').toLowerCase())) {
                        find_object = true;
                        list_found.push(item);
                    } else if(item.name_en && item.name_en.toLowerCase().includes(interaction.options.getString('gear').toLowerCase())) {
                        find_object = true;
                        list_found.push(item);
                    }
                })
                if(!find_object) {
                    interaction.editReply(interaction.options.getString('gear') + i18next.t("noObject"));
                } else {
                    if (list_found.length === 1) {
                        if (lang === 'fr') {
                            let embed = new EmbedBuilder().setTitle(list_found[0].name_fr)
                                .setDescription(list_found[0].get_message_stats(lang))
                                .setColor(list_found[0].color)
                                .addFields({
                                    name: "Description: ",
                                    value: list_found[0].description_fr
                                })
                                .setImage(list_found[0].image)
                            interaction.editReply({embeds:[embed]});
                        } else {
                            let embed = new EmbedBuilder().setTitle(list_found[0].name_en)
                                .setDescription(list_found[0].get_message_stats(lang))
                                .setColor(list_found[0].color)
                                .addFields({
                                    name: "Description: ",
                                    value:list_found[0].description_en
                                })
                                .setImage(list_found[0].image)
                            interaction.editReply({embeds:[embed]});
                        }
                    } else {
                        if (list_found.length > 25) {
                            interaction.editReply(i18next.t("toomanyobjects"));
                        } else {
                            let options = [];
                            let i = 0;
                            list_found.forEach(item_found => {
                                let option
                                if (lang === "fr") {
                                    option = new Option(item_found.name_fr, item_found.id.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                                } else {
                                    option = new Option(item_found.name_en, item_found.id.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                                }
                                options.push({label: option.label, description: option.description, value: option.value}) ;
                                i++;
                            });
                            let selectMessage = new SelectMenuBuilder()
                                .setPlaceholder(i18next.t("chooseNumber"))
                                .setOptions(options)
                                .setCustomId("search")
                            const row = new ActionRowBuilder().addComponents(selectMessage);
                            interaction.editReply({
                                content: selectMessage.placeholder,
                                components: [row]
                            });
                        }
                    }
                }
            }
        }

        if (commandName === 'compare') {
            let find_object1 = false
            let find_object2 = false
            let list_found1 = [];
            let list_found2 = [];
            if (interaction.options._hoistedOptions.length < 2) {
                return interaction.editReply(i18next.t('notenougharguments'));
            } else if (interaction.options._hoistedOptions.length > 2) {
                return interaction.editReply(i18next.t('toomucharguments'));
            }
            else {
                list_items.forEach(item => {
                    if(item.name_fr && item.name_fr.toLowerCase().includes(interaction.options.getString('gear_1').toLowerCase())) {
                        find_object1 = true;
                        list_found1.push(item);
                    } else if(item.name_en && item.name_en.toLowerCase().includes(interaction.options.getString('gear_1').toLowerCase())) {
                        find_object1 = true;
                        list_found1.push(item);
                    }

                    if(item.name_fr && item.name_fr.toLowerCase().includes(interaction.options.getString('gear_2').toLowerCase())) {
                        find_object2 = true;
                        list_found2.push(item);
                    } else if(item.name_en && item.name_en.toLowerCase().includes(interaction.options.getString('gear_2').toLowerCase())) {
                        find_object2 = true;
                        list_found2.push(item);
                    }
                })
                let options1 = []
                let i = 0;
                list_found1.forEach(item_found => {
                    let option1
                    if (lang === "fr") {
                        option1 = new Option(item_found.name_fr, item_found.id.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                    } else {
                        option1 = new Option(item_found.name_en, item_found.id.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                    }
                    options1.push({label: option1.label, description: option1.description, value: option1.value});
                    i++;
                });
                let selectMessage1 = new SelectMenuBuilder()
                    .setPlaceholder(i18next.t("chooseNumber"))
                    .setOptions(options1)
                    .setCustomId("search1")
                const row1 = new ActionRowBuilder().addComponents(selectMessage1);
                interaction.editReply({
                    content: selectMessage1.placeholder,
                    components: [row1]
                });

            }
        }

        if(commandName === "help") {
            if(interaction.options._hoistedOptions.length === 0) {
                let embed_message = new EmbedBuilder()
                    .setTitle(i18next.t("help"))
                    .setDescription(i18next.t("help_precisions"))
                    .setColor("#FFFFFF")
                    .addFields({
                        name: "language ",
                        value: "**" + i18next.t("help_configure") + "\n**" + prefix + i18next.t("help_language") + "\n**" + prefix + i18next.t("help_prefix")
                    })
                    .addFields({
                        name: "Objects ",
                        value: "**" + i18next.t("help_search") + "\n**" + prefix + i18next.t("help_compare")
                    })
                    .addFields({
                        name: "Help ",
                        value: "**" + i18next.t("help_help")
                    })
                    .addFields({
                        name: "Almanax ",
                        value: "**" +prefix + i18next.t("help_almanax")})
                interaction.editReply({embeds: [embed_message]});
            } else {
                interaction.editReply(i18next.t("toomucharguments"))
            }
        }
        /*
           if(commandName === "almanax") {
               if(interaction.options._hoistedOptions.length === 0) {
                   fetch('http://almanax.kasswat.com', {method: 'get'}).then(res => res.json()).then((json) => {
                       let embed  = null;
                       if(lang === "fr") {
                           embed = new EmbedBuilder().setTitle(json['day'] + " " + json['month'] + " 977")
                               .setDescription(json['description'][0])
                               .addField('bonus', json['bonus'][0])
                               .setImage('https://vertylo.github.io/wakassets/merydes/' + json['img'] + '.png')
                       } else {
                           embed = new EmbedBuilder().setTitle(json['day'] + " " + json['month'] + " 977")
                               .setDescription(json['description'][1])
                               .addField('bonus', json['bonus'][1])
                               .setImage('https://vertylo.github.io/wakassets/merydes/' + json['img'] + '.png')
                       }
                       interaction.editReply(embed);
                   });
               } else {
                   interaction.editReply(i18next.t("toomucharguments"))
               }
           } */
    }


    if(interaction.isSelectMenu()){
        let find_object = false
        let find_object1 = false
        let find_object2 = false
        let list_found = []
        let list_found1 = [];
        let list_found2 = [];
        let item_selected = null;
        let item1 = null
        let item2 = null
        console.log(interaction.values)
        if(interaction.customId === 'search') {
            try {
                list_items.forEach(item => {
                    if(item.id === parseInt(interaction.values)){
                        item_selected = item;
                        find_object = true
                    }
                })
                if (lang === "fr") {
                    let embed_item = new EmbedBuilder()
                        .setTitle(item_selected.name_fr + " "  + i18next.t("level") + " " + item_selected.level)
                        .setDescription(item_selected.get_message_stats(lang))
                        .setColor(item_selected.color)
                        .addFields({
                            name: "Description: ",
                            value: item_selected.description_fr
                        })
                        .setImage(item_selected.image)
                    interaction.editReply({
                        embeds: [embed_item.toJSON()]
                    });
                } else {
                    let embed_item = new EmbedBuilder()
                        .setTitle(item_selected.name_en + " " + i18next.t("level") + " " + item_selected.level)
                        .setDescription(item_selected.get_message_stats(lang))
                        .setColor(item_selected.color)
                        .addFields({
                            name: "Description: ",
                            value: item_selected.description_en
                        })
                        .setImage(item_selected.image)
                    interaction.editReply({
                        embeds: [embed_item.toJSON()]
                    });
                }
                //interaction.deleteReply()
            }
            catch(e) {
                interaction.member.createDM().then(dm => {
                    dm.send("can't send message in #" + interaction.channel.name + ". Please check my permission in this channel.");
                });
            }
        }
        if(interaction.customId === "search1") {
            list_items.forEach(item => {
                if(item.id === parseInt(interaction.values)){
                    item1 = item;
                    find_object1 = true
                }
            })
            let options2 = []
            let j = 0;
            list_found2.forEach(item_found => {
                let option2
                if (lang === "fr") {
                    option2 = new Option(item_found.name_fr, item_found.id.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                } else {
                    option2 = new Option(item_found.name_en, item_found.id.toString(), i18next.t("level") + " " + item_found.level.toString() + " " + i18next.t(item_found.rarity.toString()), null, false);
                }
                options2.push({label: option2.label, description: option2.description, value: option2.value});
                j++;
            });
            let selectMessage2 = new SelectMenuBuilder()
                .setPlaceholder(i18next.t("chooseNumber"))
                .setOptions(options2)
                .setCustomId("search2")
            const row2 = new ActionRowBuilder().addComponents(selectMessage2);
            interaction.channel.send({
                content: selectMessage2.placeholder,
                components: [row2]
            });
        }
        if(interaction.customId === 'search2') {
            list_items.forEach(item => {
                if(item.id === parseInt(interaction.values)){
                    item2 = item;
                    find_object2 = true
                }
            })
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
                        l++
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
                let embed_message = new EmbedBuilder()
                    .setTitle(i18next.t("itemVS") + item_one_name + " " + i18next.t(item1.rarity) + " VS " + item_two_name + " " + i18next.t(item2.rarity))
                    .setColor("#000000")
                    .addFields(
                        {
                            name: item_one_name.toString(),
                            value: tmpMessage1.toString(),
                            inline: true
                        },
                        {
                            name: item_two_name.toString(),
                            value: tmpMessage2.toString(),
                            inline: true
                        },
                    );
                interaction.channel.send({embeds: [embed_message.toJSON()]});
            }
        }
    }
});
//#endregion
