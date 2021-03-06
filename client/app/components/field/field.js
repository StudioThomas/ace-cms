import angular from 'angular';
import he from 'he/he';

import fieldComponent from './field.component';
import FieldFactory from './field.factory';

import fieldAttachment from './fieldAttachment/fieldAttachment';
import fieldAudio from './fieldAudio/fieldAudio';
import fieldCheckbox from './fieldCheckbox/fieldCheckbox';
import fieldColor from './fieldColor/fieldColor';
import fieldDate from './fieldDate/fieldDate';
import fieldEmbedly from './fieldEmbedly/fieldEmbedly';
import fieldEntity from './fieldEntity/fieldEntity';
import fieldEntityGrid from './fieldEntityGrid/fieldEntityGrid';
import fieldEntityTile from './fieldEntityTile/fieldEntityTile';
import fieldImage from './fieldImage/fieldImage';
import fieldKeyValue from './fieldKeyValue/fieldKeyValue';
import fieldNumber from './fieldNumber/fieldNumber';
import fieldRichText from './fieldRichText/fieldRichText';
import fieldSelect from './fieldSelect/fieldSelect';
import fieldTaxonomy from './fieldTaxonomy/fieldTaxonomy';
import fieldText from './fieldText/fieldText';
import fieldTextArea from './fieldTextArea/fieldTextArea';
import fieldUser from './fieldUser/fieldUser';
import fieldVideo from './fieldVideo/fieldVideo';
import fieldVimeo from './fieldVimeo/fieldVimeo';

const fieldModule = angular.module('field', [
  fieldAttachment.name,
  fieldAudio.name,
  fieldCheckbox.name,
  fieldColor.name,
  fieldDate.name,
  fieldEmbedly.name,
  fieldEntity.name,
  fieldEntityGrid.name,
  fieldEntityTile.name,
  fieldImage.name,
  fieldKeyValue.name,
  fieldNumber.name,
  fieldRichText.name,
  fieldSelect.name,
  fieldTaxonomy.name,
  fieldText.name,
  fieldTextArea.name,
  fieldUser.name,
  fieldVideo.name,
  fieldVimeo.name,
])

  .config(() => {
    'ngInject';
  })

  .filter('field2String', ($window, $filter, FieldFactory) => {
    'ngInject';

    return (field, fieldOptions, wordLimit = Infinity) => {
      let output = '';

      output = FieldFactory.field(fieldOptions.type).toString(field ? field.value : null);

      if (typeof output !== 'string') {
        throw Error(`Cannot convert ${fieldOptions.type} field to string`);
      }

      output = $filter('simplifyText')(output);

      output = $filter('truncateWords')(output, wordLimit);

      output = he.decode(output);

      output = output.trim();

      return output;
    };
  })

  .factory('FieldFactory', FieldFactory)

  .directive('field', fieldComponent);

export default fieldModule;
