const i18nm = require('i18next-express-middleware');

class CustomDetector extends i18nm.LanguageDetector {
    constructor(options) {
        super();
        this.options = {
            fallbackLang: 'en',
            languages: [],
            ...options
        };
    }

    detect(req, res) {
        if (!req) {
            return null;
        }

        if (req.originalUrl) {
            let split = req.originalUrl.split('/');

            if (this.options.languages.indexOf(split[1]) > -1) {
                return split[1];
            }
        }

        if (req.params && req.params.lang) {
            return req.params.lang;
        }

        return this.options.fallbackLang;
    }
}

module.exports = CustomDetector;