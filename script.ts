const imgElement = document.getElementById('img__element') as HTMLImageElement;
const croppieContainer = document.getElementById('croppieContainer') as HTMLDivElement;

const croppieInstance = new Croppie(croppieContainer, {
  viewport: { width: 200, height: 200, type: 'circle' },
  boundary: { width: 300, height: 300 },
  enableResize: false
});

const btnCrop = document.getElementById('btnCrop') as HTMLButtonElement;
const btnUpload = document.getElementById('upload') as HTMLInputElement;
const btnRemove = document.getElementById('btnRemove') as HTMLButtonElement;
const btnConfirm = document.getElementById('btnConfirm') as HTMLButtonElement;
const btnCancelCrop = document.getElementById('btnCancelCrop') as HTMLButtonElement;
const btnCancelConfirm = document.getElementById('btnCancelConfirm') as HTMLButtonElement;

enum StateEnum {
  noPhoto,
  hasPhoto,
}

let state = StateEnum.noPhoto;


btnUpload.addEventListener('change', (e: Event) => {
  const file = (e.target as HTMLInputElement).files![0];
  
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    croppieInstance.bind({
      url: event.target!.result as string,
    });
  }
  
  renderCropper();
  hideimgWrapper();
  hidePlaceholder();
  renderCropButtons();
})

btnRemove.addEventListener('click', (e) => {
  const pWrapper = document.getElementById('placeholderWrapper') as HTMLDivElement;
  const imgWrapper = document.getElementById('imgWrapper') as HTMLDivElement;
  
  imgElement.src = "";
  state = StateEnum.noPhoto;
  if (!imgWrapper.classList.contains('hidden')) {
    imgWrapper.classList.add('hidden');
  }

  if (pWrapper.classList.contains('hidden')) {
    pWrapper.classList.remove('hidden');
  }

  resetDeleteButtonColor();
})

btnCrop.addEventListener('click', () => {
  const previewElement = document.getElementById('preview__element') as HTMLImageElement;
  croppieInstance.result('canvas').then(function (result) {
    previewElement.src = result;
  });

  hideCropper();
  renderPreview();
  renderConfirmButtons();
})

btnCancelCrop.addEventListener('click', (e) => {
  const previewElement = document.getElementById('preview__element') as HTMLImageElement;
  previewElement.src = "";

  if (state === StateEnum.hasPhoto) {
    renderImgWrapper();
  } else {
    renderPlaceholder();
  }

  hideCropper();
  hidePreview();
  renderPreButtons();
})

btnCancelConfirm.addEventListener('click', (e) => {
  const previewElement = document.getElementById('preview__element') as HTMLImageElement;
  previewElement.src = "";

  if (state === StateEnum.hasPhoto) {
    renderImgWrapper();
  } else {
    renderPlaceholder();
  }

  hideCropper();
  hidePreview();
  renderPreButtons();
})

btnConfirm.addEventListener('click', (e) => {
  const previewElement = document.getElementById('preview__element') as HTMLImageElement;
  imgElement.src = previewElement.src;
  previewElement.src = "";

  state = StateEnum.hasPhoto;

  hidePreview();
  renderPreButtons();
  renderImgWrapper();
  renderDeleteButtonColor();
})

function dragLeaveHandler() {
  const body = document.getElementsByTagName('body')[0];
  if (body.classList.contains('filter')) {
    body.classList.remove('filter');
  }
}

function dragOverHandler(ev) {
  if (!ev.dataTransfer.types.includes('Files')) {
    return;
  }

  const body = document.getElementsByTagName('body')[0];
  if (!body.classList.contains('filter')) {
    body.classList.add('filter');
  }
  
  ev.preventDefault();
}

function dropHandler(ev) {
  const body = document.getElementsByTagName('body')[0];
  if (body.classList.contains('filter')) {
    body.classList.remove('filter');
  }

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        // const img = document.getElementById('img') as HTMLImageElement;
        const file = item.getAsFile() as File;
        const reader = new FileReader();
        
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          // img.src = reader.result as string;
          croppieInstance.bind({
            url: event.target!.result as string,
          });
        }

        hidePreview();
        renderCropper();
        hideimgWrapper();
        hidePlaceholder();
        renderCropButtons();
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function renderPreview() {
  const previewWrapper = document.getElementById('previewWrapper') as HTMLDivElement;
  if (previewWrapper.classList.contains('hidden')) {
    previewWrapper.classList.remove('hidden');
  }
}

function hidePreview() {
  const previewWrapper = document.getElementById('previewWrapper') as HTMLDivElement;
  if (!previewWrapper.classList.contains('hidden')) {
    previewWrapper.classList.add('hidden');
  }
}

function renderDeleteButtonColor() {
  if (btnRemove.classList.contains('button-inactive')) {
    btnRemove.classList.remove('button-inactive');
  }

  if (!btnRemove.classList.contains('bg-red')) {
    btnRemove.classList.add('bg-red');
  }
}

function resetDeleteButtonColor() {
  if (!btnRemove.classList.contains('button-inactive')) {
    btnRemove.classList.add('button-inactive');
  }

  if (btnRemove.classList.contains('bg-red')) {
    btnRemove.classList.remove('bg-red');
  }
}

function hidePlaceholder() {
  const pWrapper = document.getElementById('placeholderWrapper') as HTMLDivElement;
  if (!pWrapper.classList.contains('hidden')) {
    pWrapper.classList.add('hidden');
  }
}

function renderPlaceholder() {
  const pWrapper = document.getElementById('placeholderWrapper') as HTMLDivElement;
  if (pWrapper.classList.contains('hidden')) {
    pWrapper.classList.remove('hidden');
  }
}

function renderCropper() {
  if (croppieContainer.classList.contains('hidden')) {
    croppieContainer.classList.remove('hidden');
  }
}

function hideCropper() {
  if (!croppieContainer.classList.contains('hidden')) {
    croppieContainer.classList.add('hidden');
  }
}

function renderImgWrapper() {
  const imgWrapper = document.getElementById('imgWrapper') as HTMLDivElement;

  if (imgWrapper.classList.contains('hidden')) {
    imgWrapper.classList.remove('hidden');
  }
}

function hideimgWrapper() {
  const imgWrapper = document.getElementById('imgWrapper') as HTMLDivElement;

  if (!imgWrapper.classList.contains('hidden')) {
    imgWrapper.classList.add('hidden');
  }
}

function renderCropButtons() {
  const pre = document.getElementById('__pre') as HTMLDivElement;
  const crop = document.getElementById('__crop') as HTMLDivElement;
  const confirmButtons = document.getElementById('__confirm') as HTMLDivElement;
  
  if (!pre.classList.contains('hidden')) {
    pre.classList.add('hidden');
  }

  if (!confirmButtons.classList.contains('hidden')) {
    confirmButtons.classList.add('hidden');
  }

  if (crop.classList.contains('hidden')) {
    crop.classList.remove('hidden');
  }
}

function renderConfirmButtons() {
  const pre = document.getElementById('__pre') as HTMLDivElement;
  const crop = document.getElementById('__crop') as HTMLDivElement;
  const confirmButtons = document.getElementById('__confirm') as HTMLDivElement;
  
  if (!pre.classList.contains('hidden')) {
    pre.classList.add('hidden');
  }

  if (!crop.classList.contains('hidden')) {
    crop.classList.add('hidden');
  }

  if (confirmButtons.classList.contains('hidden')) {
    confirmButtons.classList.remove('hidden');
  }
}

function renderPreButtons() {
  const pre = document.getElementById('__pre') as HTMLDivElement;
  const crop = document.getElementById('__crop') as HTMLDivElement;
  const confirmButtons = document.getElementById('__confirm') as HTMLDivElement;

  if (!crop.classList.contains('hidden')) {
    crop.classList.add('hidden');
  }

  if (!confirmButtons.classList.contains('hidden')) {
    confirmButtons.classList.add('hidden');
  }
  
  if (pre.classList.contains('hidden')) {
    pre.classList.remove('hidden');
  }
}
