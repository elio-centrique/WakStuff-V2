# WakStuff-V2
<p>WakStuff is a Discord bot for the game Wakfu&copy; created with the JSON data provided by Ankama Games&copy; <br>
WakStuff was developed to give informations about gears, and other usefull features.
</p>

## How to use it
<p>First of all, you need to be an administrator of a server to invite the bot.
If you are, congratulation, you can click on this link to invite the bot: <br/>
https://discordapp.com/oauth2/authorize?client_id=507553140330201089&scope=bot&permissions=0 <br/>
This bot don't need any extra permission, but keep in mind that it needs reading and writing message, and send links in channels to work.
</p>

## And then?
<p>That's all, the bot is ready to use, yeah ! </p>

## Commands
<p> Here the list of all the commands available: (the default prefix is "w!") <br/>
Arguments between {} are mandatory, arguments between [] are optional. Those symbols don't need to be written.
  
### Configuration
<ul>
<li> w!language [lang] <br/> Retrieve the actual language. If [lang] is given, change the current language to the given one. Available languages: FR, EN </li>
<li> w!prefix [prefix] <br/> Retrieve the actual prefix. If [prefix] is given, change the current prefix to the given one. </li>
<li> w!configure {lang} {prefix} <br/> Configure the bot to be used with given language and prefix. Can be used even if you already configure the bot. </li>
</ul>

### Objects
<ul>
<li> w!search {something} <br/> Search an item with "something" in their name and retrieve its description and stats. </li>
<li> w!compare <br/> Fire the comparison procedure to compare stats of two items.</li>
</ul>

### Help
<ul>
<li> w!help <br/> Send an help message.</li>
</ul>

### Almanax
<ul>
<li> w!almanax <br/> Send the almanax of the day.</li>
</ul>

## Support
<p> If you need help with the bot (connection issues, usage, suggestions, etc...), you can join the discord server: <br>
https://discord.gg/w5kbMsT <br>
</p>

## Contribution

### Installation
<p>You can contribute to this project by cloning it. <p>
<p>First of all, you need to install a NodeJS environnement <br>
Then, go to the repository folder, open a CMD and type "npm install" (keep it open after the installation) <br>
Then, create an env file with database and discord app token variables in it.
That's it, the bot is ready to use.<br>
To launch it, type "node Wakfstuff.js", and invite your bot on your server by creating a invitation link: <br>
https://discordapi.com/permissions.html (type your Client ID available in your Discord application. The bot don't need any permission.) <br>
</p>

### Github
<p>
The main github repository obey to several rules: <br>
- master branch is a read-only branch. Only me can pull request, commit and push on it. <br>
- develop branch is only a merge branch. Please create a new branch from develop and create a pull request when you need to merge your work. <br>
- you can fork and use the repository as a template. You're free to do wathever you want on it.<br>
<br>
Please respect these rules.
</p>

Wakstuff-V2 is owned by Elio-Centrique. All right reserved &copy; 2020
