class IdHandler {
    static formatDate(date) {
        // Parameter checks
        if (!date) {
            throw new Error('IdHandler.formatDate(): date parameter cannot be empty.');
        }
        if (!(date instanceof Date)) {
            const errorString =
                'input for IdHandler.formatDate() must be a Date object, not '
                + date.constructor.name
                + '.';
            throw new TypeError(errorString);
        }

        // Format date into hyphenated short date string
        const shortDateString = [
            date.getMonth() + 1,
            date.getDate(),
            date.getFullYear()
        ].join('-');

        return shortDateString;
    }

    
    static parseDate(dateString) {
        // Parameter checks
        if (!dateString) {
            throw new Error('IdHandler.parseDate(): dateString parameter cannot be empty.');
        }
        if (!(typeof dateString === 'string')) {
            const errorString =
                'input for IdHandler.parseDate() must be a string, not '
                + dateString.constructor.name
                + '.';
            throw new TypeError(errorString);
        }

        const dateFromString = new Date(dateString);

        return dateFromString;
    }
}

export default IdHandler;