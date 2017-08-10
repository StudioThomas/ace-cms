import angular from 'angular';
import fieldRichTextComponent from './fieldRichText.component';
import settingsTemplate from './fieldRichText.settings.jade';

const fieldRichTextModule = angular.module('fieldRichText', [])

  .config(() => {
    'ngInject';
  })

  .run(($filter, FieldFactory) => {
    'ngInject';

    FieldFactory.registerField('richText', {
      name: 'Rich Text',
      settingsTemplate,
      toString(value) {
        return $filter('cleanHTML')(value.html);
      },
      toDb(value, settings) {
        if (!value) {
          value = {
            html: '',
            entities: [],
          };
        }

        const pattern = 'href=["\']urn:entity:(\\S+)["\']';
        let re = new RegExp(pattern, 'gim');
        const matchStrings = value.html.match(re);

        if (matchStrings) {
          value.entities = matchStrings.map((matchString) => {
            re = new RegExp(pattern, 'gim');

            const match = re.exec(matchString);

            return {
              id: match[1],
            };
          });
        }

        return value;
      },
    });

  })

  .directive('fieldRichText', fieldRichTextComponent);

export default fieldRichTextModule;
