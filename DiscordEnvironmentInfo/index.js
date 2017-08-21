const Plugin = module.parent.require('../Structures/Plugin');
const electron = require("electron");
class DiscordEnvironmentInfo extends Plugin {
    load() {
        this.registerCommand({
            name: 'envinfo',
            info: 'Shows information about the current environment.',
            func: this.envinfo.bind(this)
        });
    }
    envinfo(args) {
        const v = new Date().getTime();
        webpackJsonp([], {[v]: (a, b, d) => {
            for (let f = 0, g = {};;) {
                g = d(f++) || {};
                let h = g._globalOptions;
                if (h) {
                    var relchannel = Object.keys(process.versions).find(k => k.toLowerCase().startsWith("discord"));
                    if (relchannel === "Discord") {
                        var relchannel = "Stable";
                    }
                    else {
                        var relchannel = relchannel.slice(7);
                    };
                    DI.Helpers.sendLog("Current environment info",
                        "**Release channel:** `" + relchannel + "`"
                        + "\n**App Version:** `" + electron.remote.app.getVersion() + "`"
                        + "\n**Build Number:** `" + h.release + "`"
                        + "\n────────────────────"
                        + "\n**Node version:** `" + process.versions.node + "`"
                        + "\n**Chromium version:** `" + process.versions.chrome
                        + "`\n**v8 version:** `" + process.versions.v8 + "`",
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAABblBMVEUAAAABAQIBAgMCAgMCAwQDAwUEBAcEBQgEBQkFBgkFBgoGCAwHCA0HCQ4ICQ8IChAJCxEKDBQLDRUMDhYMDxcNEBoOERsPEhwQEx4RFCATFyUUGCYXGywYHS4ZHi8bIDMcIjYdIzgeIzggJz4iKUEiKUIjKkQkK0QmLUgnL0onL0spMU8qM1ErNFIrNFMsNVQtNlYwOVsxO10yPF8zPWEzPmI0P2Q1P2U1QGY2QGc2QWc3Qmg5RG07R3E8SHM9SnU+SnY/THlATXtBTn1DUYBFU4VGVIVHVYhIVolJWIxMW5BMW5FMXJJNXJNOXZVOXpZPX5ZPX5dQYJlSYpxUZaFUZqJVZ6NWZ6RWaKVYaahZa6pZa6tabKxdcLNecbRfcrZgdLhidrtidrxjd71lecBlesJmesNnfMVofcdpfshpfslqf8prgMxsgs9tg9Btg9FuhNFuhNJuhdNvhdRvhtVwhtZwh9dxh9dxiNhyidqkq9e9AAAJ6UlEQVR4Ae3de1cSbRfH8R+C5kErrFCkhA5ZEVpBBzrgHaWZGJWR0VmJEoMHJAhyv/vn73utPcPMMHsO3dfnFbS+a1XDzHXtDfqPUwFUAHEqgAqgAqgAKoAKoAKoACqACqACqAAqgAqgAqgAKoAKUP/6trCWu51Opa4uLV1NpdK3c2uFt1/rf3+Axrsn6cuxSWiYjF1OP3nX+DsD/Hx97+IpGHLq4r3XP/+qAN+frURhUnTl2fe/IsDvnTsLsGjhzs5vfwfoFq9NYCgT14pdvwbov7k+BRtMXX/T92GAbw/CsE34wTd/BegXLsBmFwp93wRo5s9AwJl80xcBanenIWT6bs3zAWqZMQgay9Q8HaCeHYew8WzdswE6q5NwwORqx5sBihE4JFL0YIAvCTgo8cVjATr3g3BU8H7HSwHKUTguWvZMgNZNuOJmyxsBPs/DJfOfPRDgTy4I1wRzf9wOsB+HRaOzsbOJxKVLicTZ2OwoLIrvuxugHIZZE+dSjzbeV1v0L63q+41HqXMTMCtcdjNAfgRmHEs8fFk5Ih1HlZcPE8dgxkjetQDtJIwLnX/8qUeG9D49Ph+Cccm2OwEOFmHU8RuvmmRK89WN4zBq8cCNAHtzMGZqpdQjC3ql5SkYM7fnfIDyDAyJP2+TZe3ncRgyU3Y6wHYIBozf2qUh7d4ahwGhbWcDbAYxWDjXIBs0cmEMFtx0MsB6AAPNPu2STbpPZzFQYN25AGsY6ET+F9noV/4EBlpzKsA6BhnNNslmzewoBll3JsBmAANcqZKA6hUMENh0IsB2EPoiJRJSikBfcFs+QDkEXYFMi8S0MgHoCpWlA+zNQNf8RxL1cR66ZvZkAxzMQddyi4S1lqFr7kAyQHsReqZfkANeTEPPYlswQBJ6YhVyRCUGPUm5AHnoSR6SQw6T0JOXClAegY5/yEH/QMdIWSbAfhjaxrbIUVtj0BbelwjwJw5tJz+Qwz6chLb4H4EAOWg7vUuO2z0NbTn7A3wOQlOkQi6oRKAp+NnuAK15aJr/Qa74ofdnatkc4CY0RX6QS35EoOmmvQHK0HS6Qq6pnIamsp0BOlFoOblLLto9CS3Rjo0B7kPL2Ady1YcxaLlvX4AvQWjZIpdtQUvwi20BEvLPvxJPxQm7AhShJUnW7GwwdsiaJLQU7QnQiUBD7JCsWQJjiaw5jEFDpGNLgFVomK6QFwJQZRoaVu0IUJ+EhhfkjQD0Ahom6zYEyELDMnklAC1DQ3b4ALVx00/bzgdozYM3Xhs6QAa8wEfyTgD6GAAvM2yA2hh4GfJSAMqAN1YbMsBd8CItbwVoRcC7O1yA5jR4JfJWACqBN90cKkAevCvktQB0Bbz8MAH6Z8AarXovQHUUrDP9IQIUwMuS9wJQFrzCEAEugHWi6cUAzRNgXbAe4Bt4efJiAMqD981ygAdgzf7yZoBfs2A9sBqgHwbrKXkzAD0FK9y3GOANWOGuVwN0w2C9sRjgOlg58moAyoF13VqA7hQ44w3vBmiMgzPVtRSgCNYt8m4AugVW0VKAa2DtejnALljXrAT4PQFOnGxw+D/GIdkgDs7EbwsBdsB6Tp72HKwdCwHugDPVJk9rT4Fzx0KABXBWyOOWwVkwH+A7WCXyuBJY300HeAbO8R55XO84OM9MB1gB5wZ53g1wVkwHiILzijzvFThRswF+ghNqkuc1Q+D8NBngNTjnyQfOg/PaZIB74DwmH3gMzj2TAS6C84l84BM4F00GOAXGsR75QO8YGKfMBWiAkyBfSIDTMBXgHTgPyRcegvPOVIAn4LwkX3gJzhNTAdLgVMgXKuCkTQW4DMbEEfnC0QQYl00FiIFxjnziHBgxUwEmwUiRT6TAmDQToA7OI/KJR+DUTQT4Cs4G2WV1ibFKdtkA56uJAG/BeU88F1+L896D89ZEgAI4Vb8EqIJTMBFgDZyWXwK0wFkzESAHxij5JQCNgpEzEeA2GLP+CTALxm0TAdJgxPwTIAZG2kSAFBhn/RPgLBipYQMk/BMgMWyAq39jgKsmAiyBcck/AS6BsaQCqL8C6h9B9d+gehBSj8Lqx5D6OaxeiKhXYpIvReUDyL8UlX8tzgeQfy0u/2FEPoD8hxHxT2PyAfhPY/IfR+UDyH8clfg8Lh9A4PO48AEJPoD8AQn5IzLyAaSPyAgckpIPIHBISviYHB9A/pic/EFJ+QDiByUFjsrKBxA4Kit7WJoPIHtYWuC4vHgAgePy8hcm5APIX5iQvzLDBxC9MiNwaUoqgPylKflrc/IB5K/N0QI4y6IB5C9Oyl+dlQ8gf3VW/vI0H0Dy8rTA9XmZAPLX59UABTVCQw1RUWN01CAlNUpLDVNT4/TUQEU1UlMNVVVjddVgZTVaWw1XV+P11YIFtWLD/0tWtqSWrKg1O2rRklq1pZatqXV7auGiWrmplq6qtbtq8bJava2Wr6v1+7QfhraxLXLU1hi0hfdJIgCVR6DjHxeef3kjZZIJQHnoSR6SQw6T0JMnqQCUhJ5YhRxRiUFPkuQCtBehZ/oFOWBrGnoW24IB6GAOupZbJKy1DF1zByQZgPZmoGv+I4n6OA9dM3skG4DKIegKZFokppUJQFeoTNIBaDsIfZESCSlFoC+4TfIBaDOAAa5USUD1CgYIbJITAWgdg4xmm2SzZnYUg6yTMwFoDQOdyP8iG/3Kn8BAa+RUAFoPYKDZp12ySffpLAYKrJNzAWgziMHCuQbZoJELY7DgJjkZgLZDMGD81i4NaffWOAwIbZOzAag8A0Piz9tkWft5HIbMlMnpALQ3B2Omlks9sqBXWp6CMXN75HwAOliEUcdvvGqSKc1XN47DqMUDciMAtZMwLnT+8aceGdL79Ph8CMYl2yQfgJcfgRnHEg9fVo5Ix1Hl5cPEMZgxkidyLQCVwzBr4lzq0cb7aov+pVV9v/EodW4CZoXL5GYA2o/DotHZ2NlE4tKlROJsbHYUFsX3yd0A9CcXhGuCuT/kZADe53m4ZP4zkQcCUOsmXHGzRc4H4JWjcFy0TOSZANS5H4Sjgvc75FYA3pcEHJT4QjYB2aYYgUMiRSIPBqDO6iQcMLnaIfcD8OrZcQgbz9bJTiB71TJjEDSWqZG9QHar3Z2GkOm7NbIbyH7N/BkIOJNvkv1AEvqFC7DZhUKfJICEfHsQhm3CD76REJCY/pvrU7DB1PU3fRIDktQtXpvAUCauFbskCSTs986dBVi0cGfnNwkDOeD7s5UoTIquPPtODgA55OfrexdPwZBTF++9/kkOATmp8e5J+nJsEhomY5fTT941yEkgF9S/vi2s5W6nU6mrS0tXU6n07dxa4e3XOrkA9B+iAqgAKoAKoAKoACqACqACqAAqgAqgAqgAKoAKoAKoACqACvB/yrq+wnGuaGsAAAAASUVORK5CYII=");
                    break
                }
            }
        }},[v]);
    }
    
    get configTemplate() { return { color: '00ff85' }; }
}
module.exports = DiscordEnvironmentInfo;