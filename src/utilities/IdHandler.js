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
}

export default IdHandler;