class FieldAttachmentController {
  /* @ngInject */
  constructor ($rootScope, $window, $timeout, $mdDialog, appConfig) {
    const vm = this;

    vm.originalValue = vm.fieldModel.value;

    const attachmentExtensions = 'pdf,doc,docx,csv,xls,txt';

    const uploadOptions = vm.fieldOptions;

    vm.flowOptions = {
      target: `${$rootScope.assistUrl}/${$rootScope.assetSlug}/file/upload`,
      query: {
        options: JSON.stringify(uploadOptions),
      },
      headers: {
        Authorization: `Basic ${$rootScope.assistCredentials}`,
      },
      singleFile: true,
      events: {
        fileAdded: (flow, file) => {
          const extensions = attachmentExtensions;

          const valid = extensions.indexOf(file.getExtension()) > -1;

          if (!valid) {
            $mdDialog.show(
              $mdDialog.alert()
                .title('Upload Error')
                .textContent(`${file.name} is not a valid file type.`)
                .ok('Close')
            );
          }

          file.valid = valid;

          return valid;
        },
        fileSuccess: (flow, file, message) => {
          const result = JSON.parse(message);

          const metadata = {
            format: result.file.ext.replace('.', ''),
          };

          vm.fieldModel.value = {
            file: result.file,
            original: result.original,
            metadata,
          };
        },
        filesSubmitted: (flow, files) => {
          if (files.filter(file => file.valid).length) {
            flow.upload();
          }
        },
        uploadStart: () => {
          vm.uploading = true;
        },
        complete: () => {
          vm.uploading = false;
        },
        progress: (flow) => {
          vm.progress = Math.round(flow.progress() * 100);
        },
        error: (flow, error) => {
          flow.cancel();

          $mdDialog.show(
            $mdDialog.alert()
              .title('Upload Error')
              .textContent(error.message || error)
              .ok('Close')
          );
        },
      },
    };

    vm.download = () => {
      $window.open(`${appConfig.assistUrl}/${$rootScope.assetSlug}/file/download/${vm.fieldModel.value.file.name}${vm.fieldModel.value.file.ext}/${vm.fieldModel.value.original.fileName}`);
    };

    vm.delete = async () => {
      const confirm = await $mdDialog.show(
        $mdDialog.confirm()
          .multiple(true)
          .title('Delete forever')
          .textContent('Are you sure? Be warned, this can\'t be undone.')
          .cancel('Cancel')
          .ok('Delete')
      );

      if (!confirm) {
        return;
      }

      $timeout(() => {
        vm.fieldModel.value = null;
      });
    };

    vm.fileUrl = async () => {
      const fileUrl = `${appConfig.assistUrl}/${$rootScope.assetSlug}/file/view/${vm.fieldModel.value.file.name}${vm.fieldModel.value.file.ext}/${vm.fieldModel.value.original.fileName}`;

      $mdDialog.show(
        $mdDialog.prompt()
          .multiple(true)
          .title('File URL')
          .placeholder('File URL')
          .ariaLabel('File URL')
          .initialValue(fileUrl)
          .ok('Close')
      );
    };
  }
}

export default FieldAttachmentController;
