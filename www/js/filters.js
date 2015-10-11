angular.module('intra42.filters', [])
    .filter('appUrl', function () {
        return function (input) {
            input = input || '';
            return '/#/app'.concat(input.match(new RegExp("https?://[a-z0-9\.]+(.*)"))[1]);
        };
    })
    .filter('level', function () {
        return function (input) {
            input = input || 0;
            var level = input.toFixed(2).toString().split('.');
            level[1] = parseInt(level[1]);
            return level[0] + ' - ' + level[1] + '%';
        };
    })
    .filter('progressLevel', function () {
        return function (input) {
            input = input || 0;
            var level = input.toFixed(2).toString().split('.');
            level[1] = parseInt(level[1]);
            return level[1];
        };
    })
    .filter('length', function () {
        return function (countable) {
            countable = countable || [];
            if (typeof(countable) == 'object')
                countable = Object.keys(countable);
            return countable.length;
        };
    })
    .filter('msToWeeks', function () {
        return function (ms) {
            ms = ms || 0;
            return (ms / 60 / 60 / 24 / 7).toFixed();
        };
    })
    .filter('userImageUrl', function () {
        return function (login) {
            if (!login)
                return '/img/logo42.png';
            return 'https://cdn.42.fr/userprofil/profilview/' + login + '.jpg'
        }
    })
    .filter('defenseDate', function () {
        return function (date) {
            if (!date)
                return null;

            date = new Date(date);

            var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayOfWeek = weekday[date.getDay()];

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                month = months[date.getMonth()];

            var suffix = function (e) {
                switch (e) {
                    case 1:
                        return "st";
                        break;
                    case 2:
                        return "nd";
                        break;
                    case 3:
                        return "rd";
                        break;
                    default:
                        return "th";
                        break;
                }
            };

            var meridiem = date.getHours() > 12 ? "PM" : "AM";

            return 'on ' + dayOfWeek + ', ' + date.getDate() + suffix(date.getDate()) + ' ' + month + ' at ' + date.getHours() + (date.getMinutes() ? ':' + date.getMinutes() : '') + meridiem;
        }
    })
    .filter('trustUrl', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    })
    .filter('slugify', function () {
        return function (text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    })
;