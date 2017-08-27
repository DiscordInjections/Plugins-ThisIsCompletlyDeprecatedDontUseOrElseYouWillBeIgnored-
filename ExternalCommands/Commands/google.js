const google = require('google');
const log = (str) => window.DI.Helpers.sendLog('Google', str, 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Google-favicon-2015.png');
module.exports = {
    info: 'Searches for things on Google.',
    usage: '<query> [results: <number>] [--send]',
    func: (args) => {
        if (!args[0]) {
            return log(`You need to specify arguments:\n\`\`\`<query> [results: <number>] [--send]\`\`\``);
        }

        const sendToChannel = args.includes('--send');
        args = args.join(' ').replace('--send', '');
        const resultsRX = /results: *([0-9]*)/g;
        let results = resultsRX.exec(args);
        if (results) {
            results = parseInt(results[1]);
            if (results < 1) {
                return log('You can\'t request less than one result.');
            }
            args = args.replace(`results: ${results}`, '');
        } else {
            results = 3; // default amount of results to display if the results parameter isn't supplied
        }

        google(args, (err, res) => {
            if (err) {
                return log(`Something went wrong while searching.\n\`\`\`${err.stack}\`\`\``);
            }

            res = res.links.filter(link => link.href && link.description);
            if (!res[0]) {
                return log('No results found. Please try a different search term.');
            }

            if (results > res.length) {
                results = res.length;
            }

            const embeds = [];
            for (let i = 0; i < results; i++) {
                embeds[i] = {
                    title: `Search results for ${args}`,
                    url: res[i].href,
                    description: res[i].description
                };
            }

            if (sendToChannel) {
                if (!window.DI.client.selectedChannel) {
                    return;
                }
                const embedPerms = window.DI.client.selectedChannel.type !== 'text' || window.DI.client.selectedChannel.permissionsFor(window.DI.client.user).has('EMBED_LINKS');

                if (embedPerms) {
                    window.DI.client.selectedChannel.send({ embed: embeds[0] });
                } else {
                    window.DI.client.selectedChannel.send(embeds[0].description);
                }
            } else {
                log({ embeds });
            }
        });
    }
};
